const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");
const connectDB = require("./db/mongo");
const { swaggerUi, specs } = require("./swagger/swagger");

// Import des routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const catwaysRouter = require("./routes/catways");
const reservationsRouter = require("./routes/reservations");
const pagesRouter = require("./routes/pages");

const app = express();

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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

// Faire confiance au proxy (pour Render)
app.set("trust proxy", 1);

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

// Routes Pages (EJS)
app.use("/", pagesRouter);

// Routes API
app.use("/api", authRouter);
app.use("/api/users", usersRouter);
app.use("/api", reservationsRouter);
app.use("/api/catways", catwaysRouter);

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
