const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ 
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"] 
}));
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.json({ message: 'Serveur de test fonctionne !' });
});

// Route de test pour les amis
app.get('/api/users/friends/:userId', (req, res) => {
  const testFriends = [
    {
      _id: '69204f2fb40f22fc02d19e2c',
      username: 'alice_martin',
      bio: 'Développeuse passionnée de React et Node.js'
    },
    {
      _id: '69204f2fb40f22fc02d19e2f',
      username: 'bob_dupont',
      bio: 'Amateur de technologie et de jeux vidéo'
    },
    {
      _id: '69204f2fb40f22fc02d19e32',
      username: 'claire_bernard',
      bio: 'Designer UI/UX créative'
    },
    {
      _id: '69204f30b40f22fc02d19e35',
      username: 'david_moreau',
      bio: 'Étudiant en informatique'
    }
  ];
  
  console.log(`📡 Requête reçue pour userId: ${req.params.userId}`);
  res.json(testFriends);
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur de test prêt sur http://localhost:${PORT}`);
});
