import axios from 'axios';

const API_URL = '/api/quiz/points/';

// Generate a unique guest ID if not logged in
const getGuestId = () => {
  let guestId = localStorage.getItem('quiz_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('quiz_guest_id', guestId);
  }
  return guestId;
};

const QuizService = {
  // Get points from the server
  getPoints: async (user) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {}
      };
      
      // Add authorization header if user is logged in
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      } else {
        // Use guest ID if not logged in
        config.params.guest_id = getGuestId();
      }
      
      const response = await axios.get(API_URL, config);
      return response.data.points;
    } catch (error) {
      console.error('Error fetching points:', error);
      return 0;
    }
  },
  
  // Save points to the server
  savePoints: async (points, user) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      const data = { points };
      
      // Add authorization header if user is logged in
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      } else {
        // Use guest ID if not logged in
        data.guest_id = getGuestId();
      }
      
      const response = await axios.post(API_URL, data, config);
      return response.data.points;
    } catch (error) {
      console.error('Error saving points:', error);
      // Save to localStorage as fallback
      localStorage.setItem('quizPoints', points.toString());
      return points;
    }
  }
};

export default QuizService;