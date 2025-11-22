const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Définition des routes
router.post('/add-friend', userController.sendFriendRequest);
router.post('/accept-friend', userController.acceptFriendRequest);
router.post('/refuse-friend', userController.refuseFriendRequest);
router.get('/friend-requests/:userId', userController.getFriendRequests);
router.get('/friends/:userId', userController.getFriends);
router.get('/search', userController.searchUsers);
router.put('/update', userController.updateProfile);
module.exports = router;