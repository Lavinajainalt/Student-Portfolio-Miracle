import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUsers, FaComments, FaInfoCircle, FaClipboardList, FaUserFriends, FaPaperPlane } from 'react-icons/fa';
import './CommunityCenter.css';

export default function CommunityCenter() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Get user and token from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = currentUser?.token;

  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    } else {
      setError('No authentication token found. Please log in.');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setError('');
      const response = await api.get('/api/community/messages/');
      console.log('Received messages:', response.data);
      
      if (response.data) {
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error loading messages. Please try again.');
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to send messages');
      return;
    }
    if (newMessage.trim() === '') return;

    try {
      const response = await api.post('/api/community/messages/', {
        content: newMessage
      });
      
      if (response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message. Please try again.');
    }
  };

  return (
    <div className="community-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="header-content">
            <FaUsers className="text-4xl" />
            <h1 className="header-title">Community Center</h1>
          </div>
          <p className="header-subtitle">
            Connect with students and faculty through real-time chat
          </p>
        </div>

        <div className="main-content">
          <div className="chat-section">
            <div className="chat-header">
              <h2>
                <FaComments />
                Community Chat
              </h2>
              <span className="online-indicator">Live Chat</span>
            </div>
            
            <div className="chat-container">
              {error && <div className="error-message">{error}</div>}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((message) => {
                    const isSentByMe = message.sender === currentUser?.email;
                    return (
                      <div 
                        key={message.id} 
                        className={`message ${isSentByMe ? 'sent' : 'received'}`}
                      >
                        <div className="message-content">
                          <div className="message-header">
                            <span className="sender-name">
                              {isSentByMe ? 'You' : message.sender.split('@')[0]}
                            </span>
                            <span className="message-time">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="message-text">{message.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="message-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  <FaPaperPlane /> Send
                </button>
              </form>
            </div>
          </div>
          
          <div className="sidebar">
            <div className="info-card">
              <h3>
                <FaInfoCircle />
                Welcome to Community Center
              </h3>
              <p>This is a space where you can:</p>
              <ul>
                <li>
                  <FaComments />
                  Chat with other students
                </li>
                <li>
                  <FaUserFriends />
                  Share knowledge and experiences
                </li>
                <li>
                  <FaInfoCircle />
                  Ask questions
                </li>
                <li>
                  <FaUsers />
                  Build connections
                </li>
              </ul>
            </div>
            
            <div className="guidelines">
              <h3>
                <FaClipboardList />
                Chat Guidelines
              </h3>
              <ul>
                <li>Be respectful to others</li>
                <li>Keep discussions academic</li>
                <li>No spam or inappropriate content</li>
                <li>Help maintain a positive environment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
