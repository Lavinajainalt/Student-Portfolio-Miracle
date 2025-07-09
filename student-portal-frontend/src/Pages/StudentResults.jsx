import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './StudentResults.css';

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

export default function StudentResults() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    if (user?.role === 'student') {
      fetchTestResults();
      fetchSubjects();
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

  const handleFilterChange = () => {
    const filters = {
      subjectId: selectedSubject,
      topicId: selectedTopic
    };
    fetchTestResults(filters);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (user?.role !== 'student') {
    return <div className="unauthorized">Only students can access this page.</div>;
  }

  return (
    <div className="student-results-container">
      <h2>My Test Results</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filters-section">
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

        <button 
          className="apply-filters-btn" 
          onClick={handleFilterChange}
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="results-table-container">
          {testResults.length > 0 ? (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date Taken</th>
                </tr>
              </thead>
              <tbody>
                {testResults.map(result => (
                  <tr key={result.id}>
                    <td>{result.subject_name}</td>
                    <td>{result.topic_name}</td>
                    <td>{result.score}/{result.total_questions}</td>
                    <td>{parseFloat(result.percentage).toFixed(2)}%</td>
                    <td>{formatDate(result.date_taken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">No test results found.</div>
          )}
        </div>
      )}
    </div>
  );
}