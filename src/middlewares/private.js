const jwt = require("jsonwebtoken");

/**
 * Middleware pour vérifier le token JWT
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const checkJWT = (req, res, next) => {
  const token = req.headers.authorization || req.session?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "token required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "token invalide",
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est connecté (pour les pages EJS)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction next
 */
const checkSession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect("/");
  }
  next();
};

module.exports = { checkJWT, checkSession };
