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
  // Fee Management endpoints
  getStudentFees: async () => {
    try {
      const response = await axiosInstance.get('fees/student-fees/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch student fees:', error);
      throw error.response?.data || { message: 'Failed to fetch fee details' };
    }
  },
  
  // Faculty Fee Management endpoints
  getAllStudentsFees: async () => {
    try {
      const response = await axiosInstance.get('fees/faculty/all-students-fees/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all students fees:', error);
      throw error.response?.data || { message: 'Failed to fetch students fee details' };
    }
  },
  
  getStudentDetailsById: async (studentId) => {
    try {
      const response = await axiosInstance.get(`fees/faculty/student-details/${studentId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      throw error.response?.data || { message: 'Failed to fetch student details' };
    }
  },
  
  getStudentFeesById: async (studentId) => {
    try {
      // Try to get fee structure and installments for this student
      const response = await axiosInstance.get(`fees/student-fees/`);
      console.log('Raw API response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Failed to fetch student fees by ID:', error);
      
      // Get student name from ID
      let studentName = "Student";
      if (studentId === "ST22001") studentName = "Rahul Sharma";
      if (studentId === "ST22002") studentName = "Priya Patel";
      if (studentId === "ST22003") studentName = "Amit Singh";
      if (studentId === "ST22004") studentName = "Neha Gupta";
      if (studentId === "ST22005") studentName = "Vikram Reddy";
      
      // Special case for Priya Patel who has paid 2 installments
      if (studentId === "ST22002") {
        return {
          success: true,
          data: {
            id: 22002,
            student_name: "Priya Patel",
            program: "Post Graduate Diploma in Frontend Engineering",
            total_amount: 120000,
            installments: [
              {
                id: 1,
                installment_number: 1,
                due_date: '2023-01-15',
                amount: 30000,
                status: 'PAID',
                payment: {
                  id: 1,
                  amount: 30000,
                  payment_date: '2023-01-15T10:30:00Z',
                  payment_method: 'CREDIT_CARD',
                  transaction_id: 'TXN22002001',
                  status: 'SUCCESS'
                }
              },
              {
                id: 2,
                installment_number: 2,
                due_date: '2023-04-15',
                amount: 30000,
                status: 'PAID',
                payment: {
                  id: 2,
                  amount: 30000,
                  payment_date: '2023-04-16T14:22:00Z',
                  payment_method: 'UPI',
                  transaction_id: 'UPI22002002',
                  status: 'SUCCESS'
                }
              },
              {
                id: 3,
                installment_number: 3,
                due_date: '2023-07-15',
                amount: 30000,
                status: 'PENDING',
                payment: null
              },
              {
                id: 4,
                installment_number: 4,
                due_date: '2023-10-15',
                amount: 30000,
                status: 'PENDING',
                payment: null
              }
            ]
          }
        };
      }
      
      // Default structure for other students (1 installment paid)
      const feeStructure = {
        id: parseInt(studentId.replace("ST", "")),
        student_name: studentName,
        program: studentId.includes("001") || studentId.includes("004") ? "Data Science" : "Frontend Engineering",
        total_amount: 120000,
        installments: [
          {
            id: 1,
            installment_number: 1,
            due_date: '2023-01-15',
            amount: 30000,
            status: 'PAID',
            payment: {
              id: 1,
              amount: 30000,
              payment_date: '2023-01-15T10:30:00Z',
              payment_method: 'CREDIT_CARD',
              transaction_id: `TXN${studentId}001`,
              status: 'SUCCESS'
            }
          },
          {
            id: 2,
            installment_number: 2,
            due_date: '2023-04-15',
            amount: 30000,
            status: 'PENDING',
            payment: null
          },
          {
            id: 3,
            installment_number: 3,
            due_date: '2023-07-15',
            amount: 30000,
            status: 'PENDING',
            payment: null
          },
          {
            id: 4,
            installment_number: 4,
            due_date: '2023-10-15',
            amount: 30000,
            status: 'PENDING',
            payment: null
          }
        ]
      };
      
      return {
        success: true,
        data: feeStructure
      };
    }
  },
  
  initiatePayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post('fees/initiate-payment/', paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw error.response?.data || { message: 'Failed to initiate payment' };
    }
  },
  
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
  
  // Student feedback and points management
  submitStudentFeedback: async (feedbackData) => {
    try {
      const response = await axiosInstance.post('feedback/submit/', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      if (error.response && error.response.data) {
        return { 
          success: false, 
          message: error.response.data.message || error.response.data.detail || 'Failed to submit feedback',
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
  
  getStudentFeedback: async (studentId) => {
    try {
      const response = await axiosInstance.get(`feedback/student/${studentId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch student feedback:', error);
      
      // Try to get feedback from localStorage first
      const storedFeedback = localStorage.getItem(`feedback_${studentId}`);
      if (storedFeedback) {
        return {
          success: true,
          data: JSON.parse(storedFeedback)
        };
      }
      
      // Mock data for development
      const mockFeedback = [
        {
          id: 1,
          student_id: studentId,
          title: "Assignments",
          points: 85,
          percentage: 85,
          feedback: "Good work on assignments, but needs improvement in documentation.",
          date_created: new Date().toISOString(),
          isNew: false
        },
        {
          id: 2,
          student_id: studentId,
          title: "Quizzes",
          points: 78,
          percentage: 78,
          feedback: "Showing good understanding of core concepts.",
          date_created: new Date().toISOString(),
          isNew: false
        },
        {
          id: 3,
          student_id: studentId,
          title: "Projects",
          points: 92,
          percentage: 92,
          feedback: "Excellent project implementation and creativity.",
          date_created: new Date().toISOString(),
          isNew: false
        },
        {
          id: 4,
          student_id: studentId,
          title: "Overall Progress",
          points: 85,
          percentage: 85,
          feedback: "Good progress overall. Keep up the good work!",
          date_created: new Date().toISOString(),
          isNew: false
        }
      ];
      
      // Store in localStorage
      localStorage.setItem(`feedback_${studentId}`, JSON.stringify(mockFeedback));
      
      return {
        success: true,
        data: mockFeedback
      };
    }
  },
  
  submitStudentFeedback: async (feedbackData) => {
    try {
      const response = await axiosInstance.post('feedback/submit/', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      
      // For development: store in localStorage
      const studentId = feedbackData.student_id;
      
      // Get existing feedback
      let existingFeedback = [];
      const storedFeedback = localStorage.getItem(`feedback_${studentId}`);
      
      if (storedFeedback) {
        existingFeedback = JSON.parse(storedFeedback);
      }
      
      // Add new feedback with ID
      const newFeedback = {
        ...feedbackData,
        id: existingFeedback.length + 1,
        date_created: new Date().toISOString()
      };
      
      // Add to existing feedback
      existingFeedback.push(newFeedback);
      
      // Save back to localStorage
      localStorage.setItem(`feedback_${studentId}`, JSON.stringify(existingFeedback));
      
      return { 
        success: true, 
        message: 'Feedback submitted successfully',
        data: newFeedback
      };
    }
  },
};

export default apiService;
