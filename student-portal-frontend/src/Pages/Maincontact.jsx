import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Dashboard/StudentNavbar.css';
import Contact from '../Cont/Contact';
import Contact1 from '../Cont/Contact1';
import Contact2 from '../Cont/Contact2';


export default function Maincontact() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Enhanced Navbar with scroll effect */}
      <nav className={`navbar animate__animated animate__fadeInDown ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <h2 className="animate__animated animate__pulse animate__infinite animate__slower">Student Portal</h2>
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
          <NavLink to="/maincontact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-envelope"></i> Contact
          </NavLink>
        </div>
        
        <div className="navbar-user">
          <span className="animate__animated animate__fadeIn">{user?.username || 'Student'}</span>
          <button className="logout-btn animate__animated animate__fadeIn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <Contact1 />
      <Contact />
      <Contact2/>
    </div>
  );
}