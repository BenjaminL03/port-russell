const mongoose = require("mongoose");

/**
 * Schéma Mongoose pour les réservations
 */
const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro de catway est requis"],
    ref: "Catway",
  },
  clientName: {
    type: String,
    required: [true, "Le nom du client est requis"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"],
  },
  boatName: {
    type: String,
    required: [true, "Le nom du bateau est requis"],
    trim: true,
    minlength: [2, "Le nom du bateau doit contenir au moins 2 caractères"],
  },
  startDate: {
    type: Date,
    required: [true, "La date de début est requise"],
  },
  endDate: {
    type: Date,
    required: [true, "La date de fin est requise"],
    validate: {
      validator: function (value) {
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
