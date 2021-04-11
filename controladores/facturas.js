const { DateTime } = require("luxon");
let facturasJSON = require("../facturas.json").facturas;
const { generaError } = require("../utils/errores");
const options = require("../utils/parametrosCLI");
const Factura = require("../db/models/factura");

const filtrosFacturas = async (filtros, tipo) => {
  const {
    abonadas, vencidas, ordenPor, orden, nPorPagina, pagina
  } = filtros;
  let facturaConSinFiltro;
  if (options.datos.toLowerCase() === "json") {
    if (tipo) {
      facturaConSinFiltro = facturasJSON.filter(factura => factura.tipo === tipo);
    } else {
      facturaConSinFiltro = facturasJSON;
    }
  } else if (options.datos.toLowerCase() === "mysql") {
    if (tipo) {
      facturaConSinFiltro = await Factura.findAll(
        {
          where: {
            tipo
          }
        }
      );
    } else {
      facturaConSinFiltro = Factura.findAll();
    }
  }

  if (abonadas) {
    facturaConSinFiltro = facturaConSinFiltro.filter(factura => factura.abonada.toString() === abonadas);
  }
  if (vencidas) {
    facturaConSinFiltro = facturaConSinFiltro.filter(factura => (vencidas === "true"
      ? factura.vencimiento < DateTime.now().ts : factura.vencimiento > DateTime.now().ts));
  }
  if (ordenPor && orden) {
    if (ordenPor === "fecha" && orden === "asc") {
      facturaConSinFiltro = facturaConSinFiltro.sort((a, b) => ((a.fecha < b.fecha) ? 1 : -1));
    } else if (ordenPor === "fecha" && orden === "desc") {
      facturaConSinFiltro = facturaConSinFiltro.sort((a, b) => ((a.fecha > b.fecha) ? 1 : -1));
    } else if (ordenPor === "base" && orden === "asc") {
      facturaConSinFiltro = facturaConSinFiltro.sort((a, b) => ((a.base < b.base) ? 1 : -1));
    } else if (ordenPor === "base" && orden === "desc") {
      facturaConSinFiltro = facturaConSinFiltro.sort((a, b) => ((a.base > b.base) ? 1 : -1));
    }
  }
  if (nPorPagina) {
    if (pagina) {
      facturaConSinFiltro = facturaConSinFiltro.slice(+pagina * +nPorPagina, (+pagina + 1) * +nPorPagina);
    } else {
      facturaConSinFiltro = facturaConSinFiltro.slice(0, +nPorPagina);
    }
  }
  return facturaConSinFiltro;
};
const getFacturas = async (filtros, tipo) => {
  const facturas = await filtrosFacturas(filtros, tipo);
  return facturas;
};

const getFacturaIngreso = async (filtros) => {
  const facturasIngreso = await filtrosFacturas(filtros, "ingreso");
  return facturasIngreso;
};

const getFacturaGastos = async (filtros) => {
  const facturasGasto = await filtrosFacturas(filtros, "gasto");
  return facturasGasto;
};
const getFactura = async id => {
  let facturaID;
  if (options.datos.toLowerCase() === "json") {
    facturaID = facturasJSON.find(factura => factura.id === id);
  } else if (options.datos.toLowerCase() === "mysql") {
    facturaID = await Factura.findByPk(id);
  }
  return facturaID;
};
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
