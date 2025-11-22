import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import des icônes modernes
import { IoPersonAddOutline, IoNotificationsOutline, IoLogOutOutline } from 'react-icons/io5';

import { userStorage } from '../services/authService';
import { friendsService } from '../services/chatService';
import FriendsList from './FriendsList';
import Conversation from './Conversation';
import './MainPage.css';

const MainPage = ({ user, onLogout }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Charger la liste des amis au montage
  useEffect(() => {
    loadFriends();
  }, [user._id]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      
      try {
        // Le backend renvoie maintenant la liste triée par dernier message
        const friendsList = await friendsService.getFriends(user._id);
        setFriends(friendsList);
      } catch (apiError) {
        console.warn('⚠️ API non disponible, liste vide');
        setFriends([]);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userStorage.removeUser();
    onLogout();
    navigate('/login');
  };

  return (
    <div className="main-page-container">
      
      {/* --- COLONNE DE GAUCHE (Liste des amis) --- */}
      <div className="left-panel">
        
        {/* Header Utilisateur */}
        <div className="left-header">
          
          {/* --- MISE A JOUR : Lien vers le profil --- */}
          <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="user-profile" title="Modifier mon profil">
               <div className="avatar-circle">
                  {user.username[0].toUpperCase()}
               </div>
               <div className="user-text">
                  <h3>{user.username}</h3>
                  <span className="status-dot" style={{ fontSize: '11px', color: 'gray' }}>
                    {/* Affiche la bio tronquée ou "En ligne" */}
                    {user.bio ? (user.bio.length > 20 ? user.bio.substring(0, 20) + '...' : user.bio) : "En ligne"}
                  </span>
               </div>
            </div>
          </Link>

          <div className="header-actions">
             {/* Bouton Ajouter un ami */}
             <Link to="/add-friend" title="Ajouter un ami" className="icon-btn">
                <IoPersonAddOutline size={24} />
             </Link>
             
             {/* Bouton Demandes d'amis */}
             <Link to="/friend-requests" title="Demandes reçues" className="icon-btn">
                <IoNotificationsOutline size={24} />
             </Link>

             {/* Bouton Déconnexion */}
             <button onClick={handleLogout} title="Déconnexion" className="icon-btn logout">
                <IoLogOutOutline size={24} />
             </button>
          </div>
        </div>

        {/* Liste des amis */}
        <div className="friends-scroll-area">
          <FriendsList 
            friends={friends}
            loading={loading}
            error={error}
            onFriendSelect={(friend) => setSelectedFriend(friend)}
            onRefresh={loadFriends}
            selectedFriendId={selectedFriend?._id}
          />
        </div>
      </div>

      {/* --- COLONNE DE DROITE (Conversation) --- */}
      <div className="right-panel">
        {selectedFriend ? (
          <Conversation 
            user={user}
            friend={selectedFriend} 
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👋</div>
            <h2>Bienvenue, {user.username} !</h2>
            <p>Sélectionne une conversation à gauche pour commencer à discuter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default MainPage;