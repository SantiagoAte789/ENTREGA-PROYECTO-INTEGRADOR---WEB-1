module.exports = {
  table: 'departamento',
  pk: 'id_departamento',
  fields: ['nombre', 'id_pais'],
  filters: ['id_pais'],
  select: `SELECT d.*, p.nombre AS pais
           FROM departamento d JOIN pais p ON p.id_pais = d.id_pais`
};
