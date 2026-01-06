const express = require("express");
const router = express.Router();
const catwayService = require("../services/catways");
const { checkJWT } = require("../middlewares/private");

/**
 * @swagger
 * components:
 *   schemas:
 *     Catway:
 *       type: object
 *       required:
 *         - catwayNumber
 *         - catwayType
 *         - catwayState
 *       properties:
 *         catwayNumber:
 *           type: number
 *           description: Numéro unique du catway
 *         catwayType:
 *           type: string
 *           enum: [long, short]
 *           description: Type de catway
 *         catwayState:
 *           type: string
 *           description: État du catway
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Liste tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 *       401:
 *         description: Non authentifié
 */
router.get("/", checkJWT, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.json({
      success: true,
      data: catways,
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
 * /api/catways/{id}:
 *   get:
 *     summary: Détails d'un catway
 *     tags: [Catways]
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
 *         description: Détails du catway
 *       404:
 *         description: Catway non trouvé
 */
router.get("/:id", checkJWT, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayByNumber(
      parseInt(req.params.id)
    );
    res.json({
      success: true,
      data: catway,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Créer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Catway'
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Données invalides
 */
router.post("/", checkJWT, async (req, res) => {
  try {
    const catway = await catwayService.createCatway(req.body);
    res.status(201).json({
      success: true,
      message: "Catway créé avec succès",
      data: catway,
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
 * /api/catways/{id}:
 *   put:
 *     summary: Modifier un catway
 *     tags: [Catways]
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
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway modifié
 *       404:
 *         description: Catway non trouvé
 */
router.put("/:id", checkJWT, async (req, res) => {
  try {
    const catway = await catwayService.updateCatway(
      parseInt(req.params.id),
      req.body
    );
    res.json({
      success: true,
      message: "Catway modifié avec succès",
      data: catway,
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
 * /api/catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
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
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete("/:id", checkJWT, async (req, res) => {
  try {
    const result = await catwayService.deleteCatway(parseInt(req.params.id));
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
});

module.exports = router;
