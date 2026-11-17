module.exports = {
  table: 'evento',
  pk: 'codigo_evento',
  fields: ['nombre', 'descripcion', 'teatro', 'id_ciudad', 'fecha_inicio', 'fecha_fin', 'capacidad', 'precio_base', 'observaciones', 'estado', 'causa_cancelacion', 'id_agente'],
  filters: ['id_agente', 'id_ciudad', 'estado'],
  select: `SELECT e.*, c.nombre AS ciudad, p.nombre_completo AS agente
           FROM evento e
           JOIN ciudad c ON c.id_ciudad = e.id_ciudad
           JOIN persona p ON p.id_persona = e.id_agente`
};
