import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Dashboard/StudentNavbar.css';
import './Feedback.css';
import logoimage from '../Images/logo.png';
import ThemeToggle from '../components/ThemeToggle';
import apiService from '../Services/api';
import projectService from '../Services/projectService';

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

export default function Feedback() {
  const { user, logout } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [clickedLinks, setClickedLinks] = useState({});
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  // Feedback form state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    student_id: '',
    student_name: '',
    title: 'Overall Progress',
    points: 0,
    percentage: 0,
    feedback: ''
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);
  const [studentProjects, setStudentProjects] = useState([]);

  // Available feedback categories
  const feedbackCategories = [
    'Overall Progress',
    'Assignments',
    'Quizzes',
    'Projects',
    'Class Participation',
    'Attendance',
    'Midterm Exam',
    'Final Exam'
  ];

  useEffect(() => {
    // Add scroll effect for navbar
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'faculty') {
      fetchTestResults();
      fetchSubjects();
      fetchStudents();
      fetchStudentProjects();
      
      // Initialize feedback history if not already set
      if (!window.feedbackHistory) {
        window.feedbackHistory = [];
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedSubject) {
      fetchTopics(selectedSubject);
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
  }, [selectedSubject]);

  const fetchTestResults = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${BASE_URL}/courses/test-results/`;
      const params = new URLSearchParams();
      
      if (filters.subjectId) params.append('subject_id', filters.subjectId);
      if (filters.topicId) params.append('topic_id', filters.topicId);
      if (filters.studentId) params.append('student_id', filters.studentId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, getAuthConfig());
      setTestResults(response.data);
    } catch (error) {
      setError('Failed to fetch test results. Please try again.');
      console.error('Error fetching test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/subjects/`, getAuthConfig());
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTopics = async (subjectId) => {
    try {
      const response = await axios.get(`${BASE_URL}/courses/topics/`, getAuthConfig());
      const filteredTopics = response.data.filter(topic => topic.subject === parseInt(subjectId));
      setTopics(filteredTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/?role=student`, getAuthConfig());
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Mock data for development
      setStudents([
        { id: 'ST22001', first_name: 'Rahul', last_name: 'Sharma' },
        { id: 'ST22002', first_name: 'Priya', last_name: 'Patel' },
        { id: 'ST22003', first_name: 'Amit', last_name: 'Singh' },
        { id: 'ST22004', first_name: 'Neha', last_name: 'Gupta' },
        { id: 'ST22005', first_name: 'Vikram', last_name: 'Reddy' }
      ]);
    }
  };
  
  const fetchStudentProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await projectService.getProjects();
      
      if (result.success && Array.isArray(result.data)) {
        setStudentProjects(result.data);
      } else {
        console.warn('Invalid project data format received:', result.data);
        setStudentProjects([]);
        if (!result.success) {
          setError(`Failed to load projects: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error fetching student projects:', error);
      setError('Failed to load student projects. Please try again later.');
      setStudentProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    const filters = {
      subjectId: selectedSubject,
      topicId: selectedTopic,
      studentId: selectedStudent
    };
    fetchTestResults(filters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const openFeedbackForm = (student) => {
    setFeedbackData({
      ...feedbackData,
      student_id: student.id,
      student_name: `${student.first_name} ${student.last_name}`
    });
    setShowFeedbackForm(true);
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'points') {
      // Allow empty string for better UX when typing
      if (value === '') {
        setFeedbackData({
          ...feedbackData,
          points: '',
          percentage: 0
        });
        return;
      }
      
      // Ensure points are between 0 and 100
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        const points = Math.min(Math.max(numValue, 0), 100);
        setFeedbackData({
          ...feedbackData,
          points,
          percentage: points // Points and percentage are the same in this case
        });
      }
    } else {
      setFeedbackData({
        ...feedbackData,
        [name]: value
      });
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Ensure points is a number before submission
      const pointsValue = parseInt(feedbackData.points) || 0;
      
      // Add notification flag to the feedback data
      const feedbackWithNotification = {
        ...feedbackData,
        points: pointsValue,
        percentage: pointsValue,
        isNew: true,
        date_created: new Date().toISOString()
      };
      
      const result = await apiService.submitStudentFeedback(feedbackWithNotification);
      
      if (result.success) {
        // Update the recent feedback history
        const updatedFeedbackHistory = [...(window.feedbackHistory || [])];
        updatedFeedbackHistory.unshift({
          student_name: feedbackData.student_name,
          title: feedbackData.title,
          points: pointsValue,
          percentage: pointsValue,
          date: new Date().toLocaleDateString()
        });
        window.feedbackHistory = updatedFeedbackHistory;
        
        // Show success message in modal
        setShowFeedbackForm(false);
        setFeedbackSuccess(`Feedback sent to ${feedbackData.student_name} successfully!`);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFeedbackSuccess(null);
          setFeedbackData({
            student_id: '',
            student_name: '',
            title: 'Overall Progress',
            points: 0,
            percentage: 0,
            feedback: ''
          });
        }, 3000);
      } else {
        setError(result.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('An error occurred while submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'faculty') {
    return <div className="unauthorized">Only faculty can access this page.</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navbar from HomeFaculty.jsx */}
      <nav className={`navbar animate__animated animate__fadeInDown ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <img src={logoimage} alt="Logo" className="navbar-logo" />
          <h2 className="animate__animated animate__pulse animate__infinite animate__slower">Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink 
            to="/homefaculty" 
            end 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/homefaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/homefaculty')}
          >
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/feedback" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/feedback'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/feedback')}
          >
            <i className="fas fa-comment"></i> <span>Feedback</span>
          </NavLink>
          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/report'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/report')}
          >
            <i className="fas fa-file-alt"></i> <span>Report</span>
          </NavLink>
          <NavLink 
            to="/aboutfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/aboutfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/aboutfaculty')}
          >
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink 
            to="/contactfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/contactfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/contactfaculty')}
          >
            <i className="fas fa-envelope"></i> <span>Contact</span>
          </NavLink>
          <NavLink 
            to="/communityfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/communitycenter'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/communityfaculty')}
          >
            <i className="fas fa-users"></i> <span>Community</span>
          </NavLink>
        </div>
        
        <div className="navbar-user">
          <ThemeToggle />
          <span className="animate__animated animate__fadeIn">{user?.username || 'Faculty'}</span>
          <button className="logout-btn animate__animated animate__fadeIn" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="feedback-container">
        <h2>Student Feedback & Assessment</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {feedbackSuccess && (
          <div className="success-message">
            {feedbackSuccess}
          </div>
        )}

        {/* Student Selection for Feedback */}
        <div className="student-feedback-section">
          <h3>Provide Student Feedback</h3>
          <p>Select a student to provide feedback and assessment points:</p>
          
          <div className="student-list">
            {students.map(student => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <h4>{student.first_name} {student.last_name}</h4>
                  <p>ID: {student.id}</p>
                </div>
                <button 
                  className="feedback-btn"
                  onClick={() => openFeedbackForm(student)}
                >
                  Give Feedback
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="feedback-modal">
            <div className="feedback-modal-content">
              <span className="close-btn" onClick={() => setShowFeedbackForm(false)}>&times;</span>
              <h3>Provide Feedback for {feedbackData.student_name}</h3>
              
              <form onSubmit={submitFeedback}>
                <div className="form-group">
                  <select 
                    name="title" 
                    value={feedbackData.title}
                    onChange={handleFeedbackChange}
                    required
                  >
                    {feedbackCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <input 
                    type="number" 
                    name="points"
                    min="0"
                    max="100"
                    placeholder="Points (0-100)"
                    value={feedbackData.points}
                    onChange={handleFeedbackChange}
                    onFocus={(e) => e.target.value === '0' ? e.target.value = '' : null}
                    onBlur={(e) => e.target.value === '' ? e.target.value = '0' : null}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <textarea 
                    name="feedback"
                    placeholder="Enter your feedback here..."
                    value={feedbackData.feedback}
                    onChange={handleFeedbackChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowFeedbackForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Test Results Section */}
        <div className="test-results-section">
          <h3>Student Test Results</h3>
          
          <div className="filter-controls">
            <div className="filter-group">
              <label>Subject:</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Topic:</label>
              <select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject}
              >
                <option value="">All Topics</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Student:</label>
              <select 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">All Students</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="filter-btn" 
              onClick={handleFilterChange}
            >
              Apply Filters
            </button>
          </div>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="test-results-container">
              <table className="test-results-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.length > 0 ? (
                    testResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.student_name || 'Unknown'}</td>
                        <td>{result.subject_name || 'Unknown'}</td>
                        <td>{result.topic_name || 'Unknown'}</td>
                        <td>{result.score}/{result.total_questions} ({Math.round((result.score/result.total_questions)*100)}%)</td>
                        <td>{formatDate(result.date_taken)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-results">No test results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Student Projects Section */}
        <div className="student-projects-section">
          <h3>Student Projects</h3>
          
          <div className="section-actions">
            <button 
              className="refresh-btn" 
              onClick={fetchStudentProjects} 
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Projects'}
            </button>
          </div>
          
          {error && error.includes('Failed to load projects') && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : (
            <div className="projects-container">
              {studentProjects.length > 0 ? (
                studentProjects.map((project, index) => (
                  <div key={index} className="project-card">
                    <div className="project-header">
                      <h4>{project.title}</h4>
                      <span className="project-date">{formatDate(project.date_submitted)}</span>
                    </div>
                    <div className="project-student">
                      <strong>Student:</strong> {project.student_name}
                    </div>
                    <p className="project-description">{project.description}</p>
                    <div className="project-actions">
                      <a 
                        href={project.project_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="project-link"
                      >
                        View Project
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No student projects submitted yet</div>
              )}
            </div>
          )}
        </div>

        {/* Recent Feedback Section */}
        <div className="recent-feedback-section">
          <h3>Recent Feedback Given</h3>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="feedback-history-container">
              <table className="feedback-history-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Category</th>
                    <th>Points</th>
                    <th>Percentage</th>
                    <th>Date Given</th>
                  </tr>
                </thead>
                <tbody>
                  {window.feedbackHistory && window.feedbackHistory.length > 0 ? (
                    window.feedbackHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.student_name}</td>
                        <td>{item.title}</td>
                        <td>{item.points}</td>
                        <td>{item.percentage}%</td>
                        <td>{item.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-results">No recent feedback given</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}