// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Définition des chemins
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;