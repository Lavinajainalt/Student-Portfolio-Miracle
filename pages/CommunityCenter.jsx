import React from 'react';
import CommunityChat from '../components/CommunityChat';
import styles from '../styles/CommunityCenter.module.css';

const CommunityCenter = ({ currentUser }) => {
    return (
        <div className={styles.communityContainer}>
            <div className={styles.header}>
                <h1>Community Center</h1>
                <p>Connect with your fellow students in real-time</p>
            </div>
            
            <div className={styles.mainContent}>
                <div className={styles.chatSection}>
                    <div className={styles.chatHeader}>
                        <h2>Community Chat</h2>
                        <span className={styles.onlineIndicator}>Live Chat</span>
                    </div>
                    <CommunityChat currentUser={currentUser} />
                </div>
                
                <div className={styles.sidebar}>
                    <div className={styles.infoCard}>
                        <h3>Welcome to Community Center</h3>
                        <p>This is a space where you can:</p>
                        <ul>
                            <li>Chat with other students</li>
                            <li>Share knowledge and experiences</li>
                            <li>Ask questions</li>
                            <li>Build connections</li>
                        </ul>
                    </div>
                    
                    <div className={styles.guidelines}>
                        <h3>Chat Guidelines</h3>
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
    );
};

export default CommunityCenter; 