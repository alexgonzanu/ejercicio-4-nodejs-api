const { Schema, model } = require("mongoose");
const { DateTime } = require("luxon");

const ProyectoSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    required: true
  },
  aprobado: {
    type: String,
    default: DateTime.now().ts,
    required: true
  },
  entrega: {
    type: String,
    default: DateTime.now().ts,
    required: true
  },
  cliente: {
    type: String,
    required: true
  },
  tecnologias: {
    type: [String],
    required: true
  }
});

const Proyecto = model("Proyecto", ProyectoSchema, "proyectos");

module.exports = Proyecto;
