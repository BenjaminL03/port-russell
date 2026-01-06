const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations");
const { checkJWT } = require("../middlewares/private");

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - catwayNumber
 *         - clientName
 *         - boatName
 *         - startDate
 *         - endDate
 *       properties:
 *         catwayNumber:
 *           type: number
 *           description: Numéro du catway réservé
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         boatName:
 *           type: string
 *           description: Nom du bateau
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Date de début
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Date de fin
 */

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     summary: Liste des réservations d'un catway
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       401:
 *         description: Non authentifié
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
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Détails d'une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *       404:
 *         description: Réservation non trouvée
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
 * @swagger
 * /api/catways/{id}/reservations:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
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
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Réservation modifiée
 *       404:
 *         description: Réservation non trouvée
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
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
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
