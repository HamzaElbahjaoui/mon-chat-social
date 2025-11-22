const User = require('../models/User');
const Message = require('../models/Message'); // Indispensable pour chercher la date du dernier message

// Fonction utilitaire pour générer l'ID de conversation (Même logique que chatController)
const getConversationId = (userA, userB) => {
    return [userA, userB].sort().join("_");
};

// 1. Envoyer une demande d'ami
exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ message: "Utilisateur introuvable." });
    if (senderId === receiver._id.toString()) return res.status(400).json({ message: "Tu ne peux pas t'ajouter toi-même !" });
    
    if (receiver.friends.includes(senderId)) return res.status(400).json({ message: "Vous êtes déjà amis." });
    if (receiver.friendRequests.includes(senderId)) return res.status(400).json({ message: "Demande déjà envoyée." });

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.json({ message: "Demande envoyée avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 2. Accepter une demande
exports.acceptFriendRequest = async (req, res) => {
  const { userId, requesterId } = req.body;
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "Aucune demande de cet utilisateur." });
    }

    user.friends.push(requesterId);
    requester.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    await user.save();
    await requester.save();

    res.json({ message: "Vous êtes maintenant amis !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 3. Refuser une demande
exports.refuseFriendRequest = async (req, res) => {
  const { userId, requesterId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (!user.friendRequests.includes(requesterId)) {
      return res.status(400).json({ message: "Aucune demande de cet utilisateur." });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);

    await user.save();

    res.json({ message: "Demande d'ami refusée." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 4. Récupérer la liste des amis (TRIÉE PAR DERNIER MESSAGE)
exports.getFriends = async (req, res) => {
  try {
    const currentUserId = req.params.userId;
    
    // A. On récupère l'utilisateur et ses amis
    const user = await User.findById(currentUserId).populate('friends', 'username bio avatar');
    
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // B. Pour chaque ami, on va chercher la date du dernier message échangé
    const friendsWithDetails = await Promise.all(user.friends.map(async (friend) => {
        const conversationId = getConversationId(currentUserId, friend._id);
        
        // On cherche le dernier message de cette conversation
        const lastMessage = await Message.findOne({ conversationId })
                                         .sort({ createdAt: -1 }); // -1 = le plus récent

        return {
            ...friend.toObject(), // On convertit en objet JS modifiable
            // Si un message existe, on prend sa date. Sinon, on met une date très vieille (0)
            lastMessageAt: lastMessage ? lastMessage.createdAt : new Date(0) 
        };
    }));

    // C. On trie le tableau : Du plus récent (b) au plus vieux (a)
    friendsWithDetails.sort((a, b) => {
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    res.json(friendsWithDetails);

  } catch (error) {
    console.error("Erreur getFriends:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 5. Récupérer les demandes d'ami
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const validRequests = user.friendRequests.filter(Boolean);

    const requesters = await User.find({
      '_id': { $in: validRequests }
    }).select('username bio avatar'); // J'ai ajouté avatar et bio pour l'affichage

    res.json(requesters);
  } catch (error) {
    console.error("Erreur demandes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 6. Rechercher des utilisateurs
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    }).select('username bio avatar').limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 7. Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  const { userId, bio, avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { bio, avatar }, 
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Profil mis à jour !", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};