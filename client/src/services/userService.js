import { api } from './api';

export const userService = {
  // 1. Rechercher des utilisateurs (Tu l'avais déjà)
  searchUsers: async (query) => {
    try {
      const response = await api.get(`/users/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la recherche' };
    }
  },

  // 2. Mettre à jour le profil (C'EST CE QUI MANQUAIT !)
  updateProfile: async (userId, userData) => {
    try {
      // On envoie l'ID + les nouvelles données (bio, etc.)
      const response = await api.put('/users/update', { userId, ...userData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur mise à jour profil' };
    }
  }
};