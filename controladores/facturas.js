const { DateTime } = require("luxon");
let facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utils/errores");

const getFacturas = (filtros) => {
  const {
    abonadas, vencidas, ordenPor, orden, nPorPagina, pagina
  } = filtros;
  let facturaConSinFiltro = facturasJSON;
  const facturaTemporal = [...facturasJSON];
  if (abonadas) {
    facturaConSinFiltro = facturasJSON.filter(factura => factura.abonada.toString() === abonadas);
  }
  if (vencidas) {
    facturaConSinFiltro = facturasJSON.filter(factura => (vencidas === "true"
      ? factura.vencimiento < DateTime.now().ts : factura.vencimiento > DateTime.now().ts));
  }
  if (ordenPor && orden) {
    if (ordenPor === "fecha" && orden === "asc") {
      facturaConSinFiltro = facturaTemporal.sort((a, b) => ((a.fecha < b.fecha) ? 1 : -1));
    } else if (ordenPor === "fecha" && orden === "desc") {
      facturaConSinFiltro = facturaTemporal.sort((a, b) => ((a.fecha > b.fecha) ? 1 : -1));
    } else if (ordenPor === "base" && orden === "asc") {
      facturaConSinFiltro = facturaTemporal.sort((a, b) => ((a.base < b.base) ? 1 : -1));
    } else if (ordenPor === "base" && orden === "desc") {
      facturaConSinFiltro = facturaTemporal.sort((a, b) => ((a.base > b.base) ? 1 : -1));
    }
  } if (nPorPagina) {
    facturaConSinFiltro = facturaTemporal.slice(3);
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
const sustituirFactura = (idFactura, facturaModificada) => {
  const factura = facturasJSON.find(factura => factura.id === idFactura);
  const respuesta = {
    factura: null,
    error: null
  };
  if (factura) {
    facturaModificada.id = factura.id;
    facturasJSON[facturasJSON.indexOf(factura)] = facturaModificada;
    respuesta.factura = facturaModificada;
  } else {
    const { error, factura } = crearFactura(facturaModificada);
    if (error) {
      respuesta.error = error;
    } else {
      respuesta.factura = factura;
    }
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
  sustituirFactura,
  modificarFactura,
  deleteFactura
};
