import React, { useEffect, useState } from 'react';
import './Course.css';
import { NavLink } from 'react-router-dom';
import '../Dashboard/StudentNavbar.css';
import { useAuth } from '../context/AuthContext';
import apiService from '../Services/api';

const Course = () => {
  const [videos, setVideos] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await apiService.getUserCourseVideos();
      if (response.success === false) {
        console.error('API error:', response.message);
        setVideos([]);
      } else {
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
              <span>{user?.username || 'Student'}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          </nav>
    
    <div className="course-container">
      
      <h2 className="course-title">Your Course Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available for your enrolled courses.</p>
      ) : (
        <div className="video-grid">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              <iframe
                className="video-iframe"
                src={video.video_url}
                title={video.title}
                allowFullScreen
              ></iframe>
              <div className="video-title">{video.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Course;
