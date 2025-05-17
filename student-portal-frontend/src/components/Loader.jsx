import React from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-container">
      <div className="background-pattern"></div>
      
      {/* Binary code decorations */}
      <div className="binary-code binary-top-left">
        01001101 01001001 01010100<br />
        10101010 11001100 10101010<br />
        01010101 00110011 01010101
      </div>
      <div className="binary-code binary-top-right">
        01000011 01000001 01010010<br />
        10101010 11001100 10101010<br />
        01010101 00110011 01010101
      </div>
      <div className="binary-code binary-bottom-left">
        01000101 01000101 01010010<br />
        10101010 11001100 10101010<br />
        01010101 00110011 01010101
      </div>
      <div className="binary-code binary-bottom-right">
        01000001 01000011 01000001<br />
        10101010 11001100 10101010<br />
        01010101 00110011 01010101
      </div>
      
      <div className="loader-content">
        <div className="logo-section">
          {/* Geometric shapes */}
          <div className="shape triangle"></div>
          <div className="shape square"></div>
          <div className="shape pentagon"></div>
          <div className="shape hexagon"></div>
          
          {/* Multiple rings */}
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="ring ring-4"></div>
          <div className="ring ring-5"></div>
          <div className="ring ring-6"></div>
          
          {/* Orbital particles */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          
          {/* Tech icons */}
          <div className="tech-icon icon-code"></div>
          <div className="tech-icon icon-data">01</div>
          <div className="tech-icon icon-cloud">☁</div>
          <div className="tech-icon icon-security">🔒</div>
          <div className="tech-icon icon-ai">AI</div>
          <div className="tech-icon icon-mobile">📱</div>
          <div className="tech-icon icon-web">🌐</div>
          <div className="tech-icon icon-database">DB</div>
          
          <div className="logo-emblem">
            <div className="logo-inner">M</div>
            <svg className="logo-circle" viewBox="0 0 100 100">
              <circle className="circle-path" cx="50" cy="50" r="45" />
            </svg>
          </div>
        </div>
        
        <div className="text-section">
          <h1 className="academy-title">Miracle IT Career Academy</h1>
          <p className="academy-subtitle">Excellence in IT Education & Training</p>
        </div>
        
        <div className="loading-section">
          <div className="loading-bar">
            <div className="loading-progress"></div>
            <div className="loading-percentage"></div>
          </div>
          <p className="loading-text">
            Loading resources<span className="loading-dots"></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loader;
