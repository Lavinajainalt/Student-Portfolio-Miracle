import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../styles/Chat.module.css';

const CommunityChat = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('/api/community/messages/');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (newMessage.trim() === '') return;

        try {
            await axios.post('/api/community/messages/', {
                content: newMessage
            });
            
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`${styles.message} ${
                            message.sender.id === currentUser.id ? styles.sent : styles.received
                        }`}
                    >
                        <div className={styles.messageContent}>
                            <p className={styles.messageText}>{message.content}</p>
                            <small className={styles.sender}>
                                {message.sender.id === currentUser.id ? 'You' : message.sender.username}
                            </small>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className={styles.messageForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.messageInput}
                />
                <button type="submit" className={styles.sendButton}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default CommunityChat; 