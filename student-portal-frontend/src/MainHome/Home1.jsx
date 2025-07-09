import React from 'react';
import { FaCloudUploadAlt, FaCode } from 'react-icons/fa';
import './Home1.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="hero-wrapper">
      {/* Left Circle */}
      <div className="icon-circle left">
        <div className="blur-background green"></div>
        <div className="icon-foreground">
          <FaCode className="hero-icon" />
        </div>
      </div>

      {/* Right Circle */}
      <div className="icon-circle right">
        <div className="blur-background purple"></div>
        <div className="icon-foreground">
          <FaCloudUploadAlt className="hero-icon" />
        </div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-heading-gradient">
          Welcome to Your <span className="highlight">Learning Journey</span>
        </h1>
        <p className="description">
          Discover, Learn, and Excel with our comprehensive educational platform
        </p>
        <div className="button-group">
          <button className="btn black">Explore Courses</button>
          <Link to="/course-details">
            <button className="btn outline">Learn More</button>
          </Link>
        </div>
      </div>

      {/* Bottom SVG line */}
      <svg className="background-lines" viewBox="0 10 1340 320" preserveAspectRatio="none">
        <path
          d="M0,160 C360,0 720,320 1080,160 C1260,80 1440,240 1440,240"
          fill="none"
          stroke="#435FBC"
          strokeWidth="3.5"
        />
        <path
          d="M0,180 C360,20 720,340 1080,180 C1260,100 1440,260 1440,260"
          fill="none"
          stroke="#4126B4"
          strokeWidth="2"
        />
      </svg>
        {/* Student Portal Steps Section */}
    <div className="steps-section">
  <h2 className="steps-heading">Start with Your Portal in 3 Steps</h2>
  <div className="steps-container">
    
    {/* Step 1: Create Profile */}
    <div className="step-box">
      <div className="step-circle green">
        <svg width="20" height="20" fill="#000" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
        </svg>
      </div>
      <h3>Create Your Profile</h3>
      <p>Sign up and personalize your dashboard to track progress and access resources.</p>
    </div>

    {/* Step 2: Enroll */}
    <div className="step-box">
      <div className="step-square pink">
        <svg width="20" height="20" fill="#000" viewBox="0 0 24 24">
          <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h10v2H4v-2z"/>
        </svg>
      </div>
      <h3>Enroll in Courses</h3>
      <p>Browse available courses and register based on your interests and goals.</p>
    </div>

    {/* Step 3: Begin Learning */}
    <div className="step-box">
      <div className="step-rectangle blue">
        <svg width="20" height="20" fill="#000" viewBox="0 0 24 24">
          <path d="M12 2L1 9l11 7 9-5.3V17h2V9L12 2z"/>
        </svg>
      </div>
      <h3>Begin Learning</h3>
      <p>Access course materials, join discussions, and track achievements.</p>
    </div>

  </div>
</div>

    </div>
  );
};

export default HeroSection;
