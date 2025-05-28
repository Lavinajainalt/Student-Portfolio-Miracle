import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
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
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [explanation, setExplanation] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

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

  const getCorrectAnswerKey = (options, answer) => {
    const entries = Object.entries(options);
    for (let [key, value] of entries) {
      if (value === answer) {
        return key;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!Object.values(selectedAnswers).every(answer => answer !== null)) {
      setError('Please select an answer for all questions before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${BASE_URL}/courses/submit-answers/`, 
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
      setExplanation(questions[0].explanation);
    } catch (error) {
      setError('Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', error);
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
          <div className="topics-section">
            <h3>Select a Topic</h3>
            <div className="topics-list">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  className={`topic-btn ${selectedTopic === topic.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedTopic(topic.id); fetchQuestions(topic.id); }}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>

          {selectedTopic && (
            <div className="questions-section">
              <h3>Questions</h3>
              {questions.map(question => (
                <div key={question.id} className="question-card">
                  <h4>{question.question_text}</h4>
                  {Object.entries(question.options).map(([key, value]) => (
                    <div className="option-label" onClick={() => handleAnswer(question.id, value)}>
                      <div className={`radio-container ${selectedAnswers[question.id] === value ? 'checked' : ''}`}>
                      </div>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="action-buttons">
                <button onClick={handleSubmit} disabled={!Object.values(selectedAnswers).every(answer => answer !== null) || loading}>
                  {loading ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>

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
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
