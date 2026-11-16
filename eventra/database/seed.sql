-- Eventra - Datos de prueba (ejecutar después de schema.sql)
-- Contraseña de todos los usuarios de prueba: Eventra123*
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO pais (nombre) VALUES ('Colombia');
INSERT INTO departamento (nombre, id_pais) VALUES ('Valle del Cauca', 1), ('Antioquia', 1);
INSERT INTO ciudad (nombre, id_departamento) VALUES ('Tuluá', 1), ('Cali', 1), ('Medellín', 2);

INSERT INTO persona (identificacion, nombre_completo, correo, password_hash, direccion, id_ciudad) VALUES
('1001', 'Admin Eventra', 'admin@eventra.com',    crypt('Eventra123*', gen_salt('bf')), 'Calle 1 # 1-01',   1),
('1002', 'Laura Agente',  'agente1@eventra.com',  crypt('Eventra123*', gen_salt('bf')), 'Carrera 2 # 2-02', 2),
('1003', 'Mateo Agente',  'agente2@eventra.com',  crypt('Eventra123*', gen_salt('bf')), 'Carrera 3 # 3-03', 3),
('2001', 'Ana Cliente',   'cliente1@eventra.com', crypt('Eventra123*', gen_salt('bf')), 'Calle 4 # 4-04',   1),
('2002', 'Luis Cliente',  'cliente2@eventra.com', crypt('Eventra123*', gen_salt('bf')), 'Calle 5 # 5-05',   2);

INSERT INTO administrador (id_persona, salario, horario) VALUES (1, 4500000, 'Lunes a viernes 8:00-17:00');
INSERT INTO agente (id_persona, comision, experiencia) VALUES (2, 5.00, 3), (3, 7.50, 5);
INSERT INTO cliente (id_persona, puntos, visualizacion_publicidad) VALUES (4, 120, TRUE), (5, 40, FALSE);

INSERT INTO telefono_persona (id_persona, numero) VALUES
(1, '3001112233'), (2, '3004445566'), (2, '3007778899'), (4, '3010001122');

INSERT INTO evento (nombre, descripcion, teatro, id_ciudad, fecha_inicio, fecha_fin, capacidad, precio_base, observaciones, estado, causa_cancelacion, id_agente) VALUES
('Concierto Sinfónico', 'Orquesta sinfónica en vivo', 'Teatro Municipal', 2, '2026-12-05 19:00-05', '2026-12-05 22:00-05', 500, 80000, NULL, 'En Boletería', NULL, 2),
('Obra: La Casa Azul', 'Obra de teatro clásica', 'Teatro Jorge Isaacs', 1, '2026-11-28 20:00-05', '2026-11-28 22:00-05', 200, 50000, NULL, 'Programado', NULL, 2),
('Festival de Jazz', 'Noche de jazz con artistas invitados', 'Teatro Pablo Tobón Uribe', 3, '2026-10-10 18:00-05', '2026-10-10 23:00-05', 800, 120000, NULL, 'Finalizado', NULL, 3),
('Stand Up Night', 'Comedia en vivo', 'Teatro Municipal', 2, '2026-09-15 20:00-05', '2026-09-15 22:00-05', 300, 60000, NULL, 'Cancelado', 'Baja venta de boletas', 3);

INSERT INTO reserva (id_cliente, codigo_evento, fecha_hora, valor_total, numero_entradas, observaciones, estado, causa_cancelacion) VALUES
(4, 1, '2026-03-10 10:00-05', 160000, 2, NULL, 'Confirmada', NULL),
(4, 2, '2026-04-02 15:30-05',  50000, 1, NULL, 'Reservada',  NULL),
(5, 1, '2026-04-20 09:00-05', 240000, 3, NULL, 'Confirmada', NULL),
(5, 3, '2026-05-15 12:00-05', 240000, 2, NULL, 'Confirmada', NULL),
(4, 3, '2026-05-16 13:00-05', 120000, 1, NULL, 'Cancelada',  'Cambio de planes del cliente'),
(5, 4, '2026-06-01 11:00-05',  60000, 1, NULL, 'Cancelada',  'Evento cancelado');
