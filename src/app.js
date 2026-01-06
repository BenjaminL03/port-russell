const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");
const connectDB = require("./db/mongo");

// Import des routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const catwaysRouter = require("./routes/catways");
const reservationsRouter = require("./routes/reservations");

const app = express();

// Configuration CORS
app.use(cors());

// Connexion à MongoDB
connectDB();

// Configuration du moteur de vue EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Method Override pour PUT/DELETE dans les formulaires
app.use(methodOverride("_method"));

// Configuration des sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    },
  })
);

// Routes API
app.use("/api", authRouter);
app.use("/api/users", usersRouter);
app.use("/api", reservationsRouter); // AVANT catways car routes imbriquées
app.use("/api/catways", catwaysRouter);

// Route page d'accueil (à créer plus tard)
app.get("/", (req, res) => {
  res.send("Port Russell API - Page d'accueil à venir");
});

// Gestion 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erreur serveur",
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV}`);
});

module.exports = app;
