import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Helper function to add auth token to requests
const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

const projectService = {
  // Submit a new project
  submitProject: async (projectData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/student/projects/`, 
        projectData,
        getAuthConfig()
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error submitting project:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to submit project'
      };
    }
  },

  // Get all student projects
  getProjects: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/student/projects/`,
        getAuthConfig()
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch projects'
      };
    }
  }
};

export default projectService;