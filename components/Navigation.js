import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';

const Navigation = () => {
    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <li>
                    <Link to="/" className={styles.navLink}>Home</Link>
                </li>
                <li>
                    <Link to="/community" className={styles.navLink}>Community Center</Link>
                </li>
                {/* ... other navigation links */}
            </ul>
        </nav>
    );
};

export default Navigation; 