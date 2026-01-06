const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les catways (appontements)
 */
const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro de catway est requis"],
    unique: true,
    min: [1, "Le numéro doit être au moins 1"],
    validate: {
      validator: Number.isInteger,
      message: "Le numéro doit être un entier",
    },
  },
  catwayType: {
    type: String,
    required: [true, "Le type de catway est requis"],
    enum: {
      values: ["long", "short"],
      message: 'Le type doit être "long" ou "short"',
    },
    trim: true,
    lowercase: true,
  },
  catwayState: {
    type: String,
    required: [true, "L'état du catway est requis"],
    default: "bon état",
    trim: true,
    minlength: [3, "La description doit contenir au moins 3 caractères"],
    maxlength: [200, "La description ne peut pas dépasser 200 caractères"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Catway = mongoose.model("Catway", catwaySchema);

module.exports = Catway;
