require("dotenv").config();
const debug = require("debug")("facturas:con");
const chalk = require("chalk");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/proyectos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, err => {
  if (err) {
    debug(chalk.red("No se ha podido iniciar MongoDB"));
    debug(chalk.red(err));
    process.exit(1);
  }
  debug(chalk.green("Iniciado MongoDB"));
});
