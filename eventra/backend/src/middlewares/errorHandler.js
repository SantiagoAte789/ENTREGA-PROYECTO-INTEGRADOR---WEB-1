// Manejo centralizado de errores de la API
const pgErrors = {
  '23505': [409, 'Ya existe un registro con ese valor único'],
  '23503': [409, 'Referencia inválida o registro relacionado con otros datos'],
  '23502': [400, 'Faltan campos obligatorios'],
  '23514': [400, 'Algún valor no cumple las reglas de validación'],
  '22P02': [400, 'Formato de dato inválido'],
  '22007': [400, 'Formato de fecha inválido']
};

module.exports = (err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  if (pgErrors[err.code]) {
    return res.status(pgErrors[err.code][0]).json({ message: pgErrors[err.code][1], detail: err.detail });
  }
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
};
