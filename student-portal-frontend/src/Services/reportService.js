import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get attendance data from API
export const getAttendanceData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};

// Get performance data from API
export const getPerformanceData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/performance/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};