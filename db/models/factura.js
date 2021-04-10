const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnection");

const Factura = sequelize.define("Factura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero: DataTypes.STRING(15),
  fecha: DataTypes.STRING(15),
  vencimiento: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: null
  },
  concepto: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: null
  },
  base: DataTypes.DECIMAL(10, 2),
  tipoIva: DataTypes.INTEGER,
  tipo: DataTypes.ENUM("ingreso", "gasto"),
  abonada: DataTypes.TINYINT(1)
}, {
  tableName: "facturas",
  timestamps: false
});

module.exports = Factura;
