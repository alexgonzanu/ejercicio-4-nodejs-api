const debug = require("debug");
const chalk = require("chalk");
const { validationResult } = require("express-validator");

const generaError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.codigo = status;
  return error;
};
const serverError = (err, puerto) => {
  debug(chalk.red.bold("Ha ocurrido un error en el servidor"));
  if (err.code === "EADDRINUSE") {
    debug(chalk.red.bold(`El puerto ${puerto} está ocupado.`));
  }
};
const notFoundError = (req, res, next) => {
  const error = generaError("El endpoint no existe", 404);
  next(error);
};
const generalError = (err, req, res, next) => {
  const error = {
    codigo: err.codigo || 500,
    mensaje: err.codigo ? err.message : "Ha ocurrido un error general"
  };
  res.status(error.codigo).json({ error: true, mensaje: error.mensaje });
};

const idNoExisteError = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    if (mapaErrores.idFactura) {
      error = generaError(mapaErrores.idFactura.msg, 404);
    }
  }
  return error;
};

const badRequestError = req => {
  const errores = validationResult(req);
  let error;
  if (!errores.isEmpty()) {
    const mapaErrores = errores.mapped();
    if (mapaErrores.numero || mapaErrores.fecha || mapaErrores.base || mapaErrores.tipoIva || mapaErrores.tipo || mapaErrores.abonada) {
      error = generaError("La factura no tiene la forma correcta", 400);
      console.log(errores.mapped());
    }
  }
  return error;
};

module.exports = {
  generaError,
  serverError,
  notFoundError,
  generalError,
  idNoExisteError,
  badRequestError
};
