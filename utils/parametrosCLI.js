const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse();

module.exports = program.opts();
