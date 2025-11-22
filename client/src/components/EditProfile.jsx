import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { userStorage } from '../services/authService';
import { IoArrowBack, IoSaveOutline } from 'react-icons/io5'; // Icônes
import './EditProfile.css'; // On va créer le CSS juste après

const EditProfile = ({ user, onUpdateUser }) => {
  const [bio, setBio] = useState(user.bio || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Appel au backend
      const response = await userService.updateProfile(user._id, { bio });
      
      // 1. Mettre à jour le stockage local (pour que le changement persiste au refresh)
      const updatedUser = { ...user, bio: response.user.bio };
      userStorage.saveUser(updatedUser);
      
      // 2. Mettre à jour l'état global dans App.jsx
      onUpdateUser(updatedUser);

      setMessage("Profil mis à jour avec succès ! ✅");
      setTimeout(() => navigate('/'), 1500); // Retour accueil après 1.5s
    } catch (err) {
      setMessage("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-card">
        
        <div className="header-row">
            <button onClick={() => navigate('/')} className="back-btn">
                <IoArrowBack size={24} /> Retour
            </button>
            <h2>Mon Profil</h2>
        </div>

        <div className="profile-preview">
            <div className="avatar-large">{user.username[0].toUpperCase()}</div>
            <h3>{user.username}</h3>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
            <label>Bio / Statut :</label>
            <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Parlez de vous..."
                rows="3"
            />

            {message && <p className={`msg ${message.includes('Erreur') ? 'error' : 'success'}`}>{message}</p>}

            <button type="submit" disabled={loading} className="save-btn">
                {loading ? 'Enregistrement...' : <><IoSaveOutline size={20}/> Enregistrer</>}
            </button>
        </form>

      </div>
    </div>
  );
};

export default EditProfile;