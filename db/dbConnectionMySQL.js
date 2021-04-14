const { Sequelize } = require("sequelize");
const chalk = require("chalk");

const sequelize = new Sequelize({
  host: "localhost",
  database: "facturas",
  username: "usrfacturas",
  password: "pswfacturas",
  dialect: "mysql",
  logging: mensaje => console.log(mensaje)
});

module.exports = sequelize;
