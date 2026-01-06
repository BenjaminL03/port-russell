const express = require("express");
const router = express.Router();
const userService = require("../services/users");

/**
 * POST /login - Authentification
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

    // Stocker dans la session pour les pages EJS
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
 * GET /logout - Déconnexion
 */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
