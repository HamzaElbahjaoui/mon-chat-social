const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // L'ID unique de la conversation (ex: "ID_de_Hamza_ID_de_Amine")
  conversationId: { 
    type: String, 
    required: true 
  },
  
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Qui a envoyé ?
    required: true 
  },
  
  text: { 
    type: String, 
    required: true 
  },
  
  // Pour savoir si le message a été lu (comme les coches bleues WhatsApp)
  isRead: {
      type: Boolean,
      default: false
  }
}, { timestamps: true }); // Important : stocke l'heure exacte de chaque message

module.exports = mongoose.model('Message', messageSchema);