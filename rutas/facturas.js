const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const {
  getFacturas, getFacturaIngreso, getFacturaGastos, getFactura
} = require("../controladores/facturas");
const { idNoExisteError } = require("../utils/errores");
const facturasJSON = require("../facturas.json").facturas;

const existFactura = idFactura => facturasJSON.find(factura => factura.id === +idFactura);

router.get("/", (req, res, next) => {
  const facturas = getFacturas();
  res.json({ total: facturas.length, datos: facturas });
});
router.get("/ingresos", (req, res, next) => {
  const facturasIngreso = getFacturaIngreso();
  res.json({ total: facturasIngreso.length, datos: facturasIngreso });
});
router.get("/gastos", (req, res, next) => {
  const facturasGasto = getFacturaGastos();
  res.json({ total: facturasGasto.length, datos: facturasGasto });
});
router.get("/factura/:idFactura",
  check("idFactura", "No existe la factura con esa id").custom(existFactura),
  (req, res, next) => {
    const error404 = idNoExisteError(req);
    if (error404) {
      return next(error404);
    }
    const idFactura = +req.params.idFactura;
    res.json(getFactura(idFactura));
  });

module.exports = router;
