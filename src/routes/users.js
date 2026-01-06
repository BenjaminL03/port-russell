const express = require('express');
const router = express.Router();
const userService = require('../services/users');
const { checkJWT } = require('../middlewares/private');

/**
 * POST /users - Créer un utilisateur
 */
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /users - Liste tous les utilisateurs (protégée)
 */
router.get('/', checkJWT, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /users/:email - Détails d'un utilisateur (protégée)
 */
router.get('/:email', checkJWT, async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * PUT /users/:email - Modifier un utilisateur (protégée)
 */
router.put('/:email', checkJWT, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.email, req.body);
    res.json({
      success: true,
      message: 'Utilisateur modifié avec succès',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /users/:email - Supprimer un utilisateur (protégée)
 */
router.delete('/:email', checkJWT, async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.email);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;