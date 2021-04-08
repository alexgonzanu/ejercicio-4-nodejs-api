let facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utils/errores");

const getFacturas = () => facturasJSON;
const getFacturaIngreso = () => facturasJSON.filter(factura => factura.tipo === "ingreso");
const getFacturaGastos = () => facturasJSON.filter(factura => factura.tipo === "gasto");
const getFactura = id => facturasJSON.find(factura => factura.id === id);
const deleteFactura = id => {
  const factura = facturasJSON.find(factura => factura.id === id);
  facturasJSON = facturasJSON.filter(factura => factura.id !== id);
  return factura;
};

module.exports = {
  getFacturas,
  getFacturaIngreso,
  getFacturaGastos,
  getFactura,
  deleteFactura
};
