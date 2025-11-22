const mongoose = require('mongoose');
const User = require('../models/User');

// Configuration MongoDB
const mongoURI = 'mongodb+srv://hamzabahjaoui29_db_user:vr4ZAMJhHIVwwVW9@cluster0.on3qvtz.mongodb.net/mon-chat-social?appName=Cluster0';

async function getUserId() {
  try {
    await mongoose.connect(mongoURI);
    console.log('🟢 Connecté à MongoDB');

    // Trouver l'utilisateur hamza_aax
    const user = await User.findOne({ username: 'hamza_aax' }).populate('friends', 'username bio');
    
    if (user) {
      console.log('👤 Utilisateur trouvé:');
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Nombre d'amis: ${user.friends.length}`);
      
      if (user.friends.length > 0) {
        console.log('👥 Amis:');
        user.friends.forEach(friend => {
          console.log(`   - ${friend.username} (${friend._id})`);
        });
      }
    } else {
      console.log('❌ Utilisateur hamza_aax non trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

getUserId();
