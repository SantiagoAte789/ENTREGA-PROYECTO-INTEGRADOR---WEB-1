const bcrypt = require('bcryptjs');
const pool = require('../../config/db');
const httpError = require('../../utils/httpError');
const { ROLES, makePersonaService } = require('../../utils/personaRol');
const { rolesRegistrables } = require('./auth.model');

const ROL_SQL = `CASE
  WHEN EXISTS (SELECT 1 FROM administrador a WHERE a.id_persona = p.id_persona) THEN 'administrador'
  WHEN EXISTS (SELECT 1 FROM agente g WHERE g.id_persona = p.id_persona) THEN 'agente'
  WHEN EXISTS (SELECT 1 FROM cliente c WHERE c.id_persona = p.id_persona) THEN 'cliente'
  ELSE NULL END`;

async function login({ correo, password }) {
  if (!correo || !password) throw httpError(400, 'Correo y contraseña son obligatorios');
  const { rows } = await pool.query(
    `SELECT p.id_persona, p.nombre_completo, p.correo, p.password_hash, ${ROL_SQL} AS rol
     FROM persona p WHERE p.correo = $1`,
    [correo]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
    throw httpError(401, 'Credenciales inválidas');
  }
  if (!user.rol) throw httpError(403, 'El usuario no tiene un perfil asignado');
  const { password_hash, ...usuario } = user;
  return usuario;
}

async function register(data) {
  if (!rolesRegistrables.includes(data.rol)) {
    throw httpError(400, "El rol debe ser 'cliente' o 'agente'");
  }
  const extra = data.rol === 'agente' ? { experiencia: data.experiencia } : {};
  const persona = await makePersonaService(ROLES[data.rol]).create({
    identificacion: data.identificacion,
    nombre_completo: data.nombre_completo,
    correo: data.correo,
    password: data.password,
    direccion: data.direccion,
    id_ciudad: data.id_ciudad,
    telefonos: data.telefonos,
    ...extra
  });
  return { id_persona: persona.id_persona, nombre_completo: persona.nombre_completo, correo: persona.correo, rol: data.rol };
}

module.exports = { login, register };
