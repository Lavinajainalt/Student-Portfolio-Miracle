import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Dashboard/StudentNavbar.css';
import Contact from '../Cont/Contact';
import Contact1 from '../Cont/Contact1';
import Contact2 from '../Cont/Contact2';
import ThemeToggle from '../components/ThemeToggle';

export default function ContactFaculty() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [clickedLinks, setClickedLinks] = useState({});
  
  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

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
          <NavLink 
            to="/homefaculty" 
            end 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/homefaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/homefaculty')}
          >
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/feedback" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/feedback'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/feedback')}
          >
            <i className="fas fa-comment"></i> <span>Feedback</span>
          </NavLink>
          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/report'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/report')}
          >
            <i className="fas fa-file-alt"></i> <span>Report</span>
          </NavLink>
          <NavLink 
            to="/aboutfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/aboutfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/aboutfaculty')}
          >
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink 
            to="/contactfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/contactfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/contactfaculty')}
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
          <span className="animate__animated animate__fadeIn">{user?.username || 'Faculty'}</span>
          <button className="logout-btn animate__animated animate__fadeIn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <Contact1 />
      <Contact />
      <Contact2/>
    </div>
  );
}