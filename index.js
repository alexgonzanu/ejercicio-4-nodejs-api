require("dotenv").config();
const express = require("express");
const debug = require("debug");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const options = require("./utils/parametrosCLI");

const { serverError, notFoundError, generalError } = require("./utils/errores");
const rutaFacturas = require("./rutas/facturas");

const app = express();

const puerto = options.puerto || process.env.PUERTO || 5000;

const server = app.listen(puerto, () => {
  debug(chalk.yellow(`Servidor escuchando en el puerto ${puerto}`));
});

server.on("error", err => serverError(err, puerto));

app.use(cors());
app.use(morgan("dev"));
app.use("/facturas", rutaFacturas);
app.get("/", (req, res, next) => {
  res.redirect("/facturas");
});
app.use(notFoundError);
app.use(generalError);