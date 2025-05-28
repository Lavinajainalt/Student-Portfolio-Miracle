import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './Pages/welcomePage';
import UserRoleSelect from './Pages/UserRoleSelect';
import Faculty from './Login/Faculty';
import Student from './Login/Student';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './Dashboard/StudentDashboard';
import FacultyDashboard from './Dashboard/FacultyDashboard';
import Home from './Pages/Home';
import Maincontact from './Pages/Maincontact';
import About from './Pages/About';
import Quiz from './MainHome/Quiz';
import Community from './Pages/Community';
import CommunityPage from './Pages/CommunityCenter';
import FeeManagement from './components/StudentDashboard/FeeManagement';
import Courses from './Pages/Course';
import Test from './Pages/Test'; // Adjust the import path as necessary


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/select-role" element={<UserRoleSelect />} />
        <Route path="/faculty-login" element={<Faculty />} />
        <Route path="/student-login" element={<Student />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route path="/test" element={<Test />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fees" 
          element={
            <ProtectedRoute>
              <FeeManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/communitycenter" 
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/about" 
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/maincontact" 
          element={
            <ProtectedRoute>
              <Maincontact />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/faculty/dashboard" 
          element={
            <ProtectedRoute requiredRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
