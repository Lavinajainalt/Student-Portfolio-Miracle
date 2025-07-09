import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './aos-custom.css';
import './About.css';
import '../Dashboard/StudentNavbar.css';
import { FaReact, FaPython, FaJava, FaNodeJs, FaDatabase, FaUsers, FaGraduationCap, FaLaptopCode, FaChalkboardTeacher, FaGlobe, FaLightbulb } from 'react-icons/fa';
import { SiJavascript, SiTensorflow, SiPytorch, SiMongodb } from 'react-icons/si';
import Logo from '../Images/logo.png';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AboutImage from '../Images/about.webp';
import ThemeToggle from '../components/ThemeToggle';


const AboutFaculty = () => {
  const [floatingIcons, setFloatingIcons] = useState([]);
  const { user, logout } = useAuth();
  const [clickedLinks, setClickedLinks] = useState({});

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  useEffect(() => {
    // Initialize AOS animation library with enhanced settings
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
      delay: 100,
      anchorPlacement: 'top-bottom',
      offset: 120,
      disable: 'mobile'
    });

    // Generate random floating icons
    const icons = [
      { icon: <FaReact />, color: '#61DAFB' },
      { icon: <FaPython />, color: '#3776AB' },
      { icon: <SiJavascript />, color: '#F7DF1E' },
      { icon: <FaJava />, color: '#007396' },
      { icon: <FaNodeJs />, color: '#339933' },
      { icon: <SiTensorflow />, color: '#FF6F00' },
      { icon: <SiPytorch />, color: '#EE4C2C' },
      { icon: <FaDatabase />, color: '#4479A1' },
      { icon: <SiMongodb />, color: '#47A248' }
    ];

    const newFloatingIcons = Array.from({ length: 15 }, (_, i) => {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      return {
        id: i,
        icon: randomIcon.icon,
        color: randomIcon.color,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 20 + 10
      };
    });

    setFloatingIcons(newFloatingIcons);
    
    // Refresh AOS when component updates
    window.addEventListener('load', AOS.refresh);
    
    return () => {
      window.removeEventListener('load', AOS.refresh);
    };
  }, []);

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former AI researcher at MIT with 15+ years of experience in educational technology.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#4285f4"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Ex-Google engineer specializing in machine learning and adaptive learning systems.",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#0F9D58"
    },
    {
      name: "Priya Patel",
      role: "Head of Curriculum",
      bio: "Former professor with expertise in computer science education and learning methodologies.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#DB4437"
    },
    {
      name: "James Wilson",
      role: "Lead Developer",
      bio: "Full-stack developer with a passion for creating intuitive educational platforms.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      color: "#F4B400"
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Foundation",
      description: "Company founded with a mission to democratize coding education through AI technology."
    },
    {
      year: "2019",
      title: "First Platform Launch",
      description: "Released our first beta platform with adaptive learning for web development courses."
    },
    {
      year: "2020",
      title: "Series A Funding",
      description: "Secured $5M in funding to expand our course offerings and enhance AI capabilities."
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded to serve students in over 50 countries with localized content and support."
    },
    {
      year: "2022",
      title: "AI Learning Assistant",
      description: "Launched our revolutionary AI Learning Assistant to provide personalized guidance."
    },
    {
      year: "2023",
      title: "Industry Recognition",
      description: "Named 'Most Innovative EdTech Platform' by Education Technology Insights."
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Student Portal</h2>
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
          <span>{user?.username || 'Faculty'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div>
   <div className="about-hero1">
  <div className="about-content1">
    <h1 className="about-title1">About <span className="highlight1">Us</span></h1>
    <p className="about-text1">
      Student Fortal is your trusted digital companion throughout your academic journey...
    </p>
  </div>

  <div className="about-image-container">
    <img src={AboutImage} alt="About" className="about-image" />
    
    {/* SVG animated wave lines */}
<svg
  className="wave-lines-vertical"
  viewBox="0 0 100 300"
  xmlns="http://www.w3.org/2000/svg"
>
  <g stroke="#60a5fa" strokeWidth="1" fill="none">
    <path d="M20,0 C40,80 0,220 20,300" />
    <path d="M40,0 C60,80 20,220 40,300" />
    <path d="M60,0 C80,80 40,220 60,300" />
    <path d="M80,0 C100,80 60,220 80,300" />
  </g>
</svg>


  </div>
</div>
</div>

        {/* Mission Statement */}
        <div
          data-aos="fade-up"
          data-aos-duration="1200"
          className="about-content glass-card"
        >
          <h2
            data-aos="fade-right"
            data-aos-delay="200"
            className="section-title neon-text"
          >
            Our Mission
          </h2>
          
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="section-text"
          >
            Founded in 2018, our mission is to democratize coding education through innovative AI-powered learning experiences. 
            We believe that everyone should have access to high-quality programming education, regardless of their background or prior experience.
            Our student portal combines cutting-edge AI technology with expert-crafted curriculum to provide 
            a personalized learning experience that adapts to each student's unique needs and learning style.
          </p>

          <div
            data-aos="zoom-in"
            data-aos-delay="400"
            className="button-container"
          >
            <motion.button
              className="button-3d"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(108, 99, 255, 0.7)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More About Our Approach
            </motion.button>
          </div>
        </div>

        {/* Statistics Section with Enhanced Design */}
        <div 
          className="stats-wrapper glass-card"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <h2
            data-aos="super-fade-up"
            data-aos-delay="200"
            className="section-title neon-text neon-glow"
          >
            Our Impact
          </h2>
          
          <div className="stats-section">
            {[
              { icon: <FaGraduationCap />, number: "50+", label: "Courses", color: "#6c63ff", delay: 300 },
              { icon: <FaUsers />, number: "1000+", label: "Students", color: "#4285f4", delay: 400 },
              { icon: <FaChalkboardTeacher />, number: "30+", label: "Instructors", color: "#DB4437", delay: 500 },
              { icon: <FaLightbulb />, number: "95%", label: "Success Rate", color: "#F4B400", delay: 600 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item enhanced-card"
                data-aos="zoom-in"
                data-aos-delay={stat.delay}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 20px ${stat.color}`,
                  y: -10
                }}
              >
                <motion.div 
                  className="stat-icon"
                  style={{ color: stat.color }}
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div className="stat-number" style={{ background: `linear-gradient(45deg, ${stat.color}, #4285f4)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {stat.number}
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <div>
        <div
          className="values-section glass-card"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out-back"
        >
          <h2
            data-aos="super-fade-up"
            data-aos-delay="200"
            className="section-title neon-text neon-glow"
          >
            Our Values
          </h2>

          <div className="values-grid">
            {[
              { title: "Innovation", icon: <FaLaptopCode />, description: "We constantly push the boundaries of what's possible in educational technology", color: "#6c63ff", animation: "flip-left" },
              { title: "Accessibility", icon: <FaUsers />, description: "We strive to make quality education available to everyone, everywhere", color: "#4285f4", animation: "flip-up" },
              { title: "Excellence", icon: <FaGraduationCap />, description: "We are committed to delivering the highest quality learning experience", color: "#DB4437", animation: "flip-right" },
              { title: "Community", icon: <FaChalkboardTeacher />, description: "We foster a supportive environment where learners can grow together", color: "#F4B400", animation: "flip-down" }
            ].map((value, index) => (
              <div
                key={index}
                className="perspective-card"
                data-aos={value.animation}
                data-aos-delay={300 + (index * 150)}
                data-aos-duration="1200"
                data-aos-anchor-placement="center-bottom"
              >
                <div className="perspective-content">
                  <motion.div 
                    className="value-icon"
                    style={{ color: value.color }}
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 1
                    }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="value-title" style={{ color: value.color }}>{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
</div>
        {/* Team Members Section */}
        <div
          className="team-section glass-card"
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-offset="200"
          
        >
          <h2
            data-aos="super-fade-up"
            data-aos-delay="200"
            className="section-title neon-text neon-glow"
          >
            Our Team
          </h2>

          <div className="team-grid">
            {teamMembers.map((member, index) => {
              // Different animation for each team member
              const animations = ["fade-right", "fade-up", "fade-left", "fade-down"];
              const animation = animations[index % animations.length];
              
              return (
                <div
                  key={index}
                  className="team-member animated-border enhanced-card"
                  data-aos={animation}
                  data-aos-delay={300 + (index * 150)}
                  data-aos-duration="1000"
                  data-aos-anchor-placement="top-bottom"
                  data-aos-easing="ease-in-out-cubic"
                >
                  <motion.div
                    className="member-image"
                    style={{ borderColor: member.color }}
                    whileHover={{ scale: 1.1, rotate: 5, boxShadow: `0 0 20px ${member.color}` }}
                  >
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="pulse-animation"
                    />
                  </motion.div>
                  <h3 className="member-name" style={{ color: member.color }}>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-bio">{member.bio}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company Timeline */}
        <div
          className="timeline-section"
          data-aos="fade-up"
          data-aos-duration="1200"
          data-aos-offset="300"
        >
          <h2
            data-aos="super-fade-up"
            data-aos-delay="200"
            className="section-title neon-text neon-glow"
          >
            Our Journey
          </h2>

          <div className="timeline-container">
            {/* Timeline line */}
            <div 
              className="timeline-line"
              data-aos="height"
              data-aos-duration="1500"
              data-aos-easing="ease-in-out"
            />

            {milestones.map((milestone, index) => {
              // Alternate animations for timeline items
              const animation = index % 2 === 0 ? "fade-right" : "fade-left";
              
              return (
                <div
                  key={index}
                  className="timeline-item"
                  data-aos={animation}
                  data-aos-delay={300 + (index * 150)}
                  data-aos-duration="1000"
                  data-aos-anchor-placement="top-bottom"
                >
                  <div className="timeline-content">
                    {/* Year badge */}
                    <div className="timeline-year" data-aos="zoom-in" data-aos-delay={400 + (index * 150)}>
                      {milestone.year}
                    </div>
                    
                    {/* Timeline dot */}
                    <motion.div 
                      className="timeline-dot pulse-animation"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 1], 
                        backgroundColor: ["#6c63ff", "#ff6b6b", "#4ecdc4", "#6c63ff"],
                        boxShadow: [
                          "0 0 0 0 rgba(108, 99, 255, 0.7)",
                          "0 0 0 10px rgba(108, 99, 255, 0)",
                          "0 0 0 0 rgba(108, 99, 255, 0.7)"
                        ]
                      }}
                      transition={{ delay: 0.2, duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                    
                    <h3 className="timeline-title">{milestone.title}</h3>
                    <p className="timeline-description">{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div
          className="cta-section"
          data-aos="zoom-in"
          data-aos-duration="1200"
          data-aos-offset="100"
          data-aos-easing="ease-in-out-back"
        >
          <h2
            data-aos="super-fade-up"
            data-aos-delay="200"
            className="cta-title neon-text neon-glow"
          >
            Join Our Learning Community
          </h2>
          
          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="cta-text"
          >
            Be part of our growing community of learners and transform your career with our innovative educational platform.
            Start your journey today and discover the power of personalized, AI-driven learning.
          </p>
          
          <motion.button
            className="ripple-button"
            data-aos="zoom-in"
            data-aos-delay="400"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 25px rgba(108, 99, 255, 0.8)",
              textShadow: "0 0 8px rgba(255, 255, 255, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: ["0 0 5px rgba(108, 99, 255, 0.5)", "0 0 20px rgba(108, 99, 255, 0.8)", "0 0 5px rgba(108, 99, 255, 0.5)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          > <NavLink to='/communitycenter' style={{ textDecoration: 'none', color: 'inherit' }}>
            Get Started Today</NavLink>
          </motion.button>
        </div>

    </div>
  );
};

export default AboutFaculty;