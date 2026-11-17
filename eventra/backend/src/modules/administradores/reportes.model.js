// Consultas SQL de los reportes. Los ingresos se calculan con reservas en estado 'Confirmada'.
module.exports = {
  general: `
    SELECT (SELECT COUNT(*) FROM cliente) AS clientes,
           (SELECT COUNT(*) FROM agente) AS agentes,
           (SELECT COUNT(*) FROM administrador) AS administradores,
           (SELECT COUNT(*) FROM reserva) AS reservas,
           (SELECT COUNT(*) FROM evento) AS eventos`,

  promedioIngresosAgente: `
    SELECT a.id_persona AS id_agente, p.nombre_completo AS agente,
           COUNT(r.id_reserva) AS reservas_confirmadas,
           COALESCE(SUM(r.valor_total), 0) AS ingresos_totales,
           COALESCE(ROUND(AVG(r.valor_total), 2), 0) AS promedio_ingresos
    FROM agente a
    JOIN persona p ON p.id_persona = a.id_persona
    LEFT JOIN evento e ON e.id_agente = a.id_persona
    LEFT JOIN reserva r ON r.codigo_evento = e.codigo_evento AND r.estado = 'Confirmada'
    GROUP BY a.id_persona, p.nombre_completo
    ORDER BY ingresos_totales DESC`,

  promedioIngresosCliente: `
    SELECT c.id_persona AS id_cliente, p.nombre_completo AS cliente,
           COUNT(r.id_reserva) AS reservas_confirmadas,
           COALESCE(SUM(r.valor_total), 0) AS ingresos_totales,
           COALESCE(ROUND(AVG(r.valor_total), 2), 0) AS promedio_ingresos
    FROM cliente c
    JOIN persona p ON p.id_persona = c.id_persona
    LEFT JOIN reserva r ON r.id_cliente = c.id_persona AND r.estado = 'Confirmada'
    GROUP BY c.id_persona, p.nombre_completo
    ORDER BY ingresos_totales DESC`,

  ingresosMensuales: `
    SELECT m.mes, COALESCE(SUM(r.valor_total), 0) AS ingresos
    FROM generate_series(1, 12) AS m(mes)
    LEFT JOIN reserva r
      ON EXTRACT(MONTH FROM r.fecha_hora) = m.mes
     AND EXTRACT(YEAR FROM r.fecha_hora) = $1::int
     AND r.estado = 'Confirmada'
    GROUP BY m.mes
    ORDER BY m.mes`,

  reservasEventoMes: `
    SELECT e.codigo_evento, e.nombre AS evento,
           EXTRACT(MONTH FROM r.fecha_hora)::int AS mes, COUNT(*) AS reservas
    FROM reserva r
    JOIN evento e ON e.codigo_evento = r.codigo_evento
    WHERE EXTRACT(YEAR FROM r.fecha_hora) = $1::int
    GROUP BY e.codigo_evento, e.nombre, EXTRACT(MONTH FROM r.fecha_hora)
    ORDER BY e.nombre, mes`,

  eventosAgenteCiudad: `
    SELECT p.nombre_completo AS agente, c.nombre AS ciudad, COUNT(*) AS eventos
    FROM evento e
    JOIN persona p ON p.id_persona = e.id_agente
    JOIN ciudad c ON c.id_ciudad = e.id_ciudad
    GROUP BY p.nombre_completo, c.nombre
    ORDER BY p.nombre_completo, c.nombre`,

  eventosUbicacion: `
    SELECT pa.nombre AS pais, d.nombre AS departamento, c.nombre AS ciudad,
           e.nombre AS evento, e.fecha_inicio, e.estado
    FROM evento e
    JOIN ciudad c ON c.id_ciudad = e.id_ciudad
    JOIN departamento d ON d.id_departamento = c.id_departamento
    JOIN pais pa ON pa.id_pais = d.id_pais
    ORDER BY pa.nombre, d.nombre, c.nombre, e.fecha_inicio`,

  historialReservasCliente: `
    SELECT p.nombre_completo AS cliente, r.id_reserva, ev.nombre AS evento,
           r.fecha_hora, r.numero_entradas, r.valor_total, r.estado
    FROM reserva r
    JOIN persona p ON p.id_persona = r.id_cliente
    JOIN evento ev ON ev.codigo_evento = r.codigo_evento
    ORDER BY p.nombre_completo, r.fecha_hora DESC`,

  reservasCanceladas: `
    SELECT r.id_reserva, p.nombre_completo AS cliente, ev.nombre AS evento,
           r.fecha_hora, r.valor_total, r.causa_cancelacion AS causa
    FROM reserva r
    JOIN persona p ON p.id_persona = r.id_cliente
    JOIN evento ev ON ev.codigo_evento = r.codigo_evento
    WHERE r.estado = 'Cancelada'
    ORDER BY r.fecha_hora DESC`,

  eventosCancelados: `
    SELECT e.codigo_evento, e.nombre AS evento, c.nombre AS ciudad,
           e.fecha_inicio, e.causa_cancelacion AS causa
    FROM evento e
    JOIN ciudad c ON c.id_ciudad = e.id_ciudad
    WHERE e.estado = 'Cancelado'
    ORDER BY e.fecha_inicio DESC`
};
