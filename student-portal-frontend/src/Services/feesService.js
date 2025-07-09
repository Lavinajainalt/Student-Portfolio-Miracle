import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get fees data from API
export const getFeesData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/fees/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fees data:', error);
    throw error;
  }
};

// Mock data for testing when API is not available
export const getMockFeesData = () => {
  return {
    totalFees: 12500,
    paidAmount: 7500,
    dueAmount: 5000,
    dueDate: '2023-12-15',
    payments: [
      {
        date: '2023-08-15',
        description: 'First Semester Tuition',
        amount: 5000,
        status: 'Paid'
      },
      {
        date: '2023-09-20',
        description: 'Library Fee',
        amount: 500,
        status: 'Paid'
      },
      {
        date: '2023-10-10',
        description: 'Lab Fee',
        amount: 2000,
        status: 'Paid'
      },
      {
        date: '2023-12-15',
        description: 'Second Semester Tuition',
        amount: 5000,
        status: 'Pending'
      }
    ]
  };
};