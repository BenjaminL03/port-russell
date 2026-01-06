const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Authentifie un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Token et infos utilisateur
 */
const authenticate = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return {
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    throw new Error("Erreur lors de l'authentification: " + error.message);
  }
};

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<Array>}
 */
const getAllUsers = async () => {
  try {
    const users = await User.find().select("-password");
    return users;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des utilisateurs: " + error.message
    );
  }
};

/**
 * Récupère un utilisateur par email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>}
 */
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de l'utilisateur: " + error.message
    );
  }
};

/**
 * Crée un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>}
 */
const createUser = async (userData) => {
  try {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Tous les champs sont requis");
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }

    const user = new User(userData);
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    throw new Error(
      "Erreur lors de la création de l'utilisateur: " + error.message
    );
  }
};

/**
 * Met à jour un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>}
 */
const updateUser = async (email, updateData) => {
  try {
    if (updateData.password) {
      delete updateData.password;
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de l'utilisateur: " + error.message
    );
  }
};

/**
 * Supprime un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>}
 */
const deleteUser = async (email) => {
  try {
    const user = await User.findOneAndDelete({ email: email });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return { message: "Utilisateur supprimé avec succès" };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de l'utilisateur: " + error.message
    );
  }
};

module.exports = {
  authenticate,
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
