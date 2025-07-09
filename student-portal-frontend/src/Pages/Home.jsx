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
import Home1 from '../MainHome/Home1';
import Game from '../MainHome/Game';
import Community from '../Pages/Community';
import logoimage from '../Images/logo.png';
import ThemeToggle from '../components/ThemeToggle';

const Home = () => {
  const { user, logout } = useAuth();
  const [animatedIcons, setAnimatedIcons] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickedLinks, setClickedLinks] = useState({});
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

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <div className="dashboard-container">
      {/* Enhanced Navbar with scroll effect */}
      <nav className={`navbar animate__animated animate__fadeInDown ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <img src={logoimage} alt="Logo" className="navbar-logo" />
          <h2 className="animate__animated animate__pulse animate__infinite animate__slower">Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink 
            to="/home" 
            end 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/home'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/home')}
          >
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/dashboard'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/courses" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/courses'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/courses')}
          >
            <i className="fas fa-book"></i> <span>Courses</span>
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/about'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/about')}
          >
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink 
            to="/maincontact" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/maincontact'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/maincontact')}
          >
            <i className="fas fa-envelope"></i> <span>Contact</span>
          </NavLink>
          <NavLink 
            to="/communitycenter" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/communitycenter'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/communitycenter')}
          >
            <i className="fas fa-users"></i> <span>Community</span>
          </NavLink>
        </div>
        
        <div className="navbar-user">
          <ThemeToggle />
          <span className="animate__animated animate__fadeIn">{user?.username || 'Student'}</span>
          <button className="logout-btn animate__animated animate__fadeIn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <Home1></Home1>
      <Techno> </Techno>
      <Home3></Home3>
      <Home4></Home4>
      <Home5></Home5>
      <Community></Community>
      <Game></Game>    
      <Footer></Footer>
    </div>
  );
};

export default Home;
