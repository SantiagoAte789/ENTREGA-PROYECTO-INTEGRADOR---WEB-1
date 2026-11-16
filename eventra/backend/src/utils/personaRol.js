const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const httpError = require('./httpError');

// Perfiles que especializan a Persona
const ROLES = {
  cliente: { table: 'cliente', pk: 'id_persona', rolFields: ['puntos', 'visualizacion_publicidad'] },
  agente: { table: 'agente', pk: 'id_persona', rolFields: ['comision', 'experiencia'] },
  administrador: { table: 'administrador', pk: 'id_persona', rolFields: ['salario', 'horario'] }
};

const PERSONA_FIELDS = ['identificacion', 'nombre_completo', 'correo', 'direccion', 'id_ciudad'];

function parsePhones(value) {
  if (value === undefined || value === null) return null;
  const list = Array.isArray(value) ? value : String(value).split(',');
  return list.map((n) => String(n).trim()).filter(Boolean);
}

async function savePhones(cn, idPersona, phones) {
  if (phones === null) return;
  await cn.query('DELETE FROM telefono_persona WHERE id_persona = $1', [idPersona]);
  for (const numero of phones) {
    await cn.query('INSERT INTO telefono_persona (id_persona, numero) VALUES ($1, $2)', [idPersona, numero]);
  }
}

/**
 * Service para Persona (role = null) o para un perfil (cliente, agente, administrador).
 * Crea/actualiza/elimina la persona y su perfil en una sola transacción.
 */
function makePersonaService(role = null) {
  const table = role ? role.table : null;
  const rolFields = role ? role.rolFields : [];
  const rolCols = rolFields.map((f) => `, r.${f}`).join('');
  const rolJoin = table ? `JOIN ${table} r ON r.id_persona = p.id_persona` : '';
  const rolName = table
    ? ''
    : `, CASE
         WHEN EXISTS (SELECT 1 FROM administrador a WHERE a.id_persona = p.id_persona) THEN 'administrador'
         WHEN EXISTS (SELECT 1 FROM agente g WHERE g.id_persona = p.id_persona) THEN 'agente'
         WHEN EXISTS (SELECT 1 FROM cliente c2 WHERE c2.id_persona = p.id_persona) THEN 'cliente'
         ELSE NULL END AS rol`;

  const select = `
    SELECT p.id_persona, p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
           ci.nombre AS ciudad${rolCols}${rolName},
           COALESCE((SELECT json_agg(t.numero ORDER BY t.id_telefono)
                     FROM telefono_persona t WHERE t.id_persona = p.id_persona), '[]'::json) AS telefonos
    FROM persona p ${rolJoin}
    JOIN ciudad ci ON ci.id_ciudad = p.id_ciudad`;

  async function getById(id) {
    const { rows } = await pool.query(`SELECT * FROM (${select}) x WHERE x.id_persona = $1`, [id]);
    return rows[0] || null;
  }

  async function getAll() {
    const { rows } = await pool.query(`SELECT * FROM (${select}) x ORDER BY x.id_persona`);
    return rows;
  }

  async function create(data) {
    if (!data.password) throw httpError(400, 'La contraseña es obligatoria');
    const cn = await pool.connect();
    try {
      await cn.query('BEGIN');
      const hash = await bcrypt.hash(String(data.password), 10);
      const { rows } = await cn.query(
        `INSERT INTO persona (identificacion, nombre_completo, correo, password_hash, direccion, id_ciudad)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_persona`,
        [data.identificacion, data.nombre_completo, data.correo, hash, data.direccion, data.id_ciudad]
      );
      const id = rows[0].id_persona;
      await savePhones(cn, id, parsePhones(data.telefonos));
      if (table) {
        const cols = rolFields.filter((f) => data[f] !== undefined && data[f] !== '' && data[f] !== null);
        await cn.query(
          `INSERT INTO ${table} (id_persona${cols.map((c) => ', ' + c).join('')})
           VALUES ($1${cols.map((_, i) => `, $${i + 2}`).join('')})`,
          [id, ...cols.map((c) => data[c])]
        );
      }
      await cn.query('COMMIT');
      return getById(id);
    } catch (e) {
      await cn.query('ROLLBACK');
      throw e;
    } finally {
      cn.release();
    }
  }

  async function update(id, data) {
    if (!(await getById(id))) return null;
    const cn = await pool.connect();
    try {
      await cn.query('BEGIN');
      const sets = [];
      const vals = [];
      PERSONA_FIELDS.forEach((f) => {
        if (data[f] !== undefined) {
          vals.push(data[f] === '' ? null : data[f]);
          sets.push(`${f} = $${vals.length}`);
        }
      });
      if (data.password) {
        vals.push(await bcrypt.hash(String(data.password), 10));
        sets.push(`password_hash = $${vals.length}`);
      }
      if (sets.length) {
        vals.push(id);
        await cn.query(`UPDATE persona SET ${sets.join(', ')} WHERE id_persona = $${vals.length}`, vals);
      }
      await savePhones(cn, id, parsePhones(data.telefonos));
      if (table) {
        const cols = rolFields.filter((f) => data[f] !== undefined && data[f] !== '' && data[f] !== null);
        if (cols.length) {
          await cn.query(
            `UPDATE ${table} SET ${cols.map((c, i) => `${c} = $${i + 1}`).join(', ')} WHERE id_persona = $${cols.length + 1}`,
            [...cols.map((c) => data[c]), id]
          );
        }
      }
      await cn.query('COMMIT');
      return getById(id);
    } catch (e) {
      await cn.query('ROLLBACK');
      throw e;
    } finally {
      cn.release();
    }
  }

  async function remove(id) {
    const extra = table ? ` AND EXISTS (SELECT 1 FROM ${table} WHERE id_persona = $1)` : '';
    const { rowCount } = await pool.query(`DELETE FROM persona WHERE id_persona = $1${extra}`, [id]);
    return rowCount > 0;
  }

  return { getAll, getById, create, update, remove };
}

module.exports = { ROLES, makePersonaService };
