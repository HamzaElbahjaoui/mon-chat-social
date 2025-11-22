const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Configuration MongoDB (utilisez la même que dans votre index.js)
const mongoURI = 'mongodb+srv://hamzabahjaoui29_db_user:vr4ZAMJhHIVwwVW9@cluster0.on3qvtz.mongodb.net/mon-chat-social?appName=Cluster0';

async function createTestData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(mongoURI);
    console.log('🟢 Connecté à MongoDB');

    // Créer des utilisateurs de test
    const testUsers = [
      {
        username: 'alice_martin',
        password: 'password123',
        bio: 'Développeuse passionnée de React et Node.js'
      },
      {
        username: 'bob_dupont',
        password: 'password123',
        bio: 'Amateur de technologie et de jeux vidéo'
      },
      {
        username: 'claire_bernard',
        password: 'password123',
        bio: 'Designer UI/UX créative'
      },
      {
        username: 'david_moreau',
        password: 'password123',
        bio: 'Étudiant en informatique'
      }
    ];

    console.log('📝 Création des utilisateurs de test...');

    const createdUsers = [];
    
    for (const userData of testUsers) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username: userData.username });
      
      if (!existingUser) {
        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Créer l'utilisateur
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          bio: userData.bio
        });
        
        const savedUser = await newUser.save();
        createdUsers.push(savedUser);
        console.log(`✅ Utilisateur créé: ${userData.username}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`ℹ️  Utilisateur existe déjà: ${userData.username}`);
      }
    }

    // Récupérer votre utilisateur principal
    const mainUser = await User.findOne({ username: 'hamza_aax' });
    if (!mainUser) {
      console.log('❌ Utilisateur hamza_aax non trouvé');
      return;
    }

    console.log('🤝 Ajout des relations d\'amitié...');

    // Ajouter tous les utilisateurs de test comme amis de hamza_aax
    for (const testUser of createdUsers) {
      // Vérifier si ils ne sont pas déjà amis
      if (!mainUser.friends.includes(testUser._id)) {
        mainUser.friends.push(testUser._id);
        testUser.friends.push(mainUser._id);
        await testUser.save();
        console.log(`✅ ${testUser.username} ajouté comme ami`);
      } else {
        console.log(`ℹ️  ${testUser.username} est déjà ami`);
      }
    }

    // Sauvegarder les modifications de l'utilisateur principal
    await mainUser.save();

    console.log('🎉 Données de test créées avec succès !');
    console.log(`👥 ${mainUser.username} a maintenant ${mainUser.friends.length} amis`);

    // Afficher la liste des amis
    const populatedUser = await User.findById(mainUser._id).populate('friends', 'username bio');
    console.log('📋 Liste des amis:');
    populatedUser.friends.forEach(friend => {
      console.log(`  - ${friend.username}: ${friend.bio}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
createTestData();
