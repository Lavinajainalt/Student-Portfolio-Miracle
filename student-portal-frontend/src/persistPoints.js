// This script ensures points are saved before page unload
// and properly loaded when the page is refreshed

// Save points to sessionStorage before page unload
window.onbeforeunload = function() {
  const points = localStorage.getItem('quizPoints');
  if (points) {
    sessionStorage.setItem('quizPoints', points);
  }
};

// On page load, ensure both storages are in sync
document.addEventListener('DOMContentLoaded', function() {
  const localPoints = localStorage.getItem('quizPoints');
  const sessionPoints = sessionStorage.getItem('quizPoints');
  
  if (localPoints) {
    sessionStorage.setItem('quizPoints', localPoints);
  } else if (sessionPoints) {
    localStorage.setItem('quizPoints', sessionPoints);
  }
});