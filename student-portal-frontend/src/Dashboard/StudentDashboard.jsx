// src/Dashboard/StudentDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './StudentNavbar.css';

function StudentDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/home" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-home"></i> Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-book"></i> Courses
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-info-circle"></i> About
          </NavLink>
          <NavLink to="contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-envelope"></i> Contact
          </NavLink>
        </div>
        
        <div className="navbar-user">
          <span>{user?.name || 'Student'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="dashboard-content">
        {/* Content will be rendered by parent component using Outlet */}
      </div>
    </div>
  );
}

export default StudentDashboard;
