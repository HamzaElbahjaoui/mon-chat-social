import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { userStorage } from './services/authService';

// IMPORTS DES COMPOSANTS
import AuthContainer from './components/AuthContainer';
import MainPage from './components/MainPage';
import AddFriend from './components/AddFriend';
import FriendRequests from './components/FriendRequests';
import EditProfile from './components/EditProfile'; // <--- 1. NOUVEL IMPORT
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = userStorage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    userStorage.saveUser(userData); 
    setUser(userData);
  };

  const handleLogout = () => {
    userStorage.removeUser();
    setUser(null);
  };

  // <--- 2. FONCTION POUR METTRE À JOUR LE PROFIL EN TEMPS RÉEL
  const handleUpdateUser = (updatedData) => {
    // On fusionne les anciennes infos avec les nouvelles (ex: nouvelle bio)
    const newUserState = { ...user, ...updatedData };
    setUser(newUserState);
    // On met à jour le stockage local pour que ça reste au refresh
    userStorage.saveUser(newUserState);
  };

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Si pas connecté -> Login */}
          <Route 
            path="/login" 
            element={!user ? <AuthContainer onLogin={handleLogin} /> : <Navigate to="/" />} 
          />

          {/* Si connecté -> Routes protégées */}
          <Route 
            path="/" 
            element={user ? <MainPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/add-friend" 
            element={user ? <AddFriend user={user} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/friend-requests" 
            element={user ? <FriendRequests user={user} /> : <Navigate to="/login" />} 
          />

          {/* <--- 3. NOUVELLE ROUTE POUR LE PROFIL */}
          <Route 
            path="/profile" 
            element={
              user ? (
                <EditProfile user={user} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;