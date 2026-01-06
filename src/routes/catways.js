const express = require("express");
const router = express.Router();
const catwayService = require("../services/catways");
const { checkJWT } = require("../middlewares/private");

/**
 * GET /catways - Liste tous les catways (protégée)
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
 * GET /catways/:id - Détails d'un catway (protégée)
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
 * POST /catways - Créer un catway (protégée)
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
 * PUT /catways/:id - Modifier un catway (protégée)
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
 * DELETE /catways/:id - Supprimer un catway (protégée)
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
