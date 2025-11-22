// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Inscription
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Pseudo déjà pris" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Inscription réussie !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Utilisateur inconnu" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe faux" });

    // On renvoie les infos utiles au Frontend
    res.json({
      message: "Connecté !",
      user: { _id: user._id, username: user.username, friends: user.friends }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};