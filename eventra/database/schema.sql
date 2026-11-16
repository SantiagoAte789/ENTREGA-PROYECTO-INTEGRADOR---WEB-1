-- Eventra - Esquema de base de datos (PostgreSQL)
DROP TABLE IF EXISTS reserva, evento, telefono_persona, cliente, agente, administrador, persona, ciudad, departamento, pais CASCADE;

CREATE TABLE pais (
  id_pais SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE departamento (
  id_departamento SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_pais INT NOT NULL REFERENCES pais(id_pais),
  UNIQUE (nombre, id_pais)
);

CREATE TABLE ciudad (
  id_ciudad SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  id_departamento INT NOT NULL REFERENCES departamento(id_departamento),
  UNIQUE (nombre, id_departamento)
);

CREATE TABLE persona (
  id_persona SERIAL PRIMARY KEY,
  identificacion VARCHAR(30) NOT NULL UNIQUE,      -- cédula o pasaporte
  nombre_completo VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,             -- necesario para el inicio de sesión
  direccion VARCHAR(200) NOT NULL,
  id_ciudad INT NOT NULL REFERENCES ciudad(id_ciudad)
);

CREATE TABLE telefono_persona (
  id_telefono SERIAL PRIMARY KEY,
  id_persona INT NOT NULL REFERENCES persona(id_persona) ON DELETE CASCADE,
  numero VARCHAR(30) NOT NULL
);

CREATE TABLE cliente (
  id_persona INT PRIMARY KEY REFERENCES persona(id_persona) ON DELETE CASCADE,
  puntos INT NOT NULL DEFAULT 0,
  visualizacion_publicidad BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE agente (
  id_persona INT PRIMARY KEY REFERENCES persona(id_persona) ON DELETE CASCADE,
  comision NUMERIC(5,2) NOT NULL DEFAULT 0,        -- porcentaje
  experiencia INT NOT NULL DEFAULT 0               -- años
);

CREATE TABLE administrador (
  id_persona INT PRIMARY KEY REFERENCES persona(id_persona) ON DELETE CASCADE,
  salario NUMERIC(12,2) NOT NULL DEFAULT 0,
  horario VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TABLE evento (
  codigo_evento SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  teatro VARCHAR(150) NOT NULL,
  id_ciudad INT NOT NULL REFERENCES ciudad(id_ciudad),
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ NOT NULL,
  capacidad INT NOT NULL CHECK (capacidad > 0),
  precio_base NUMERIC(12,2) NOT NULL CHECK (precio_base >= 0),
  observaciones TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'Programado'
    CHECK (estado IN ('Programado','En Boletería','En Vivo','Finalizado','Cancelado')),
  causa_cancelacion TEXT,
  id_agente INT NOT NULL REFERENCES agente(id_persona),
  CHECK (fecha_fin > fecha_inicio)
);

CREATE TABLE reserva (
  id_reserva SERIAL PRIMARY KEY,
  id_cliente INT NOT NULL REFERENCES cliente(id_persona),
  codigo_evento INT NOT NULL REFERENCES evento(codigo_evento),
  fecha_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valor_total NUMERIC(12,2) NOT NULL CHECK (valor_total >= 0),
  numero_entradas INT NOT NULL CHECK (numero_entradas > 0),
  observaciones TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'Reservada'
    CHECK (estado IN ('Reservada','Confirmada','Cancelada')),
  causa_cancelacion TEXT
);
