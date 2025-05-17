import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './UserRoleSelect.css';

function UserRoleSelect() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation effect when component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <div className={`role-select-container ${isVisible ? 'visible' : ''}`}>
      {/* Background elements */}
      <div className="background">
        <div className="animated-gradient"></div>
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="role-select-content">
        <h1 className="role-select-title">Welcome to Student Portal</h1>
        <p className="role-select-subtitle">Please select your login type to continue</p>
        
        <div className="role-cards">
          <div 
            className="role-card student-card" 
            onClick={() => navigate('/student-login')}
          >
            <div className="role-icon student-icon">
              {/* Student Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h3>Student</h3>
            <p>Access your courses, assignments, and grades</p>
            <button className="role-button">Login as Student</button>
          </div>
          
          <div 
            className="role-card faculty-card" 
            onClick={() => navigate('/faculty-login')}
          >
            <div className="role-icon faculty-icon">
              {/* Faculty Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0-3h9v2H5zm0 6h9v2H5zm14-3h-4v7h4v-7z"/>
              </svg>
            </div>
            <h3>Faculty</h3>
            <p>Manage courses, students, and academic resources</p>
            <button className="role-button">Login as Faculty</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRoleSelect;
