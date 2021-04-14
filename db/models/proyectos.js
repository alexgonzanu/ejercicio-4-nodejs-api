const { Schema, model } = require("mongoose");

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
    required: true
  },
  entrega: {
    type: String,
    required: true
  },
  cliente: {
    type: String,
    required: true
  },
  tecnologias: {
    type: [String]
  }
});

const Proyecto = model("Proyecto", ProyectoSchema, "proyectos");

module.exports = Proyecto;
