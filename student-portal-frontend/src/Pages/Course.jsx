import React, { useEffect, useState } from 'react';
import './Course.css';
import { NavLink } from 'react-router-dom';
import '../Dashboard/StudentNavbar.css';
import { useAuth } from '../context/AuthContext';
import apiService from '../Services/api';

const Course = () => {
  const [videos, setVideos] = useState([]);
  const { user, logout } = useAuth();
  const [clickedLinks, setClickedLinks] = useState({});

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await apiService.getUserCourseVideos();
      if (response.success === false) {
        console.error('API error:', response.message);
        setVideos([]);
      } else {
        console.log('Received videos:', response);
        setVideos(response);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
     {/* Navbar */}
          <nav className="navbar">
            <div className="navbar-brand">
              <h2>Student Portal</h2>
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
              <span>{user?.username || 'Student'}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          </nav>
    
    <div className="course-container">
      
      <div className="course-header">
        <h2 className="course-title">Your Course Videos</h2>
        <NavLink to="/test" className="test-button-course">
          Take Test
        </NavLink>
      </div>
      {videos.length === 0 ? (
        <p>No videos available for your enrolled courses.</p>
      ) : (
        <div className="video-grid">
          {videos.map(video => {
            console.log('Rendering video:', video);
            return (
              <div key={video.id} className="video-card">
                {video.heading && <div className="video-heading">{video.heading}</div>}
                <iframe
                  className="video-iframe"
                  src={video.video_url}
                  title={video.title}
                  allowFullScreen
                ></iframe>
                <div className="video-title">{video.title}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
};

export default Course;
