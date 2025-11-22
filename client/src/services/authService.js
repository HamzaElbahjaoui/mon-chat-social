import { api } from './api';

// Service d'authentification
export const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Connexion
  login: async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data) {
        userStorage.saveUser(response.data);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },
};

// Gestion du stockage local pour l'utilisateur connecté
export const userStorage = {
  // Sauvegarder l'utilisateur connecté
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Récupérer l'utilisateur connecté
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Supprimer l'utilisateur (déconnexion)
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },
};
