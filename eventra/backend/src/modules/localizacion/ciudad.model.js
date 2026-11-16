module.exports = {
  table: 'ciudad',
  pk: 'id_ciudad',
  fields: ['nombre', 'id_departamento'],
  filters: ['id_departamento'],
  select: `SELECT c.*, d.nombre AS departamento, p.nombre AS pais
           FROM ciudad c
           JOIN departamento d ON d.id_departamento = c.id_departamento
           JOIN pais p ON p.id_pais = d.id_pais`
};
