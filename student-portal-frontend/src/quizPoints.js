// Global points storage
const QuizPoints = {
  points: 0,
  
  // Load points from localStorage
  loadPoints: function() {
    const savedPoints = localStorage.getItem('quizPoints');
    if (savedPoints) {
      this.points = parseInt(savedPoints);
    }
    return this.points;
  },
  
  // Save points to localStorage
  savePoints: function(points) {
    this.points = points;
    localStorage.setItem('quizPoints', points.toString());
  },
  
  // Get current points
  getPoints: function() {
    return this.points;
  }
};

// Load points on module initialization
QuizPoints.loadPoints();

export default QuizPoints;