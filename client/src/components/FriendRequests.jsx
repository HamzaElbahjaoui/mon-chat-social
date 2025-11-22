import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Pour le bouton retour
import { friendsService } from '../services/chatService';
import { userStorage } from '../services/authService';
import './FriendRequests.css';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // <-- Hook de navigation

  useEffect(() => {
    const fetchRequests = async () => {
      const user = userStorage.getUser();
      if (!user) {
        setError('Vous devez être connecté.');
        setLoading(false);
        return;
      }

      try {
        const friendRequests = await friendsService.getFriendRequests(user._id);
        setRequests(friendRequests);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requesterId) => {
    const user = userStorage.getUser();
    try {
      await friendsService.acceptFriendRequest(user._id, requesterId);
      // Mise à jour optimiste de l'interface
      setRequests(requests.filter((req) => req._id !== requesterId));
    } catch (err) {
      alert(err.message || 'Erreur lors de l\'acceptation.');
    }
  };

  const handleRefuse = async (requesterId) => {
    const user = userStorage.getUser();
    try {
      await friendsService.refuseFriendRequest(user._id, requesterId);
      setRequests(requests.filter((req) => req._id !== requesterId));
    } catch (err) {
      alert(err.message || 'Erreur lors du refus.');
    }
  };

  return (
    <div className="requests-container">
      <div className="requests-card">
        {/* En-tête avec bouton retour */}
        <div className="header-row">
            <button onClick={() => navigate('/')} className="back-btn">⬅ Retour</button>
            <h2>Demandes d'amis ({requests.length})</h2>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
             <p>Aucune demande en attente.</p>
          </div>
        ) : (
          <div className="request-list">
            {requests.map((request) => (
              <div key={request._id} className="request-item">
                <div className="user-info">
                    <div className="avatar-small">
                        {request.username[0].toUpperCase()}
                    </div>
                    <span className="username">{request.username}</span>
                </div>
                
                <div className="request-actions">
                  <button onClick={() => handleAccept(request._id)} className="accept-btn">
                    ✔ Accepter
                  </button>
                  <button onClick={() => handleRefuse(request._id)} className="refuse-btn">
                    ✖ Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;