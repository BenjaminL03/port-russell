const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les réservations
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro de catway est requis"],
    ref: "Catway",
    min: [1, "Le numéro de catway doit être au moins 1"],
  },
  clientName: {
    type: String,
    required: [true, "Le nom du client est requis"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
    maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
  },
  boatName: {
    type: String,
    required: [true, "Le nom du bateau est requis"],
    trim: true,
    minlength: [2, "Le nom du bateau doit contenir au moins 2 caractères"],
    maxlength: [100, "Le nom du bateau ne peut pas dépasser 100 caractères"],
  },
  startDate: {
    type: Date,
    required: [true, "La date de début est requise"],
    validate: {
      validator: function (value) {
        return value instanceof Date && !isNaN(value);
      },
      message: "Date de début invalide",
    },
  },
  endDate: {
    type: Date,
    required: [true, "La date de fin est requise"],
    validate: {
      validator: function (value) {
        if (!(value instanceof Date) || isNaN(value)) {
          return false;
        }
        return value > this.startDate;
      },
      message: "La date de fin doit être après la date de début",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
