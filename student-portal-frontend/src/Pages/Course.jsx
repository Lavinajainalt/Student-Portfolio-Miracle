import React, { useEffect, useState } from 'react';
import './Course.css';
import { NavLink } from 'react-router-dom';
import '../Dashboard/StudentNavbar.css';
import { useAuth } from '../context/AuthContext';
import apiService from '../Services/api';
import ThemeToggle from '../components/ThemeToggle';

const Course = () => {
  const [videos, setVideos] = useState([]);
  const { user, logout } = useAuth();
  const [clickedLinks, setClickedLinks] = useState({});
  const [selectedArea, setSelectedArea] = useState('Frontend');
  const interviewQuestions = {
    Frontend: [
      {
        q: 'How to introduce yourself in a frontend interview?',
        a: 'Start with your name and background, mention your experience with frontend technologies (like React, HTML, CSS, JavaScript), highlight key projects, and express your passion for UI/UX and web development.'
      },
      {
        q: 'What is React and how does it work?',
        a: 'React is a JavaScript library for building user interfaces. It works by creating a virtual DOM and efficiently updating the real DOM when state changes.'
      },
      {
        q: 'Explain the virtual DOM.',
        a: 'The virtual DOM is a lightweight copy of the real DOM. React uses it to optimize updates by only changing parts of the DOM that have actually changed.'
      }
      // ... (other frontend questions)
    ],
    Backend: [
      {
        q: 'How to introduce yourself in a backend interview?',
        a: 'Begin with your name and background, mention your experience with backend technologies (like Node.js, Python, databases), highlight backend projects, and emphasize your problem-solving and system design skills.'
      },
      {
        q: 'What is REST API?',
        a: 'A REST API is an application programming interface that follows REST principles, using HTTP methods to access and manipulate resources.'
      },
      {
        q: 'Explain the MVC architecture.',
        a: 'MVC stands for Model-View-Controller. It separates application logic into three interconnected components for better organization.'
      }
      // ... (other backend questions)
    ],
    'Full Stack': [
      {
        q: 'How to introduce yourself in a full stack interview?',
        a: 'Introduce yourself, mention your experience with both frontend and backend technologies, highlight full stack projects, and show your ability to work across the stack and collaborate with teams.'
      },
      {
        q: 'What is the difference between frontend and backend?',
        a: 'Frontend is the user interface and experience, while backend is the server-side logic and database management.'
      },
      {
        q: 'How do you manage state across client and server?',
        a: 'Use APIs to sync state, local storage or cookies for persistence, and state management libraries.'
      }
      // ... (other full stack questions)
    ]
  };

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
              <ThemeToggle />
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

    {/* Interview Questions Section */}
    <div className="interview-section">
      <h2>Interview Questions (Q&A Format)</h2>
      <div className="interview-area-btns">
        {['Frontend', 'Backend', 'Full Stack'].map(area => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={selectedArea === area ? 'selected' : ''}
          >
            {area}
          </button>
        ))}
      </div>
      {selectedArea && (
        <ul>
          {(interviewQuestions[selectedArea] || []).map((qa, idx) => (
            <li key={idx} style={{ marginBottom: '1.2rem' }}>
              <strong>Q{idx + 1}:</strong> {qa.q}
              <br />
              <span style={{ color: '#2563eb', fontWeight: 500 }}><strong>A:</strong> {qa.a}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
};

export default Course;
