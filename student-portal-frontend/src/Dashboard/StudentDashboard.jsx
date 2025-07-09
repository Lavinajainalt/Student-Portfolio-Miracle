// src/Dashboard/StudentDashboard.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './StudentNavbar.css';
import ThemeToggle from '../components/ThemeToggle';
import apiService from '../Services/api';
import FeeManagement from '../components/StudentDashboard/FeeManagement';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Student details based on user data
const studentDetails = {
  rahul: {
    name: 'Rahul Sharma',
    course: 'DATA_SCIENCE',
    courseFull: 'Data Science',
    email: 'rahul@example.com',
    progress: {
      overall: 75,
      assignments: 85,
      quizzes: 70,
      projects: 78
    },
    quizScores: [
      { title: 'JavaScript Basics', score: 85, date: '2025-05-25' },
      { title: 'Data Structures', score: 92, date: '2025-05-22' },
      { title: 'Algorithms', score: 78, date: '2025-05-20' }
    ],
    testScores: [
      { title: 'Midterm Exam', score: 88, date: '2025-05-24' },
      { title: 'Project 1', score: 90, date: '2025-05-23' }
    ],
    attendance: {
      totalClasses: 30,
      attended: 28,
      percentage: 93.33
    },
    loginStats: {
      totalLogins: 120,
      averageDaily: 3.5,
      lastLogin: '2025-05-28'
    }
  },
  priya: {
    name: 'Priya Patel',
    course: 'PGDFE',
    courseFull: 'Post Graduate Diploma in Frontend Engineering',
    email: 'priya@example.com',
    progress: {
      overall: 82,
      assignments: 88,
      quizzes: 85,
      projects: 80
    },
    quizScores: [
      { title: 'HTML & CSS', score: 90, date: '2025-05-25' },
      { title: 'React Basics', score: 88, date: '2025-05-22' },
      { title: 'JavaScript', score: 92, date: '2025-05-20' }
    ],
    testScores: [
      { title: 'Midterm Exam', score: 92, date: '2025-05-24' },
      { title: 'Project 1', score: 95, date: '2025-05-23' }
    ],
    attendance: {
      totalClasses: 30,
      attended: 29,
      percentage: 96.67
    },
    loginStats: {
      totalLogins: 115,
      averageDaily: 3.2,
      lastLogin: '2025-05-28'
    }
  },
  amit: {
    name: 'Amit Singh',
    course: 'CYBER_SECURITY',
    courseFull: 'Cyber Security',
    email: 'amit@example.com',
    progress: {
      overall: 88,
      assignments: 92,
      quizzes: 85,
      projects: 90
    },
    quizScores: [
      { title: 'Network Security', score: 92, date: '2025-05-25' },
      { title: 'Cryptography', score: 95, date: '2025-05-22' },
      { title: 'Penetration Testing', score: 88, date: '2025-05-20' }
    ],
    testScores: [
      { title: 'Midterm Exam', score: 95, date: '2025-05-24' },
      { title: 'Project 1', score: 98, date: '2025-05-23' }
    ],
    attendance: {
      totalClasses: 30,
      attended: 29,
      percentage: 96.67
    },
    loginStats: {
      totalLogins: 130,
      averageDaily: 3.8,
      lastLogin: '2025-05-28'
    }
  },
  neha: {
    name: 'Neha Gupta',
    course: 'DATA_SCIENCE',
    courseFull: 'Data Science',
    email: 'neha@example.com',
    progress: {
      overall: 85,
      assignments: 90,
      quizzes: 82,
      projects: 88
    },
    quizScores: [
      { title: 'Machine Learning', score: 88, date: '2025-05-25' },
      { title: 'Statistics', score: 92, date: '2025-05-22' },
      { title: 'Python', score: 85, date: '2025-05-20' }
    ],
    testScores: [
      { title: 'Midterm Exam', score: 90, date: '2025-05-24' },
      { title: 'Project 1', score: 92, date: '2025-05-23' }
    ],
    attendance: {
      totalClasses: 30,
      attended: 28,
      percentage: 93.33
    },
    loginStats: {
      totalLogins: 118,
      averageDaily: 3.4,
      lastLogin: '2025-05-28'
    }
  },
  vikram: {
    name: 'Vikram Reddy',
    course: 'PGDFE',
    courseFull: 'Post Graduate Diploma in Frontend Engineering',
    email: 'vikram@example.com',
    progress: {
      overall: 80,
      assignments: 85,
      quizzes: 78,
      projects: 82
    },
    quizScores: [
      { title: 'UI/UX Design', score: 82, date: '2025-05-25' },
      { title: 'Frontend Frameworks', score: 88, date: '2025-05-22' },
      { title: 'Responsive Design', score: 85, date: '2025-05-20' }
    ],
    testScores: [
      { title: 'Midterm Exam', score: 85, date: '2025-05-24' },
      { title: 'Project 1', score: 88, date: '2025-05-23' }
    ],
    attendance: {
      totalClasses: 30,
      attended: 27,
      percentage: 90
    },
    loginStats: {
      totalLogins: 112,
      averageDaily: 3.2,
      lastLogin: '2025-05-28'
    }
  }
};

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [clickedLinks, setClickedLinks] = useState({});
  const [facultyFeedback, setFacultyFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLinkClick = (path) => {
      setClickedLinks(prev => ({
        ...prev,
        [path]: !prev[path]
      }));
    };
  
  const studentInfo = studentDetails[user?.username || ''] || {};
  
  useEffect(() => {
    if (user?.username) {
      fetchFacultyFeedback();
    }
  }, [user]);
  
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  
  const fetchFacultyFeedback = async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudentFeedback(user.username);
      if (response.success && response.data) {
        setFacultyFeedback(response.data);
        
        // Count new feedback items
        const newFeedbackItems = response.data.filter(item => item.isNew);
        setNewFeedbackCount(newFeedbackItems.length);
        
        // Update studentInfo with faculty feedback data
        if (response.data.length > 0) {
          const updatedProgress = { ...studentInfo.progress };
          
          response.data.forEach(item => {
            if (item.title === 'Overall Progress') {
              updatedProgress.overall = item.percentage;
            } else if (item.title === 'Assignments') {
              updatedProgress.assignments = item.percentage;
            } else if (item.title === 'Quizzes') {
              updatedProgress.quizzes = item.percentage;
            } else if (item.title === 'Projects') {
              updatedProgress.projects = item.percentage;
            }
          });
          
          studentInfo.progress = updatedProgress;
        }
      }
    } catch (err) {
      console.error('Error fetching faculty feedback:', err);
      setError('Failed to load faculty feedback');
    } finally {
      setLoading(false);
    }
  };
  
  // Mark feedback as read
  const markFeedbackAsRead = (feedbackId) => {
    const updatedFeedback = facultyFeedback.map(item => {
      if (item.id === feedbackId) {
        return { ...item, isNew: false };
      }
      return item;
    });
    
    setFacultyFeedback(updatedFeedback);
    setNewFeedbackCount(prevCount => Math.max(0, prevCount - 1));
    
    // Update localStorage
    localStorage.setItem(`feedback_${user.username}`, JSON.stringify(updatedFeedback));
  };
  
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/home" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-book"></i> <span>Courses</span>
          </NavLink>
          <NavLink to="/feedback" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-comment"></i> 
            <span>Feedback</span>
            {newFeedbackCount > 0 && (
              <span className="nav-notification-badge">{newFeedbackCount}</span>
            )}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink to="contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <i className="fas fa-envelope"></i> <span>Contact</span>
          </NavLink>
            <NavLink 
                      to="/communitycenter" 
                      className={({ isActive }) => 
                        `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/communitycenter'] ? 'clicked' : ''}`
                      }
                      onClick={() => handleLinkClick('/communitycenter')}
                    >
                      <i className="fas fa-users"></i> <span>Community</span>
                    </NavLink>
                  
        </div>
        
        <div className="navbar-user">
          <ThemeToggle />
          <span>{studentInfo.name || 'Student'}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="dashboard-content">
        <div className="student-profile">
          <h2>Student Profile</h2>
          <div className="profile-info">
            <div className="profile-item">
              <span className="label">Name:</span>
              <span className="value">{studentInfo.name || 'Not Available'}</span>
            </div>
            <div className="profile-item">
              <span className="label">Course:</span>
              <span className="value">{studentInfo.courseFull || 'Not Available'}</span>
            </div>
            <div className="profile-item">
              <span className="label">Email:</span>
              <span className="value">{studentInfo.email || 'Not Available'}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h2>Progress Overview</h2>
          <div className="progress-cards">
            <div className="progress-card">
              <h3>Overall Progress</h3>
              <div className="circular-progress">
                <CircularProgressbar
                  value={studentInfo.progress?.overall || 0}
                  text={`${studentInfo.progress?.overall || 0}%`}
                  styles={buildStyles({
                    pathColor: `var(--primary-color)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#fff',
                  })}
                />
              </div>
            </div>
            <div className="progress-card">
              <h3>Assignments</h3>
              <div className="circular-progress">
                <CircularProgressbar
                  value={studentInfo.progress?.assignments || 0}
                  text={`${studentInfo.progress?.assignments || 0}%`}
                  styles={buildStyles({
                    pathColor: `var(--primary-color)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#fff',
                  })}
                />
              </div>
            </div>
            <div className="progress-card">
              <h3>Quizzes</h3>
              <div className="circular-progress">
                <CircularProgressbar
                  value={studentInfo.progress?.quizzes || 0}
                  text={`${studentInfo.progress?.quizzes || 0}%`}
                  styles={buildStyles({
                    pathColor: `var(--primary-color)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#fff',
                  })}
                />
              </div>
            </div>
            <div className="progress-card">
              <h3>Projects</h3>
              <div className="circular-progress">
                <CircularProgressbar
                  value={studentInfo.progress?.projects || 0}
                  text={`${studentInfo.progress?.projects || 0}%`}
                  styles={buildStyles({
                    pathColor: `var(--primary-color)`,
                    textColor: '#000',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#fff',
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <h2>Performance Analytics</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Quiz Scores Timeline</h3>
              <LineChart
                width={400}
                height={200}
                data={studentInfo.quizScores}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4361ee"
                  strokeWidth={2}
                />
              </LineChart>
            </div>

            <div className="chart-card">
              <h3>Test Scores Distribution</h3>
              <BarChart
                width={400}
                height={200}
                data={studentInfo.testScores}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4361ee" />
              </BarChart>
            </div>

            <div className="chart-card">
              <h3>Activity Distribution</h3>
              <PieChart width={400} height={200}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={[
                    { name: 'Assignments', value: studentInfo.progress?.assignments || 0 },
                    { name: 'Quizzes', value: studentInfo.progress?.quizzes || 0 },
                    { name: 'Projects', value: studentInfo.progress?.projects || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#4361ee" />
                  <Cell fill="#3f37c9" />
                  <Cell fill="#4cc9f0" />
                </Pie>
              </PieChart>
            </div>

            <div className="chart-card">
              <h3>Attendance Trend</h3>
              <AreaChart
                width={400}
                height={200}
                data={[
                  { name: 'Jan', attendance: 90 },
                  { name: 'Feb', attendance: 95 },
                  { name: 'Mar', attendance: 93 },
                  { name: 'Apr', attendance: 92 },
                  { name: 'May', attendance: 94 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4361ee"
                  fill="#8884d8"
                />
              </AreaChart>
            </div>
          </div>
        </div>
        
        {/* Faculty Feedback Section */}
        {facultyFeedback.length > 0 && (
          <div className="faculty-feedback-section">
            <h2>
              Faculty Feedback
              {newFeedbackCount > 0 && (
                <span className="feedback-notification-badge">{newFeedbackCount}</span>
              )}
            </h2>
            
            {/* Radar Chart for Faculty Assessment */}
            <div className="feedback-chart-container">
              <div className="chart-card radar-chart">
                <h3>Faculty Assessment</h3>
                <RadarChart 
                  outerRadius={90} 
                  width={400} 
                  height={250} 
                  data={facultyFeedback.map(item => ({
                    subject: item.title,
                    A: item.percentage,
                    fullMark: 100
                  }))}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name="Performance" 
                    dataKey="A" 
                    stroke="#4361ee" 
                    fill="#4361ee" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </div>
              
              <div className="feedback-details">
                {facultyFeedback.map((feedback) => (
                  <div 
                    key={feedback.id} 
                    className={`feedback-card ${feedback.isNew ? 'new-feedback' : ''}`}
                    onClick={() => feedback.isNew && markFeedbackAsRead(feedback.id)}
                  >
                    {feedback.isNew && (
                      <div className="new-feedback-indicator">
                        <span>New</span>
                      </div>
                    )}
                    <div className="feedback-header">
                      <h3>{feedback.title}</h3>
                      <div className="feedback-score">
                        <span>{feedback.points}</span>
                        <small>points</small>
                      </div>
                    </div>
                    <div className="feedback-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${feedback.percentage}%` }}
                      >
                        <span>{feedback.percentage}%</span>
                      </div>
                    </div>
                    <p className="feedback-text">{feedback.feedback}</p>
                    <div className="feedback-date">
                      {new Date(feedback.date_created).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quiz Scores Section */}
        <div className="scores-section">
          <h2>Quiz Scores</h2>
          <div className="scores-grid">
            {studentInfo.quizScores?.map((quiz, index) => (
              <div key={index} className="score-card">
                <h3>{quiz.title}</h3>
                <div className="score-badge">
                  <span className="score-value">{quiz.score}%</span>
                  <span className="score-date">{new Date(quiz.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Scores Section */}
        <div className="scores-section">
          <h2>Test Scores</h2>
          <div className="scores-grid">
            {studentInfo.testScores?.map((test, index) => (
              <div key={index} className="score-card">
                <h3>{test.title}</h3>
                <div className="score-badge">
                  <span className="score-value">{test.score}%</span>
                  <span className="score-date">{new Date(test.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="attendance-section">
          <h2>Class Attendance</h2>
          <div className="attendance-info">
            <div className="attendance-card">
              <h3>Total Classes</h3>
              <span className="attendance-value">{studentInfo.attendance?.totalClasses || 0}</span>
            </div>
            <div className="attendance-card">
              <h3>Attended</h3>
              <span className="attendance-value">{studentInfo.attendance?.attended || 0}</span>
            </div>
            <div className="attendance-card">
              <h3>Percentage</h3>
              <span className="attendance-value">{studentInfo.attendance?.percentage || 0}%</span>
            </div>
          </div>
        </div>

        {/* Fee Management Section */}
        <FeeManagement studentId={user?.username} />

        {/* Login Statistics Section */}
        <div className="login-stats-section">
          <h2>Login Statistics</h2>
          <div className="login-stats">
            <div className="stat-item">
              <span className="stat-label">Total Logins</span>
              <span className="stat-value">{studentInfo.loginStats?.totalLogins || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Daily</span>
              <span className="stat-value">{studentInfo.loginStats?.averageDaily || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Login</span>
              <span className="stat-value">{new Date(studentInfo.loginStats?.lastLogin).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;