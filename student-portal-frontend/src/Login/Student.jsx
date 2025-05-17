// src/Login/Student.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../Services/api';
import './Login.css';

function Student() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Submitting login form:', { username, role: 'student' });
      const response = await apiService.login(username, password, 'student');
      console.log('Login response received:', response);
      
      if (response && response.success) {
        // Create a user object with the necessary data
        const userData = {
          id: response.user?.id,
          username: response.user?.username,
          first_name: response.user?.first_name,
          last_name: response.user?.last_name,
          name: `${response.user?.first_name || ''} ${response.user?.last_name || ''}`.trim() || response.user?.username,
          role: 'student',
          token: response.token,
          refreshToken: response.refreshToken || response.refresh,
          ...response
        };
        
        console.log('Logging in with user data:', userData);
        login(userData); // Store in context
        navigate('/home');
      } else {
        setError(response?.message || 'Login failed. Please try again.');
        console.error('Login failed:', response);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
       {/* Background elements */}
       <div className="background">
        <div className="animated-gradient"></div>
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>
      <div className="login-card">
        <h2>Student Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username"></label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <button 
            className="back-button" 
            onClick={() => navigate('/select-role')}
          >
            Back to Selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default Student;