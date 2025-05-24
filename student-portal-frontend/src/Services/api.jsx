// src/services/api.jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Only attempt refresh if we have a refresh token
        if (userData && userData.refreshToken) {
          const refreshResponse = await axios.post(`${API_URL}token/refresh/`, {
            refresh: userData.refreshToken
          });
          
          // Update stored tokens
          const newUserData = {
            ...userData,
            token: refreshResponse.data.access,
            refreshToken: refreshResponse.data.refresh || userData.refreshToken
          };
          
          localStorage.setItem('user', JSON.stringify(newUserData));
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  login: async (username, password, role) => {
    try {
      console.log('Attempting login with:', { username, role });
      
      // Try using direct axios call with explicit content type
      const response = await axios({
        method: 'post',
        url: `${API_URL}login/`,
        data: {
          username,
          password,
          role
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data);
      
      // Make sure we have a consistent response structure
      if (response.data && response.data.success === true) {
        // Backend returns success: true
        return {
          ...response.data,
          token: response.data.token,
          refreshToken: response.data.refresh,
          user: response.data.user,
          success: true
        };
      } else {
        // Backend returns data but success is not true
        return {
          success: false,
          message: response.data.message || 'Login failed',
          error: response.data
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Return error object instead of throwing it
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Login failed. Please check your credentials.',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('register/', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Registration failed',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
  
  logout: async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && userData.refreshToken) {
        // Blacklist the refresh token on the server
        await axiosInstance.post('logout/', {
          refresh_token: userData.refreshToken
        });
      }
      // Clear local storage regardless of server response
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      // Still clear local storage even if server request fails
      localStorage.removeItem('user');
      return { success: true, message: 'Logged out locally' };
    }
  },
  
  requestPasswordReset: async (email, role) => {
    try {
      const response = await axiosInstance.post('password-reset/request/', {
        email,
        role
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Password reset request failed',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
  
  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('password-reset/confirm/', {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Password reset confirmation failed',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
  
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axiosInstance.post('password/change/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Password change failed',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
  
  verifyToken: async () => {
    try {
      const response = await axiosInstance.post('token/verify/');
      return { valid: true, data: response.data };
    } catch (error) {
      return { valid: false, error: error.response?.data || error.message };
    }
  },

  // User endpoints
  getUser: async (id) => {
    try {
      const response = await axiosInstance.get(`users/${id}/`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Failed to get user data',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },

  updateUserProfile: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`users/${id}/`, userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Failed to update profile',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },

  // Contact form
  submitContactForm: async (formData) => {
    try {
      // Use direct axios call instead of axiosInstance
      const response = await axios.post(`${API_URL}contact/submit/`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Failed to submit contact form',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },

  // New function to get user course videos
  getUserCourseVideos: async () => {
    try {
      const response = await axiosInstance.get('user/videos/');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Failed to fetch videos',
          error: error.response.data 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error. Please try again later.',
          error: error.message
        };
      }
    }
  },
};

export default apiService;
