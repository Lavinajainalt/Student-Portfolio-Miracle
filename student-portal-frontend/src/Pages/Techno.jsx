import React, { useState, useEffect, useCallback } from 'react';
import './animate.css';
import './Techno.css';
import { FaPython, FaJava, FaJs, FaReact, FaNodeJs, FaAws, FaHtml5, FaCss3Alt, FaAngular, FaVuejs, FaPhp } from 'react-icons/fa';
import { SiDocker, SiKubernetes, SiMongodb, SiPostgresql, SiTensorflow, SiFlutter, SiSwift, SiKotlin, SiDjango } from 'react-icons/si';

export default function Techno() {
  const [animatedIcons, setAnimatedIcons] = useState(false);

  // Define all tech icons with their properties
  const techIcons = [
    // Left side icons
    { icon: <FaPython size={28} color="#306998" />, position: "tech-icon-left tech-icon-left-top", size: "icon-size-medium", animation: "float-animation-1", delay: 0.2 },
    { icon: <FaJava size={28} color="#007396" />, position: "tech-icon-left tech-icon-left-middle-top", size: "icon-size-large", animation: "float-animation-2", delay: 0.5 },
    { icon: <FaJs size={28} color="#F7DF1E" />, position: "tech-icon-left tech-icon-left-middle", size: "icon-size-medium", animation: "float-animation-3", delay: 0.8 },
    { icon: <FaReact size={28} color="#61DAFB" />, position: "tech-icon-left tech-icon-left-middle-bottom", size: "icon-size-large", animation: "float-animation-1", delay: 1.1 },
    { icon: <FaNodeJs size={28} color="#339933" />, position: "tech-icon-left tech-icon-left-bottom", size: "icon-size-medium", animation: "float-animation-2", delay: 1.4 },
    { icon: <FaHtml5 size={28} color="#E34F26" />, position: "tech-icon-left tech-icon-left-extra-1", size: "icon-size-small", animation: "float-animation-3", delay: 1.7 },
    { icon: <FaCss3Alt size={28} color="#1572B6" />, position: "tech-icon-left tech-icon-left-extra-2", size: "icon-size-small", animation: "float-animation-1", delay: 2.0 },
    
    // Right side icons
    { icon: <FaAws size={28} color="#FF9900" />, position: "tech-icon-right tech-icon-right-top", size: "icon-size-medium", animation: "float-animation-2", delay: 0.3 },
    { icon: <SiDocker size={28} color="#2496ED" />, position: "tech-icon-right tech-icon-right-middle-top", size: "icon-size-large", animation: "float-animation-3", delay: 0.6 },
    { icon: <SiKubernetes size={28} color="#326CE5" />, position: "tech-icon-right tech-icon-right-middle", size: "icon-size-medium", animation: "float-animation-1", delay: 0.9 },
    { icon: <SiMongodb size={28} color="#47A248" />, position: "tech-icon-right tech-icon-right-middle-bottom", size: "icon-size-large", animation: "float-animation-2", delay: 1.2 },
    { icon: <SiPostgresql size={28} color="#336791" />, position: "tech-icon-right tech-icon-right-bottom", size: "icon-size-medium", animation: "float-animation-3", delay: 1.5 },
    { icon: <FaAngular size={28} color="#DD0031" />, position: "tech-icon-right tech-icon-right-extra-1", size: "icon-size-small", animation: "float-animation-1", delay: 1.8 },
    { icon: <FaVuejs size={28} color="#4FC08D" />, position: "tech-icon-right tech-icon-right-extra-2", size: "icon-size-small", animation: "float-animation-2", delay: 2.1 },
    
    // Additional icons for more variety
    { icon: <SiTensorflow size={28} color="#FF6F00" />, position: "tech-icon-left", style: { top: '40%', left: '22%' }, size: "icon-size-small", animation: "float-animation-3", delay: 2.3 },
    { icon: <SiFlutter size={28} color="#02569B" />, position: "tech-icon-right", style: { top: '40%', right: '22%' }, size: "icon-size-small", animation: "float-animation-1", delay: 2.4 },
    { icon: <SiSwift size={28} color="#FA7343" />, position: "tech-icon-left", style: { top: '90%', left: '15%' }, size: "icon-size-small", animation: "float-animation-2", delay: 2.5 },
    { icon: <SiKotlin size={28} color="#7F52FF" />, position: "tech-icon-right", style: { top: '90%', right: '15%' }, size: "icon-size-small", animation: "float-animation-3", delay: 2.6 },
    { icon: <SiDjango size={28} color="#092E20" />, position: "tech-icon-left", style: { top: '10%', left: '25%' }, size: "icon-size-small", animation: "float-animation-1", delay: 2.7 },
    { icon: <FaPhp size={28} color="#777BB4" />, position: "tech-icon-right", style: { top: '10%', right: '25%' }, size: "icon-size-small", animation: "float-animation-2", delay: 2.8 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedIcons(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = useCallback((e, scale, shadow) => {
    e.currentTarget.style.transform = `scale(${scale})`;
    e.currentTarget.style.boxShadow = shadow;
  }, []);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
  }, []);

  const generateParticleStyles = () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    width: `${Math.random() * 10 + 5}px`,
    height: `${Math.random() * 10 + 5}px`,
    background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
  });

  return (
    <div className="tech-section">
      <div className="section-header animate__animated animate__fadeIn">
        <h2 className="animate__animated animate__slideInDown">Master In-Demand Technologies</h2>
        <div className="section-divider animate__animated animate__zoomIn animate__delay-1s"></div>
        <p className="animate__animated animate__fadeIn animate__delay-1s">
          Our curriculum covers the most sought-after skills in the industry
        </p>
      </div>

      <div className="welcome-section animate__animated animate__fadeIn">
        <div className="tech-showcase-container">
          <svg
            className="tech-svg-lines"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="tech-path path-1" d="M0,100 Q250,300 500,100 T1000,100" />
            <path className="tech-path path-2" d="M0,300 Q250,500 500,300 T1000,300" />
            <path className="tech-path path-3" d="M0,500 Q250,700 500,500 T1000,500" />
            <path
              className="tech-path path-4"
              d="M0,200 Q400,50 800,200 T1000,200"
              style={{ stroke: "rgba(15, 157, 88, 0.2)", animationDelay: "1.2s" }}
            />
            <path
              className="tech-path path-5"
              d="M0,400 Q200,600 600,400 T1000,400"
              style={{ stroke: "rgba(244, 180, 0, 0.2)", animationDelay: "1.5s" }}
            />
          </svg>

          <div className="tech-bg-circle circle-1"></div>
          <div className="tech-bg-circle circle-2"></div>
          <div className="tech-bg-circle circle-3"></div>
          <div className="tech-bg-circle circle-4"></div>
          <div className="tech-bg-circle circle-5"></div>

          {/* Distributed tech icons */}
          <div className="tech-icons-container">
            {techIcons.map((item, index) => (
              <div
                key={`tech-icon-${index}`}
                className={`tech-icon-circle ${item.position} ${item.size} ${animatedIcons ? item.animation : ''}`}
                style={{
                  ...item.style,
                  animationDelay: `${item.delay}s`,
                  transform: animatedIcons ? 'scale(1)' : 'scale(0)'
                }}
                onMouseEnter={(e) =>
                  handleMouseEnter(e, 1.2, 
                    `0 10px 25px rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`)
                }
                onMouseLeave={handleMouseLeave}
              >
                <div className="tech-icon-inner">{item.icon}</div>
                <div className="tech-icon-pulse"></div>
              </div>
            ))}
          </div>

          {/* Center content */}
          <div className="tech-center-container">
            <div className="tech-center-text">
              <h2 className="animate__animated animate__fadeInUp">Get ready for</h2>
              <h3 className="animate__animated animate__fadeInUp animate__delay-1s tech-gradient-text">
                endless innovation
              </h3>
              <div className="tech-tagline">
                <span className="animate__animated animate__fadeIn animate__delay-1s tech-tag-item">
                  Learn
                </span>
                <span className="animate__animated animate__fadeIn animate__delay-2s tech-tag-item">
                  Build
                </span>
                <span className="animate__animated animate__fadeIn animate__delay-3s tech-tag-item">
                  Innovate
                </span>
              </div>
              <button
                className="tech-explore-btn animate__animated animate__bounceIn animate__delay-3s"
                onClick={() => console.log('Explore technologies clicked')}
              >
                Explore Technologies
                <i className="fas fa-arrow-right tech-btn-icon"></i>
              </button>
            </div>
          </div>

          <div className="tech-particles">
            {[...Array(15)].map((_, i) => (
              <div key={`particle-${i}`} className="tech-particle" style={generateParticleStyles()}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
