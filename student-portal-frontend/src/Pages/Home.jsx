import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Dashboard/StudentNavbar.css';
import './Homemain.css';
import './animate.css';
import './Techno';
import Techno from './Techno';
import Home3 from '../MainHome/Home3';
import Home4 from '../MainHome/Home4';
import Home5 from '../MainHome/Home5';
import Footer from './Footer';



const Home = () => {
  const { user, logout } = useAuth();
  const [animatedIcons, setAnimatedIcons] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const showcaseRef = useRef(null);
  
  useEffect(() => {
    // Start icon animation after a short delay
    const timer = setTimeout(() => {
      setAnimatedIcons(true);
    }, 500);
    
    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      
      if (showcaseRef.current) {
        const yPos = scrollPosition * 0.2;
        showcaseRef.current.style.backgroundPositionY = `${yPos}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
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

      {/* Premium Hero Section */}
      <div className="hero-section-1" ref={showcaseRef}>
        <div className="hero-overlay"></div>
        <div className="hero-content animate__animated animate__fadeIn">
          <h1 className="animate__animated animate__fadeInUp">Welcome to Your Learning Journey</h1>
          <p className="animate__animated animate__fadeInUp animate__delay-1s">
            Discover, Learn, and Excel with our comprehensive educational platform
          </p>
          <div className="hero-buttons">
            <NavLink to="/courses" className="hero-btn primary animate__animated animate__fadeInUp animate__delay-1s">
              Explore Courses
            </NavLink>
            <NavLink to="/about" className="hero-btn secondary animate__animated animate__fadeInUp animate__delay-1s">
              Learn More
            </NavLink>
          </div>
        </div>
      </div>
 
<Techno> </Techno>
<Home3></Home3>
 <Home4></Home4>
<Home5></Home5>
      
 <Footer></Footer>
     
    </div>
  );
};

export default Home;
