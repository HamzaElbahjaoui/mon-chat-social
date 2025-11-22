import { api } from './api';

// Service pour les amis
export const friendsService = {
  // Récupérer la liste des amis
  getFriends: async (userId) => {
    try {
      const response = await api.get(`/users/friends/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Envoyer une demande d'ami
  sendFriendRequest: async (senderId, receiverId) => {
    try {
      const response = await api.post('/users/add-friend', {
        senderId,
        receiverId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Accepter une demande d'ami
  acceptFriendRequest: async (userId, requesterId) => {
    try {
      const response = await api.post('/users/accept-friend', {
        userId,
        requesterId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Refuser une demande d'ami
  refuseFriendRequest: async (userId, requesterId) => {
    try {
      const response = await api.post('/users/refuse-friend', {
        userId,
        requesterId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer les demandes d'ami
  getFriendRequests: async (userId) => {
    try {
      const response = await api.get(`/users/friend-requests/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },
};

// Service pour les conversations
export const chatService = {
  // Récupérer l'historique des messages
  getMessages: async (userId, friendId) => {
    try {
      const response = await api.get(`/chat/${userId}/${friendId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },

  // Envoyer un message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/chat', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion au serveur' };
    }
  },
};
