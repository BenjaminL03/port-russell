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
/**
 * GET /catways/create - Formulaire de création catway
 */
router.get("/catways/create", checkSession, (req, res) => {
  res.render("catways/create", {
    user: req.session.user,
    error: null,
  });
});

/**
 * POST /catways/create - Créer un catway
 */
router.post("/catways/create", checkSession, async (req, res) => {
  try {
    await catwayService.createCatway(req.body);
    res.redirect("/catways");
  } catch (error) {
    res.render("catways/create", {
      user: req.session.user,
      error: error.message,
    });
  }
});

/**
 * GET /catways/:id/edit - Formulaire de modification catway
 */
router.get("/catways/:id/edit", checkSession, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayByNumber(
      parseInt(req.params.id)
    );
    res.render("catways/edit", {
      user: req.session.user,
      catway: catway,
      error: null,
    });
  } catch (error) {
    res.redirect("/catways");
  }
});

/**
 * POST /catways/:id/edit - Modifier un catway
 */
router.post("/catways/:id/edit", checkSession, async (req, res) => {
  try {
    await catwayService.updateCatway(parseInt(req.params.id), req.body);
    res.redirect("/catways");
  } catch (error) {
    const catway = await catwayService.getCatwayByNumber(
      parseInt(req.params.id)
    );
    res.render("catways/edit", {
      user: req.session.user,
      catway: catway,
      error: error.message,
    });
  }
});

/**
 * POST /catways/:id/delete - Supprimer un catway
 */
router.post("/catways/:id/delete", checkSession, async (req, res) => {
  try {
    await catwayService.deleteCatway(parseInt(req.params.id));
    res.redirect("/catways");
  } catch (error) {
    res.redirect("/catways");
  }
});
/**
 * GET /reservations/create - Formulaire de création réservation
 */
router.get("/reservations/create", checkSession, async (req, res) => {
  try {
    const catways = await catwayService.getAllCatways();
    res.render("reservations/create", {
      user: req.session.user,
      catways: catways,
      error: null,
    });
  } catch (error) {
    res.redirect("/reservations");
  }
});

/**
 * POST /reservations/create - Créer une réservation
 */
router.post("/reservations/create", checkSession, async (req, res) => {
  try {
    await reservationService.createReservation(
      parseInt(req.body.catwayNumber),
      req.body
    );
    res.redirect("/reservations");
  } catch (error) {
    const catways = await catwayService.getAllCatways();
    res.render("reservations/create", {
      user: req.session.user,
      catways: catways,
      error: error.message,
    });
  }
});

/**
 * GET /reservations/:id/edit - Formulaire de modification réservation
 */
router.get("/reservations/:id/edit", checkSession, async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(
      req.params.id
    );
    const catways = await catwayService.getAllCatways();
    res.render("reservations/edit", {
      user: req.session.user,
      reservation: reservation,
      catways: catways,
      error: null,
    });
  } catch (error) {
    res.redirect("/reservations");
  }
});

/**
 * POST /reservations/:id/edit - Modifier une réservation
 */
router.post("/reservations/:id/edit", checkSession, async (req, res) => {
  try {
    await reservationService.updateReservation(req.params.id, req.body);
    res.redirect("/reservations");
  } catch (error) {
    const reservation = await reservationService.getReservationById(
      req.params.id
    );
    const catways = await catwayService.getAllCatways();
    res.render("reservations/edit", {
      user: req.session.user,
      reservation: reservation,
      catways: catways,
      error: error.message,
    });
  }
});
/**
 * GET /catways/:id/reservations - Réservations d'un catway spécifique
 */
router.get("/catways/:id/reservations", checkSession, async (req, res) => {
  try {
    const catway = await catwayService.getCatwayByNumber(
      parseInt(req.params.id)
    );
    const reservations = await reservationService.getReservationsByCatway(
      parseInt(req.params.id)
    );
    res.render("catways/reservations", {
      user: req.session.user,
      catway: catway,
      reservations: reservations,
    });
  } catch (error) {
    res.redirect("/catways");
  }
});

/**
 * POST /reservations/:id/delete - Supprimer une réservation
 */
router.post("/reservations/:id/delete", checkSession, async (req, res) => {
  try {
    await reservationService.deleteReservation(req.params.id);
    res.redirect("/reservations");
  } catch (error) {
    res.redirect("/reservations");
  }
});
/**
 * GET /users/create - Formulaire de création utilisateur
 */
router.get("/users/create", checkSession, (req, res) => {
  res.render("users/create", {
    user: req.session.user,
    error: null,
  });
});

/**
 * POST /users/create - Créer un utilisateur
 */
router.post("/users/create", checkSession, async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.redirect("/users");
  } catch (error) {
    res.render("users/create", {
      user: req.session.user,
      error: error.message,
    });
  }
});

/**
 * GET /users/:email/edit - Formulaire de modification utilisateur
 */
router.get("/users/:email/edit", checkSession, async (req, res) => {
  try {
    const userToEdit = await userService.getUserByEmail(req.params.email);
    res.render("users/edit", {
      user: req.session.user,
      userToEdit: userToEdit,
      error: null,
    });
  } catch (error) {
    res.redirect("/users");
  }
});

/**
 * POST /users/:email/edit - Modifier un utilisateur
 */
router.post("/users/:email/edit", checkSession, async (req, res) => {
  try {
    await userService.updateUser(req.params.email, req.body);
    res.redirect("/users");
  } catch (error) {
    const userToEdit = await userService.getUserByEmail(req.params.email);
    res.render("users/edit", {
      user: req.session.user,
      userToEdit: userToEdit,
      error: error.message,
    });
  }
});

/**
 * POST /users/:email/delete - Supprimer un utilisateur
 */
router.post("/users/:email/delete", checkSession, async (req, res) => {
  try {
    await userService.deleteUser(req.params.email);
    res.redirect("/users");
  } catch (error) {
    res.redirect("/users");
  }
});
module.exports = router;
