const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations");
const { checkJWT } = require("../middlewares/private");

/**
 * GET /catways/:id/reservations - Liste des réservations d'un catway (protégée)
 */
router.get("/catways/:id/reservations", checkJWT, async (req, res) => {
  try {
    const reservations = await reservationService.getReservationsByCatway(
      parseInt(req.params.id)
    );
    res.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /catways/:id/reservations/:idReservation - Détails d'une réservation (protégée)
 */
router.get(
  "/catways/:id/reservations/:idReservation",
  checkJWT,
  async (req, res) => {
    try {
      const reservation = await reservationService.getReservationById(
        req.params.idReservation
      );
      res.json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * POST /catways/:id/reservations - Créer une réservation (protégée)
 */
router.post("/catways/:id/reservations", checkJWT, async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(
      parseInt(req.params.id),
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Réservation créée avec succès",
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * PUT /catways/:id/reservations/:idReservation - Modifier une réservation (protégée)
 */
router.put(
  "/catways/:id/reservations/:idReservation",
  checkJWT,
  async (req, res) => {
    try {
      const reservation = await reservationService.updateReservation(
        req.params.idReservation,
        req.body
      );
      res.json({
        success: true,
        message: "Réservation modifiée avec succès",
        data: reservation,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation (protégée)
 */
router.delete(
  "/catways/:id/reservations/:idReservation",
  checkJWT,
  async (req, res) => {
    try {
      const result = await reservationService.deleteReservation(
        req.params.idReservation
      );
      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
