import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import './CourseDetails.css';

const CourseDetails = () => {
  const { user, logout } = useAuth();
  const [clickedLinks, setClickedLinks] = React.useState({});
  const [activeFilter, setActiveFilter] = React.useState('All');

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const courses = [
    {
      id: 1,
      title: "Data Analysis",
      icon: "fas fa-chart-bar",
      description: "Learn to analyze and interpret complex data sets using modern tools and techniques.",
      details: [
        "Master data visualization techniques",
        "Learn statistical analysis methods",
        "Work with real-world datasets",
        "Develop skills in Python, R, and SQL",
        "Create insightful reports and dashboards"
      ],
      duration: "6 months",
      level: "Intermediate"
    },
    {
      id: 2,
      title: "Web Development",
      icon: "fas fa-code",
      description: "Build modern, responsive websites and web applications using the latest technologies.",
      details: [
        "Frontend development with HTML, CSS, and JavaScript",
        "Backend development with Node.js and Express",
        "Database design and implementation",
        "React and other modern frameworks",
        "Deployment and hosting strategies"
      ],
      duration: "8 months",
      level: "Beginner to Advanced"
    },
    {
      id: 3,
      title: "Machine Learning",
      icon: "fas fa-brain",
      description: "Explore the fundamentals of machine learning and artificial intelligence.",
      details: [
        "Supervised and unsupervised learning algorithms",
        "Neural networks and deep learning",
        "Natural language processing",
        "Computer vision applications",
        "Model deployment and monitoring"
      ],
      duration: "10 months",
      level: "Advanced"
    },
    {
      id: 4,
      title: "Mobile App Development",
      icon: "fas fa-mobile-alt",
      description: "Create native and cross-platform mobile applications for iOS and Android.",
      details: [
        "UI/UX design for mobile interfaces",
        "React Native development",
        "Native iOS development with Swift",
        "Native Android development with Kotlin",
        "App store deployment and optimization"
      ],
      duration: "7 months",
      level: "Intermediate"
    },
    {
      id: 5,
      title: "Cloud Computing",
      icon: "fas fa-cloud",
      description: "Master cloud platforms and learn to deploy scalable, resilient applications.",
      details: [
        "AWS, Azure, and Google Cloud fundamentals",
        "Infrastructure as Code (IaC)",
        "Containerization with Docker",
        "Orchestration with Kubernetes",
        "Cloud security best practices"
      ],
      duration: "6 months",
      level: "Intermediate to Advanced"
    },
    {
      id: 6,
      title: "Workshop: UI/UX Design",
      icon: "fas fa-pencil-ruler",
      description: "Intensive workshop on creating user-centered designs and improving user experience.",
      details: [
        "User research and persona development",
        "Wireframing and prototyping",
        "Usability testing methods",
        "Design systems and component libraries",
        "Accessibility best practices"
      ],
      duration: "2 weeks",
      level: "All Levels",
      type: "Workshop"
    },
    {
      id: 7,
      title: "Certificate: Cybersecurity Fundamentals",
      icon: "fas fa-shield-alt",
      description: "Earn a professional certificate in cybersecurity fundamentals and best practices.",
      details: [
        "Network security principles",
        "Threat detection and prevention",
        "Security compliance frameworks",
        "Incident response procedures",
        "Security tools and technologies"
      ],
      duration: "3 months",
      level: "Beginner to Intermediate",
      type: "Certificate"
    }
  ];

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

      <div className="course-details-container">
        <h1 className="course-details-title">Our Courses</h1>
        <p className="course-details-subtitle">Explore our comprehensive range of courses designed to help you succeed in today's digital world.</p>
        
        <div className="course-filters">
          <button 
            className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Course' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Course')}
          >
            Courses
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Workshop' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Workshop')}
          >
            Workshops
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'Certificate' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Certificate')}
          >
            Certificates
          </button>
        </div>
        
        <div className="courses-grid">
          {courses
            .filter(course => activeFilter === 'All' || course.type === activeFilter || (!course.type && activeFilter === 'Course'))
            .map(course => (
              <div key={course.id} className="course-card">
                <div className="course-icon">
                  <i className={course.icon}></i>
                </div>
                {course.type && <span className="course-type">{course.type}</span>}
                <h2 className="course-title">{course.title}</h2>
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <span><i className="fas fa-clock"></i> {course.duration}</span>
                  <span><i className="fas fa-layer-group"></i> {course.level}</span>
                </div>
                
                <div className="course-details-list">
                  <h3>What you'll learn:</h3>
                  <ul>
                    {course.details.map((detail, index) => (
                      <li key={index}><i className="fas fa-check"></i> {detail}</li>
                    ))}
                  </ul>
                </div>
                
                <NavLink to="/courses" className="enroll-button">
                  Explore {course.type || 'Course'}
                </NavLink>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default CourseDetails;