import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import styles from '../styles/Chat.module.css';

const Chat = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Query to get messages ordered by timestamp
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messageData);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (newMessage.trim() === '') return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                sender: currentUser.email,
                timestamp: serverTimestamp(),
            });
            
            setNewMessage('');
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
                            message.sender === currentUser.email ? styles.sent : styles.received
                        }`}
                    >
                        <div className={styles.messageContent}>
                            <p className={styles.messageText}>{message.text}</p>
                            <small className={styles.sender}>
                                {message.sender === currentUser.email ? 'You' : message.sender}
                            </small>
                        </div>
                    </div>
                ))}
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

export default Chat; 