import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Pour la navigation
import { userService } from '../services/userService';
import { friendsService } from '../services/chatService';
import { userStorage } from '../services/authService';
import './AddFriend.css';

const AddFriend = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [friendRequestStatus, setFriendRequestStatus] = useState({});
  
  const navigate = useNavigate(); // <-- Hook pour rediriger

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const currentUser = userStorage.getUser();
      const result = await userService.searchUsers(searchTerm);
      
      // Filtrer : On retire l'utilisateur courant de la liste
      const filteredResult = result.filter(u => u._id !== currentUser._id);
      
      setUsers(filteredResult);
      if (filteredResult.length === 0) setError("Aucun utilisateur trouvé.");
      
    } catch (err) {
      setError(err.message || 'Error searching for users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (receiverId) => {
    const sender = userStorage.getUser();
    if (!sender) {
      setError('You must be logged in to add friends.');
      return;
    }

    setFriendRequestStatus({ ...friendRequestStatus, [receiverId]: 'sending' });
    try {
      await friendsService.sendFriendRequest(sender._id, receiverId);
      setFriendRequestStatus({ ...friendRequestStatus, [receiverId]: 'sent' });
    } catch (err) {
      setFriendRequestStatus({ ...friendRequestStatus, [receiverId]: 'error' });
      // On affiche l'erreur spécifique du backend (ex: "Déjà amis")
      alert(err.message || 'Error sending friend request');
    }
  };

  return (
    <div className="add-friend-container">
      <div className="add-friend-card">
        
        {/* Header avec bouton Retour */}
        <div className="header-row">
            <button onClick={() => navigate('/')} className="back-btn">⬅ Retour</button>
            <h2>Ajouter un ami</h2>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Chercher un pseudo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? '...' : '🔍'}
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        <div className="user-list">
          {users.map((user) => (
            <div key={user._id} className="user-item">
              <div className="user-info">
                 <div className="avatar-small">{user.username[0].toUpperCase()}</div>
                 <span>{user.username}</span>
              </div>
              
              <button
                className={`action-btn ${friendRequestStatus[user._id] === 'sent' ? 'sent' : ''}`}
                onClick={() => handleAddFriend(user._id)}
                disabled={friendRequestStatus[user._id] === 'sending' || friendRequestStatus[user._id] === 'sent'}
              >
                {friendRequestStatus[user._id] === 'sending' ? 'Envoi...' 
                 : friendRequestStatus[user._id] === 'sent' ? 'Envoyé ✔' 
                 : 'Ajouter'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;