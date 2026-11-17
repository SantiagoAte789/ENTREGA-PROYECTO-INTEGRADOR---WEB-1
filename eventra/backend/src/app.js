require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Verificación del servidor y de la conexión a la base de datos
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'conectada' });
  } catch (e) {
    res.status(500).json({ status: 'error', database: 'sin conexión', message: e.message });
  }
});

// Módulos
app.use('/api', require('./modules/localizacion'));
app.use('/api', require('./modules/auth'));
app.use('/api', require('./modules/clientes'));
app.use('/api', require('./modules/agentes'));
app.use('/api', require('./modules/administradores'));

// Ruta inexistente
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Manejo centralizado de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Eventra escuchando en http://localhost:${PORT}/api`));

module.exports = app;
