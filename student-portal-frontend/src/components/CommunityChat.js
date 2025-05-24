import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CommunityChat.css';

const CommunityChat = () => {
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

    if (!currentUser || !token) {
        return <div className="loading">Please log in to chat</div>;
    }

    if (loading && messages.length === 0) {
        return <div className="loading">Loading messages...</div>;
    }

    return (
        <div className="chat-container">
            {error && <div className="error-message">{error}</div>}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((message) => {
                        // Log each message for debugging
                        console.log('Processing message:', {
                            messageId: message.id,
                            sender: message.sender,
                            currentUser: currentUser.email,
                            content: message.content
                        });
                        
                        const isSentByMe = message.sender === currentUser.email;
                        
                        return (
                            <div 
                                key={message.id} 
                                className={`message ${isSentByMe ? 'sent' : 'received'}`}
                            >
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="sender-name">
                                            {isSentByMe ? 'You' : message.sender}
                                        </span>
                                        <span className="message-time">
                                            {new Date(message.timestamp).toLocaleTimeString()}
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
                    Send
                </button>
            </form>
            <div className="debug-info">
                <small>Logged in as: {currentUser.email}</small>
            </div>
        </div>
    );
};

export default CommunityChat; 