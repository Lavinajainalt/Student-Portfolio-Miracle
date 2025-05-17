import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded credentials for testing
  const validCredentials = {
    username: 'admin',
    password: 'password123'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Check if credentials match
      if (credentials.username === validCredentials.username && 
          credentials.password === validCredentials.password) {
        
        // Store mock token and user info
        localStorage.setItem('token', 'mock-jwt-token-12345');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: credentials.username,
          name: 'Admin User',
          role: 'admin'
        }));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Try using: admin / password123');
      }
      
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-animation">
          <DotLottieReact
            src="https://lottie.host/14eaed5a-dd39-4804-9b8f-e08e4bc14fa4/gdQdE9ei6l.lottie"
            loop
            autoplay
            height={200}
            width={200}
          />
        </div>
        
        <div className="login-form-section">
          <h2>Student Portal Login</h2>
          <p>Enter your credentials to access your account</p>
          
          {error && <div className="login-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="login-hint">
              <p><strong>Test credentials:</strong> username: admin, password: password123</p>
            </div>
            
            <div className="form-footer">
              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            </div>
          </form>
          
          <div className="login-options">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;