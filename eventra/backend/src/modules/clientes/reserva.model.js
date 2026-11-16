module.exports = {
  table: 'reserva',
  pk: 'id_reserva',
  fields: ['id_cliente', 'codigo_evento', 'fecha_hora', 'valor_total', 'numero_entradas', 'observaciones', 'estado', 'causa_cancelacion'],
  filters: ['id_cliente', 'codigo_evento', 'estado'],
  select: `SELECT r.*, ev.nombre AS evento, p.nombre_completo AS cliente
           FROM reserva r
           JOIN evento ev ON ev.codigo_evento = r.codigo_evento
           JOIN persona p ON p.id_persona = r.id_cliente`
};
