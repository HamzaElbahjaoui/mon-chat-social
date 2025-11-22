const Message = require('../models/Message');

// Astuce : Trie les IDs pour avoir un ID de conversation unique
const getConversationId = (userA, userB) => {
    return [userA, userB].sort().join("_");
};

// 1. Envoyer un message
exports.sendMessage = async (req, res) => {
    // CORRECTION ICI : On utilise 'text' car c'est ce que React envoie
    const { senderId, receiverId, text } = req.body;

    try {
        const conversationId = getConversationId(senderId, receiverId);

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            text: text // On stocke bien la variable 'text'
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur envoi message" });
    }
};

// 2. Récupérer l'historique avec un ami
exports.getMessages = async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const conversationId = getConversationId(userId, friendId);

        const messages = await Message.find({ conversationId })
                                      .populate('sender', 'username bio avatar') // J'ai ajouté 'avatar' au cas où
                                      .sort({ createdAt: 1 }); 

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur récupération historique" });
    }
};