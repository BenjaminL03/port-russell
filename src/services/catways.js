const Catway = require("../models/catway");

/**
 * Récupère tous les catways
 * @returns {Promise<Array>}
 */
const getAllCatways = async () => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    return catways;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des catways: " + error.message
    );
  }
};

/**
 * Récupère un catway par son numéro
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Object>}
 */
const getCatwayByNumber = async (catwayNumber) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: catwayNumber });
    if (!catway) {
      throw new Error("Catway non trouvé");
    }
    return catway;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération du catway: " + error.message
    );
  }
};

/**
 * Crée un nouveau catway
 * @param {Object} catwayData - Données du catway
 * @returns {Promise<Object>}
 */
const createCatway = async (catwayData) => {
  try {
    const existingCatway = await Catway.findOne({
      catwayNumber: catwayData.catwayNumber,
    });
    if (existingCatway) {
      throw new Error("Un catway avec ce numéro existe déjà");
    }

    const catway = new Catway(catwayData);
    await catway.save();
    return catway;
  } catch (error) {
    throw new Error("Erreur lors de la création du catway: " + error.message);
  }
};

/**
 * Met à jour un catway (seulement catwayState)
 * @param {number} catwayNumber - Numéro du catway
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>}
 */
const updateCatway = async (catwayNumber, updateData) => {
  try {
    // On ne peut modifier que l'état
    const allowedUpdates = { catwayState: updateData.catwayState };

    const catway = await Catway.findOneAndUpdate(
      { catwayNumber: catwayNumber },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!catway) {
      throw new Error("Catway non trouvé");
    }

    return catway;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour du catway: " + error.message
    );
  }
};

/**
 * Supprime un catway
 * @param {number} catwayNumber - Numéro du catway
 * @returns {Promise<Object>}
 */
const deleteCatway = async (catwayNumber) => {
  try {
    const catway = await Catway.findOneAndDelete({
      catwayNumber: catwayNumber,
    });
    if (!catway) {
      throw new Error("Catway non trouvé");
    }
    return { message: "Catway supprimé avec succès" };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression du catway: " + error.message
    );
  }
};

module.exports = {
  getAllCatways,
  getCatwayByNumber,
  createCatway,
  updateCatway,
  deleteCatway,
};
