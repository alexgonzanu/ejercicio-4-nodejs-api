const { DateTime } = require("luxon");
let facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utils/errores");

const getFacturas = (abonadas, vencidas, ordenPor, orden) => {
  let facturaConSinFiltro = facturasJSON;
  /* if (abonadas && vencidas && (ordenPor && orden)) {
    facturaConSinFiltro = facturasJSON.filter(factura => factura.abonada.toString() === abonadas
      && (vencidas === "true"
        ? factura.vencimiento < DateTime.now().ts : factura.vencimiento > DateTime.now().ts));
  } else */
  if (abonadas) {
    facturaConSinFiltro = facturasJSON.filter(factura => factura.abonada.toString() === abonadas);
  } else if (vencidas) {
    facturaConSinFiltro = facturasJSON.filter(factura => (vencidas === "true"
      ? factura.vencimiento < DateTime.now().ts : factura.vencimiento > DateTime.now().ts));
  } else if (ordenPor && orden) {
    if (ordenPor === "fecha" && orden === "asc") {
      // No funciona
      facturaConSinFiltro = facturasJSON.sort((a, b) => new Date(a.fecha) + new Date(b.fecha));
    } else if (ordenPor === "fecha" && orden === "desc") {
      // No funciona
      facturaConSinFiltro = facturasJSON.sort((a, b) => a.fecha - b.fecha);
    } else if (ordenPor === "base" && orden === "asc") {
      facturaConSinFiltro = facturasJSON.sort((a, b) => a.base + b.base);
    } else if (ordenPor === "base" && orden === "desc") {
      facturaConSinFiltro = facturasJSON.sort((a, b) => a.base - b.base);
    }
  }
  return facturaConSinFiltro;
};
const getFacturaIngreso = () => facturasJSON.filter(factura => factura.tipo === "ingreso");
const getFacturaGastos = () => facturasJSON.filter(factura => factura.tipo === "gasto");
const getFactura = id => facturasJSON.find(factura => factura.id === id);
const crearFactura = nuevaFactura => {
  const respuesta = {
    factura: null,
    error: null
  };
  if (facturasJSON.find(factura => factura.numero === nuevaFactura.numero)) {
    const error = generaError("Ya existe la factura", 409);
    respuesta.error = error;
  }
  if (!respuesta.error) {
    nuevaFactura.id = facturasJSON[facturasJSON.length - 1].id + 1;
    facturasJSON.push(nuevaFactura);
    respuesta.factura = nuevaFactura;
  }
  return respuesta;
};
const modificarFactura = (idFactura, cambios) => {
  const factura = facturasJSON.find(alumno => alumno.id === idFactura);
  const facturaModificada = {
    ...factura,
    ...cambios
  };
  facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
  return facturaModificada;
};
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
  crearFactura,
  modificarFactura,
  deleteFactura
};
