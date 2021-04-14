const express = require("express");
const {
  getProyectos, getProyecto, crearProyecto, sustituirProyecto, modificarProyecto, borrarProyecto
} = require("../controladores/proyectos");
const { badRequestError, idNoExisteError } = require("../utils/errores");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const proyectos = await getProyectos();
  res.json({ total: proyectos.length, datos: proyectos });
});
router.get("/pendientes", async (req, res, next) => {
  const proyectosPendientes = await getProyectos("pendiente");
  res.json({ total: proyectosPendientes.length, datos: proyectosPendientes });
});
router.get("/en-progreso", async (req, res, next) => {
  const proyectosWip = await getProyectos("wip");
  res.json({ total: proyectosWip.length, datos: proyectosWip });
});
router.get("/finalizados", async (req, res, next) => {
  const proyectosFinalizados = await getProyectos("finalizado");
  res.json({ total: proyectosFinalizados.length, datos: proyectosFinalizados });
});
router.get("/proyecto/:idProyecto", async (req, res, next) => {
  const { idProyecto } = req.params;
  const { proyecto, error } = await getProyecto(idProyecto);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
router.post("/proyecto", async (req, res, next) => {
  const error400 = badRequestError(req);
  if (error400) {
    return next(error400);
  }
  const nuevoProyecto = req.body;
  console.log(nuevoProyecto);
  const { proyecto, error } = await crearProyecto(nuevoProyecto);
  if (error) {
    next(error);
  } else {
    res.status(201).json({ id: proyecto.id });
  }
});
router.put("/proyecto/:idProyecto", async (req, res, next) => {
  const { idProyecto } = req.params;
  const proyectoModificado = req.body;
  const { error, proyecto } = await sustituirProyecto(idProyecto, proyectoModificado);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
router.patch("/proyecto/:idProyecto", async (req, res, next) => {
  const errorIdNoExiste = idNoExisteError(req);
  if (errorIdNoExiste) {
    return next(errorIdNoExiste);
  }
  const { idProyecto } = req.params;
  const proyectoModificado = req.body;
  const { error, proyecto } = await modificarProyecto(idProyecto, proyectoModificado);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});
router.delete("/proyecto/:idProyecto", async (req, res, next) => {
  const { idProyecto } = req.params;
  const { error, proyecto } = await borrarProyecto(idProyecto);
  if (error) {
    next(error);
  } else {
    res.json(proyecto);
  }
});

module.exports = router;
