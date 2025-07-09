// src/Dashboard/StudentDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, Routes, Route } from 'react-router-dom';
import './StudentNavbar.css';
import ThemeToggle from '../components/ThemeToggle';
import Home from '../Pages/Home';
import About from '../Pages/About';
import Contact from '../Cont/Contact';
import Courses from '../Pages/Course';


function StudentDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <>
      <div className="dashboard-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Student Portal</h2>
          </div>
          <div className="navbar-links">
            <NavLink to="/student/dashboard" end className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              Home
            </NavLink>
            <NavLink to="/student/dashboard/courses" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              Courses
            </NavLink>
            <NavLink to="/student/dashboard/about" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              About
            </NavLink>
            <NavLink to="/student/dashboard/contact" className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }>
              Contact
            </NavLink>
          </div>
          <div className="navbar-user">
            <ThemeToggle />
            <span>{user?.name || 'Student'}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </nav>

        {/* Main Content - Nested Routes */}
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
