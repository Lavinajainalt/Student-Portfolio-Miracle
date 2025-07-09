import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import projectService from '../Services/projectService';
import './Test.css';

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

export default function Test() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectSubmitted, setProjectSubmitted] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const filtered = topics.filter(topic => topic.subject === selectedSubject);
      setFilteredTopics(filtered);
      setSelectedTopic(null);
      setQuestions([]);
    } else {
      setFilteredTopics([]);
    }
  }, [selectedSubject, topics]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/subjects/`, getAuthConfig());
      setSubjects(response.data);
    } catch (error) {
      setError('Failed to fetch subjects. Please try again.');
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/courses/topics/`, getAuthConfig());
      setTopics(response.data);
    } catch (error) {
      setError('Failed to fetch topics. Please try again.');
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (topicId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/courses/questions/${topicId}/`, getAuthConfig());
      setQuestions(response.data);
      setSelectedAnswers({});
      setShowResult(false);
      setScore(0);
      setExplanation(null);
      setCurrentQuestionIndex(0);
    } catch (error) {
      setError('Failed to fetch questions. Please try again.');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${BASE_URL}/courses/submit-test/`, 
        {
          answers: questions.map(question => ({
            question_id: question.id,
            selected_answer: selectedAnswers[question.id]
          }))
        },
        getAuthConfig()
      );
      
      const { correct_answers, total_questions } = response.data;
      setScore(correct_answers);
      setShowResult(true);
      // Get explanation for the current question
      if (questions[currentQuestionIndex]?.explanation) {
        setExplanation(questions[currentQuestionIndex].explanation);
      }
    } catch (error) {
      setError('Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubjectChange = (subjectId) => {
    setSelectedSubject(parseInt(subjectId));
    setSelectedTopic(null);
    setQuestions([]);
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(parseInt(topicId));
    fetchQuestions(topicId);
  };
  
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription || !projectLink) {
      setError('Please fill all project fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create project data with actual student information
      const projectData = {
        title: projectTitle,
        description: projectDescription,
        project_link: projectLink,
        student_id: user?.id,
        student_name: user?.username || user?.first_name + ' ' + user?.last_name
      };
      
      // Use the project service to submit the project
      const result = await projectService.submitProject(projectData);
      
      if (result.success) {
        setProjectSubmitted(true);
        setProjectTitle('');
        setProjectDescription('');
        setProjectLink('');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError(`Failed to submit project: ${error.message}`);
      console.error('Error submitting project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-container">
      <h2>Course Test</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          Loading...
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="subject-topic-selection">
            <div className="subject-section">
              <h3>Select a Subject</h3>
              <div className="subject-list">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    className={`subject-btn ${selectedSubject === subject.id ? 'selected' : ''}`}
                    onClick={() => handleSubjectChange(subject.id)}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedSubject && (
              <div className="topics-section">
                <h3>Select a Topic</h3>
                <div className="topics-list">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map(topic => (
                      <button
                        key={topic.id}
                        className={`topic-btn ${selectedTopic === topic.id ? 'selected' : ''}`}
                        onClick={() => handleTopicChange(topic.id)}
                      >
                        {topic.name}
                      </button>
                    ))
                  ) : (
                    <p>No topics available for this subject</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedTopic && questions.length > 0 && !showResult && (
            <div className="questions-section">
              <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
              <div className="question-card">
                <h4>{questions[currentQuestionIndex].question_text}</h4>
                {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                  <div 
                    key={key}
                    className="option-label" 
                    onClick={() => handleAnswer(questions[currentQuestionIndex].id, value)}
                  >
                    <div className={`radio-container ${selectedAnswers[questions[currentQuestionIndex].id] === value ? 'checked' : ''}`}>
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              <div className="navigation-buttons">
                <button 
                  onClick={handlePrevious} 
                  disabled={currentQuestionIndex === 0}
                  className="nav-btn"
                >
                  Previous
                </button>
                <button 
                  onClick={handleNext}
                  className="nav-btn"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {showResult && (
            <div className="result-section">
              <h3>Result</h3>
              <p>Your Score: {score}/{questions.length}</p>
              {explanation && (
                <div className="explanation">
                  <h4>Explanation:</h4>
                  <p>{explanation}</p>
                </div>
              )}
              <button 
                onClick={() => {
                  setShowResult(false);
                  setSelectedTopic(null);
                  setQuestions([]);
                  setSelectedAnswers({});
                }}
                className="nav-btn"
              >
                Try Another Topic
              </button>
            </div>
          )}
          
          {/* Project Sharing Section */}
          <div className="project-section">
            <h3>Share Your Project</h3>
            {projectSubmitted ? (
              <div className="success-message">
                Your project has been submitted successfully!
                <button 
                  className="submit-new-btn" 
                  onClick={() => setProjectSubmitted(false)}
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleProjectSubmit} className="project-form">
                {error && error.includes('Failed to submit project') && (
                  <div className="error-message project-error">
                    {error}
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="project-title"></label>
                  <input
                    id="project-title"
                    type="text"
                    placeholder="Enter your project title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project-description"></label>
                  <textarea
                    id="project-description"
                    placeholder="Describe your project in detail"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="project-link"></label>
                  <input
                    id="project-link"
                    type="url"
                    placeholder="GitHub, CodePen, or other project URL"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    required
                  />
                  <small className="form-hint">Please provide a valid URL including http:// or https://</small>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Project'}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}