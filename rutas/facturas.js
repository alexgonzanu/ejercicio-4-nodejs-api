const express = require("express");
const { check, checkSchema } = require("express-validator");

const router = express.Router();
const {
  getFacturas, getFacturaIngreso, getFacturaGastos, getFactura, crearFactura, deleteFactura, modificarFactura, sustituirFactura
} = require("../controladores/facturas");
const { idNoExisteError, badRequestError } = require("../utils/errores");
const facturasJSON = require("../facturas.json").facturas;

const existFactura = idFactura => facturasJSON.find(factura => factura.id === +idFactura);

const getFacturasSchema = tipoFactura => {
  const numero = {
    isLength: {
      errorMessage: "El numero tiene que tener 4 caracteres",
      options: {
        min: 4
      }
    }
  };
  const fecha = {
    errorMessage: "Falta la fecha de la factura",
    notEmpty: true
  };
  const vencimiento = {
    optional: true,
    notEmpty: true
  };
  const concepto = {
    optional: true,
    notEmpty: true
  };
  const base = {
    isFloat: {
      errorMessage: "Valor incorrecto, debe ser un numero",
      options: {
        min: 0
      }
    }
  };
  const tipoIva = {
    isInt: {
      errorMessage: "Valor incorrecto, debe ser un numero",
      notEmpty: true
    }
  };
  const tipo = {
    custom: {
      errorMessage: "Valor incorrecto, debe ser un tipo gasto o ingreso",
      options: value => value === "gasto" || value === "ingreso"
    }
  };
  const abonada = {
    errorMessage: "Valor incorrecto, debe ser un numero"
  };
  switch (tipoFactura) {
    case "completo":
      numero.exists = {
        errorMessage: "Falta el numero de la factura"
      };
      fecha.exists = true;
      base.exists = {
        errorMessage: "Falta la base de la factura"
      };
      tipoIva.exists = true;
      tipo.exists = true;
      abonada.exists = true;
      break;
    case "parcial":
    default:
      numero.optional = true;
      fecha.optional = true;
      base.optional = true;
      tipoIva.optional = true;
      tipo.optional = true;
      abonada.optional = true;
      break;
  }

  return {
    numero,
    fecha,
    vencimiento,
    concepto,
    base,
    tipoIva,
    tipo,
    abonada
  };
};

const facturaCompletaSchema = getFacturasSchema("completo");
const facturaParcialSchema = getFacturasSchema("parcial");

router.get("/", async (req, res, next) => {
  const facturas = await getFacturas(req.query);
  res.json({ total: facturas.length, datos: facturas });
});
router.get("/ingresos", async (req, res, next) => {
  const facturasIngreso = await getFacturaIngreso(req.query, "ingreso");
  res.json({ total: facturasIngreso.length, datos: facturasIngreso });
});
router.get("/gastos", async (req, res, next) => {
  const facturasGasto = await getFacturaGastos(req.query, "gasto");
  res.json({ total: facturasGasto.length, datos: facturasGasto });
});
router.get("/factura/:idFactura",
  check("idFactura", "No existe la factura con esa id").custom(existFactura),
  async (req, res, next) => {
    const error404 = idNoExisteError(req);
    if (error404) {
      return next(error404);
    }
    const idFactura = +req.params.idFactura;
    const factura = await getFactura(idFactura);
    res.json(factura);
  });
router.post("/factura",
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const nuevaFactura = req.body;
    const { factura, error } = crearFactura(nuevaFactura);
    if (error) {
      next(error);
    } else {
      res.json({ id: factura.id });
    }
  });
router.put("/factura/:idFactura",
  checkSchema(facturaCompletaSchema),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const id = +req.params.idFactura;
    const facturaModificada = req.body;
    const { error, factura } = sustituirFactura(id, facturaModificada);
    if (error) {
      next(error);
    } else {
      res.json(factura);
    }
  });
router.patch("/factura/:idFactura",
  checkSchema(facturaParcialSchema),
  check("idFactura", "No existe la factura con esa id").custom(existFactura),
  (req, res, next) => {
    const error400 = badRequestError(req);
    if (error400) {
      return next(error400);
    }
    const errorIdNoExiste = idNoExisteError(req);
    if (errorIdNoExiste) {
      return next(errorIdNoExiste);
    }
    const id = +req.params.idFactura;
    const facturaModificada = req.body;
    res.json(modificarFactura(id, facturaModificada));
  });
router.delete("/factura/:idFactura",
  check("idFactura", "No existe la factura con esa id").custom(existFactura),
  (req, res, next) => {
    const errorIdNotExist = idNoExisteError(req);
    if (errorIdNotExist) {
      return next(errorIdNotExist);
    }
    const idFactura = +req.params.idFactura;
    res.json(deleteFactura(idFactura));
  });

module.exports = router;
