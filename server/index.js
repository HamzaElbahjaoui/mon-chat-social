const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();

// 1. IMPORT DES NOUVELLES ROUTES
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');


const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ 
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"] 
}));
app.use(express.json());

const server = http.createServer(app);

// 2. CONNEXION DATABASE (Ton lien est ici)
const mongoURI = 'mongodb+srv://hamzabahjaoui29_db_user:vr4ZAMJhHIVwwVW9@cluster0.on3qvtz.mongodb.net/mon-chat-social?appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log('🟢 Connecté à MongoDB Atlas avec succès !'))
    .catch(err => console.error('🔴 Erreur MongoDB:', err));

// ==========================================
// 3. UTILISATION DES ROUTES (Le changement important)
// ==========================================
// Toutes les requêtes qui commencent par /api/auth iront dans authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);


// 4. Configuration Socket.io (Chat)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`⚡ Utilisateur connecté : ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('Utilisateur parti');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});