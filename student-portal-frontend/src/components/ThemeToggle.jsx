import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
    </button>
  );
};

export default ThemeToggle;