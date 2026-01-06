const express = require("express");
const router = express.Router();
const userService = require("../services/users");

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authentification utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@russell.com
 *               password:
 *                 type: string
 *                 example: Admin123!
 *     responses:
 *       200:
 *         description: Authentification réussie
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    const result = await userService.authenticate(email, password);

    req.session.user = result.user;
    req.session.token = result.token;

    res.json({
      success: true,
      message: "Authentification réussie",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers la page d'accueil
 */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
