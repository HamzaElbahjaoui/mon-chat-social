const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Envoyer un message (POST)
router.post('/', chatController.sendMessage);

// Lire l'historique (GET /api/chat/MOI/MON_AMI)
router.get('/:userId/:friendId', chatController.getMessages);

module.exports = router;