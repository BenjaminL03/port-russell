const Reservation = require("../models/reservation");

/**
 * Récupère toutes les réservations d'un catway
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Array>}
 */
const getReservationsByCatway = async (catwayNumber) => {
  try {
    const reservations = await Reservation.find({
      catwayNumber: catwayNumber,
    }).sort({ startDate: 1 });
    return reservations;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des réservations: " + error.message
    );
  }
};

/**
 * Récupère une réservation par ID
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>}
 */
const getReservationById = async (reservationId) => {
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      throw new Error("Réservation non trouvée");
    }
    return reservation;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de la réservation: " + error.message
    );
  }
};

/**
 * Crée une nouvelle réservation
 * @param {number} catwayNumber - Numéro du catway
 * @param {Object} reservationData - Données de la réservation
 * @returns {Promise<Object>}
 */
const createReservation = async (catwayNumber, reservationData) => {
  try {
    const reservation = new Reservation({
      catwayNumber: catwayNumber,
      ...reservationData,
    });
    await reservation.save();
    return reservation;
  } catch (error) {
    throw new Error(
      "Erreur lors de la création de la réservation: " + error.message
    );
  }
};

/**
 * Met à jour une réservation
 * @param {string} reservationId - ID de la réservation
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>}
 */
const updateReservation = async (reservationId, updateData) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      throw new Error("Réservation non trouvée");
    }

    return reservation;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de la réservation: " + error.message
    );
  }
};

/**
 * Supprime une réservation
 * @param {string} reservationId - ID de la réservation
 * @returns {Promise<Object>}
 */
const deleteReservation = async (reservationId) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(reservationId);
    if (!reservation) {
      throw new Error("Réservation non trouvée");
    }
    return { message: "Réservation supprimée avec succès" };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de la réservation: " + error.message
    );
  }
};

/**
 * Récupère toutes les réservations (pour le dashboard)
 * @returns {Promise<Array>}
 */
const getAllReservations = async () => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    return reservations;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des réservations: " + error.message
    );
  }
};

module.exports = {
  getReservationsByCatway,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getAllReservations,
};
