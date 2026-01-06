const express = require("express");
const router = express.Router();
const { checkSession } = require("../middlewares/private");
const userService = require("../services/users");
const catwayService = require("../services/catways");
const reservationService = require("../services/reservations");

/**
 * GET / - Page d'accueil avec formulaire de connexion
 */
router.get("/", (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("index", { error: null });
});

/**
 * POST /login - Traiter la connexion
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticate(email, password);

    req.session.user = result.user;
    req.session.token = result.token;

    res.redirect("/dashboard");
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

/**
 * GET /dashboard - Tableau de bord
 */
router.get("/dashboard", checkSession, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    const reservations = await reservationService.getAllReservations();
    const users = await userService.getAllUsers();

    // Filtrer les réservations en cours
    const now = new Date();
    const activeReservations = reservations.filter(
      (r) => new Date(r.startDate) <= now && new Date(r.endDate) >= now
    );

    res.render("dashboard", {
      user: req.session.user,
      stats: {
        totalCatways: catways.length,
        activeReservations: activeReservations.length,
        totalUsers: users.length,
      },
      reservations: activeReservations,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du tableau de bord");
  }
});

/**
 * GET /catways - Page liste des catways
 */
router.get("/catways", checkSession, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.render("catways/list", {
      user: req.session.user,
      catways: catways,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des catways");
  }
});

/**
 * GET /reservations - Page liste des réservations
 */
router.get("/reservations", checkSession, async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.render("reservations/list", {
      user: req.session.user,
      reservations: reservations,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des réservations");
  }
});

/**
 * GET /users - Page liste des utilisateurs
 */
router.get("/users", checkSession, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.render("users/list", {
      user: req.session.user,
      users: users,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des utilisateurs");
  }
});

module.exports = router;
