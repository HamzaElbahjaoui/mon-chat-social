import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import './Conversation.css';

const Conversation = ({ user, friend, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Charger l'historique des messages
  useEffect(() => {
    loadMessages();
  }, [user._id, friend._id]);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messageHistory = await chatService.getMessages(user._id, friend._id);
      setMessages(messageHistory || []);
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // CORRECTION 1 : On utilise les noms que le Backend attend
      const messageData = {
        senderId: user._id,
        receiverId: friend._id,
        text: messageText // <--- IMPORTANT : 'text', pas 'content'
      };

      // CORRECTION 2 : On attend la réponse du serveur avant d'ajouter le message
      // Cela garantit qu'on a le bon _id et la bonne date (createdAt)
      const savedMsg = await chatService.sendMessage(messageData);
      
      setMessages(prev => [...prev, savedMsg]);

    } catch (error) {
      setError(error.message || 'Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    // CORRECTION 3 : Gestion robuste de la date (MongoDB envoie une string ISO)
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="conversation-container">
      {/* Header de la conversation */}
      <div className="conversation-header">
        <button onClick={onBack} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="currentColor"/>
          </svg>
        </button>
        <div className="friend-info">
          <div className="friend-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#667eea"/>
            </svg>
          </div>
          <div className="friend-details">
            <h3>{friend.username}</h3>
            <p>En ligne</p>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">
            <div className="spinner-large"></div>
            <p>Chargement des messages...</p>
          </div>
        ) : error ? (
          <div className="error-messages">
            <p>{error}</p>
            <button onClick={loadMessages} className="retry-btn">Réessayer</button>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="#a0aec0"/>
              </svg>
            </div>
            <h4>Aucun message</h4>
            <p>Commencez une conversation avec {friend.username} !</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
                // Gestion robuste de l'ID expéditeur (parfois peuplé, parfois ID string)
                const senderId = message.sender._id || message.sender;
                const isMe = senderId === user._id;

                return (
                  <div 
                    key={message._id || index} 
                    className={`message ${isMe ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {/* CORRECTION 4 : Affichage de 'text' */}
                      <p>{message.text}</p>
                      <span className="message-time">
                        {/* CORRECTION 5 : Utilisation de 'createdAt' */}
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Écrivez à ${friend.username}...`}
            className="message-input"
            disabled={sending}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <div className="spinner-small"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;