import './FriendsList.css';

const FriendsList = ({ friends, loading, error, onFriendSelect, onRefresh }) => {
  if (loading) {
    return (
      <div className="friends-container">
        <div className="friends-header">
          <h3>Mes Amis</h3>
        </div>
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Chargement de vos amis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-container">
        <div className="friends-header">
          <h3>Mes Amis</h3>
          <button onClick={onRefresh} className="refresh-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={onRefresh} className="retry-btn">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-container">
      <div className="friends-header">
        <h3>Mes Amis ({friends.length})</h3>
        <button onClick={onRefresh} className="refresh-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {friends.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C18.21 4 20 5.79 20 8C20 10.21 18.21 12 16 12C13.79 12 12 10.21 12 8C12 5.79 13.79 4 16 4ZM16 14C18.67 14 24 15.34 24 18V20H8V18C8 15.34 13.33 14 16 14ZM8.5 6C10.21 6 11.5 7.29 11.5 9C11.5 10.71 10.21 12 8.5 12C6.79 12 5.5 10.71 5.5 9C5.5 7.29 6.79 6 8.5 6ZM8.5 13.5C10.83 13.5 15.5 14.66 15.5 17V18.5H1.5V17C1.5 14.66 6.17 13.5 8.5 13.5Z" fill="#a0aec0"/>
            </svg>
          </div>
          <h4>Aucun ami pour le moment</h4>
          <p>Commencez à ajouter des amis pour démarrer des conversations !</p>
        </div>
      ) : (
        <div className="friends-list">
          {friends.map((friend) => (
            <div 
              key={friend._id} 
              className="friend-item"
              onClick={() => onFriendSelect(friend)}
            >
              <div className="friend-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#667eea"/>
                </svg>
              </div>
              <div className="friend-info">
                <h4>{friend.username}</h4>
                <p>{friend.bio || 'Aucune bio'}</p>
              </div>
              <div className="friend-status">
                <div className="status-dot online"></div>
              </div>
              <div className="chat-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#a0aec0"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
