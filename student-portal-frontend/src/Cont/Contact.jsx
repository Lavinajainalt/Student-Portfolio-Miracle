import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Contact.css';


const Contact = () => {
  const [activeTab, setActiveTab] = useState('message'); // Track active tab
  const [callNumber, setCallNumber] = useState('1-800-555-0123'); // Default call number
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const API_KEY = 'AIzaSyBkaDEV1dLpOMZtoY3MQqX3EkDBrVx14pY';
  
  // Meeting booking state
  const [meetingData, setMeetingData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    duration: '30',
    purpose: '',
    department: '',
    notes: ''
  });
  
  const [meetingStatus, setMeetingStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: '',
    priority: 'normal' // Default priority
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleMeetingChange = (e) => {
    const { name, value } = e.target;
    setMeetingData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
  };
  
  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: chatInput };
    const userInputText = chatInput;
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      // Call Google Gemini API using the SDK
      const result = await model.generateContent(userInputText);
      const response = await result.response;
      const aiResponse = response.text();
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { role: 'system', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to mock responses if API fails
      const responses = [
        "I'm here to help! What questions do you have about our student services?",
        "That's a great question. Let me provide some information about that.",
        "I understand your concern. Here's what you can do in this situation.",
        "Thank you for reaching out. Our team is available to assist you further if needed.",
        "I'd be happy to help you with that. Could you provide more details?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: randomResponse + " (Note: Using fallback response due to API error)"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      // Get auth token from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if token exists
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await axios.post('http://localhost:8000/api/contact/submit/', formData, { headers });

      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: response.data.message }
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        department: '',
        priority: 'normal'
      });

      // Reset form status after 5 seconds
      setTimeout(() => {
        setStatus({
          submitted: false,
          submitting: false,
          info: { error: false, msg: null }
        });
      }, 5000);

    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        info: {
          error: true,
          msg: error.response ? error.response.data.message || 'Authentication required. Please log in.' : 'Something went wrong. Please try again later.'
        }
      });
    }
  };
  
  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    setMeetingStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      // Get auth token from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header if token exists
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      
      console.log('Sending meeting data:', meetingData);
      console.log('With headers:', headers);
      
      // Send meeting data to the backend API with auth headers
      const response = await axios({
        method: 'post',
        url: 'http://localhost:8000/api/contact/meetings/book/',
        data: meetingData,
        headers: headers
      });
      
      console.log('Meeting booking response:', response.data);
      
      setMeetingStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: response.data.message || 'Meeting scheduled successfully!' }
      });

      // Clear form
      setMeetingData({
        name: '',
        email: '',
        date: '',
        time: '',
        duration: '30',
        purpose: '',
        department: '',
        notes: ''
      });

      // Reset form status after 5 seconds
      setTimeout(() => {
        setMeetingStatus({
          submitted: false,
          submitting: false,
          info: { error: false, msg: null }
        });
      }, 5000);

    } catch (error) {
      console.error('Meeting booking error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      setMeetingStatus({
        submitted: false,
        submitting: false,
        info: {
          error: true,
          msg: error.response ? error.response.data.message || error.response.data.detail || 'Authentication required. Please log in.' : 'Unable to schedule meeting. Please try again later.'
        }
      });
    }
  };

  return (
    <div className="feedback-portal">
      <div className="portal-background">
        <div className="portal-shape shape-1"></div>
        <div className="portal-shape shape-2"></div>
        <div className="portal-shape shape-3"></div>
      </div>
      
      <div className="portal-content">
        <div className="portal-header">
          <div className="portal-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Student<span className="logo-highlight">Connect</span></span>
          </div>
          <h1 className="portal-title">We Value Your Feedback</h1>
          <p className="portal-subtitle">Your insights help us improve our services for all students</p>
        </div>
        
        <div className="communication-container">
          <div className="communication-tabs">
            <button 
              className={`comm-tab ${activeTab === 'message' ? 'active' : ''}`}
              onClick={() => handleTabChange('message')}
            >
              <span className="tab-icon">✉️</span>
              <span className="tab-text">Message</span>
            </button>
            <button 
              className={`comm-tab ${activeTab === 'call' ? 'active' : ''}`}
              onClick={() => handleTabChange('call')}
            >
              <span className="tab-icon">📞</span>
              <span className="tab-text">Call</span>
            </button>
            <button 
              className={`comm-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => handleTabChange('chat')}
            >
              <span className="tab-icon">💬</span>
              <span className="tab-text">Chat</span>
            </button>
            <button 
              className={`comm-tab ${activeTab === 'meet' ? 'active' : ''}`}
              onClick={() => handleTabChange('meet')}
            >
              <span className="tab-icon">🗓️</span>
              <span className="tab-text">Meet</span>
            </button>
          </div>
          
          <div className="communication-content">
            {activeTab === 'message' && (
              <div className="message-box">
                <div className="message-header">
                  <h2 className="message-heading">Send a Message</h2>
                  <div className="message-priority">
                    <span className="priority-label">Priority:</span>
                    <select 
                      className="priority-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                {status.info.msg && (
                  <div className={`message-status ${status.info.error ? 'status-error' : 'status-success'}`}>
                    <span className="status-icon">{status.info.error ? '❌' : '✅'}</span>
                    <span className="status-text">{status.info.msg}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="message-form">
                  <div className="form-columns">
                    <div className="form-column">
                      <div className="input-wrapper">
                        <label htmlFor="name" className="input-name">Your Name</label>
                        <div className="input-container">
                          <span className="input-icon">👤</span>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="input-control"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="input-wrapper">
                        <label htmlFor="email" className="input-name">Email Address</label>
                        <div className="input-container">
                          <span className="input-icon">📧</span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="input-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-column">
                      <div className="input-wrapper">
                        <label htmlFor="subject" className="input-name">Subject</label>
                        <div className="input-container">
                          <span className="input-icon">📝</span>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What is this regarding?"
                            className="input-control"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="input-wrapper">
                        <label htmlFor="department" className="input-name">Department</label>
                        <div className="input-container">
                          <span className="input-icon">🏢</span>
                          <select 
                            className="input-control"
                            id="department"
                            name="department"
                            value={formData.department || ''}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select department</option>
                            <option value="academic">Academic Affairs</option>
                            <option value="technical">Technical Support</option>
                            <option value="financial">Financial Services</option>
                            <option value="student">Student Services</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="input-wrapper full-width">
                    <label htmlFor="message" className="input-name">Your Message</label>
                    <div className="input-container textarea-container">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Please provide details about your inquiry or feedback..."
                        className="input-textarea"
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <div className="action-options">
                      {/* Priority indicator based on selected priority */}
                      <div className="priority-indicator">
                        <span className={`priority-dot priority-${formData.priority}`}></span>
                        <span className="priority-text">
                          {formData.priority === 'urgent' ? 'Urgent Priority' : 
                           formData.priority === 'low' ? 'Low Priority' : 'Normal Priority'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="action-button"
                      disabled={status.submitting}
                    >
                      {status.submitting ? (
                        <>
                          <span className="button-loader"></span>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="button-icon">📤</span>
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'call' && (
              <>
                <div className="call-box">
                  <div className="call-header">
                    <h2 className="call-heading">Call Us</h2>
                  </div>
                  <div className="call-content">
                    <div className="call-number-display">
                      <span className="call-icon">📞</span>
                      <span className="call-number">{callNumber}</span>
                    </div>
                    <p className="call-instructions">
                      Our support team is available Monday through Friday, 8:00 AM to 6:00 PM.
                    </p>
                    <div className="department-numbers">
                      <h3>Department Direct Lines:</h3>
                      <ul className="number-list">
                        <li>
                          <span className="dept-name">Academic Affairs:</span>
                          <span className="dept-number">1-800-555-0124</span>
                        </li>
                        <li>
                          <span className="dept-name">Technical Support:</span>
                          <span className="dept-number">1-800-555-0125</span>
                        </li>
                        <li>
                          <span className="dept-name">Financial Services:</span>
                          <span className="dept-number">1-800-555-0126</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="contact-info">
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">⏱️</span>
                      <h3 className="info-card-title">Call Center Hours</h3>
                    </div>
                    <p className="info-card-text">Our call center is open Monday through Friday, 8:00 AM to 6:00 PM. Closed on weekends and holidays.</p>
                  </div>
                  
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">📧</span>
                      <h3 className="info-card-title">Email Support</h3>
                    </div>
                    <p className="info-card-text">Can't call? Email us at support@studentconnect.edu for assistance.</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'chat' && (
              <>
                <div className="chat-box">
                  <div className="chat-header">
                    <h2 className="chat-heading">Live Chat</h2>
                    <div className="chat-status">
                      <span className="status-dot online"></span>
                      <span className="status-text">AI Assistant Online</span>
                    </div>
                  </div>
                  <div className="chat-content">
                    <div className="chat-messages">
                      {chatMessages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`chat-message ${msg.role === 'user' ? 'user-message' : 'system-message'}`}
                        >
                          <div className="message-avatar">
                            {msg.role === 'user' ? '👤' : '🤖'}
                          </div>
                          <div className="message-bubble">
                            <div className="message-text">{msg.content}</div>
                            <div className="message-time">
                              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="chat-message system-message">
                          <div className="message-avatar">🤖</div>
                          <div className="message-bubble typing">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    
                    <form onSubmit={handleChatSubmit} className="chat-input-form">
                      <div className="chat-input-container">
                        <input
                          type="text"
                          className="chat-input"
                          placeholder="Type your message here..."
                          value={chatInput}
                          onChange={handleChatInputChange}
                        />
                        <button 
                          type="submit" 
                          className="chat-send-button"
                          disabled={isTyping || !chatInput.trim()}
                        >
                          <span className="send-icon">📤</span>
                        </button>
                      </div>
                      <div className="chat-powered-by">
                        Powered by Google Gemini AI
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="contact-info">
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">⏱️</span>
                      <h3 className="info-card-title">Chat Hours</h3>
                    </div>
                    <p className="info-card-text">Our AI assistant is available 24/7. Human support is available Monday through Friday, 9:00 AM to 5:00 PM.</p>
                  </div>
                  
                  <div className="contact-channels">
                    <h3 className="channels-title">Other Ways to Reach Us</h3>
                    <div className="channel-list">
                      <div className="channel-item">
                        <span className="channel-icon">📞</span>
                        <div className="channel-details">
                          <h4 className="channel-name">Phone</h4>
                          <p className="channel-value">(555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="channel-item">
                        <span className="channel-icon">🏢</span>
                        <div className="channel-details">
                          <h4 className="channel-name">Office</h4>
                          <p className="channel-value">Student Center, Room 204</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'meet' && (
              <>
                <div className="meet-box">
                  <div className="meet-header">
                    <h2 className="meet-heading">Schedule a Meeting</h2>
                    <div className="meet-subtitle">
                      <span className="meet-icon">📅</span>
                      <span className="meet-text">Book a time with our staff</span>
                    </div>
                  </div>
                  
                  {(meetingStatus.submitted || meetingStatus.info.msg) && (
                    <div className={`meeting-status ${meetingStatus.info.error ? 'status-error' : 'status-success'}`}>
                      <span className="status-icon">{meetingStatus.info.error ? '❌' : '✅'}</span>
                      <span className="status-text">{meetingStatus.info.msg || 'Meeting scheduled successfully!'}</span>
                    </div>
                  )}
                  
                  <div className="meet-content">
                    <form onSubmit={handleMeetingSubmit} className="meeting-form">
                      <div className="form-columns">
                        <div className="form-column">
                          <div className="input-wrapper">
                            <label htmlFor="meeting-name" className="input-name">Your Name</label>
                            <div className="input-container">
                              <span className="input-icon">👤</span>
                              <input
                                type="text"
                                id="meeting-name"
                                name="name"
                                value={meetingData.name}
                                onChange={handleMeetingChange}
                                placeholder="Enter your full name"
                                className="input-control"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="input-wrapper">
                            <label htmlFor="meeting-email" className="input-name">Email Address</label>
                            <div className="input-container">
                              <span className="input-icon">📧</span>
                              <input
                                type="email"
                                id="meeting-email"
                                name="email"
                                value={meetingData.email}
                                onChange={handleMeetingChange}
                                placeholder="your.email@example.com"
                                className="input-control"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-column">
                          <div className="input-wrapper">
                            <label htmlFor="meeting-date" className="input-name">Preferred Date</label>
                            <div className="input-container">
                              <span className="input-icon">📅</span>
                              <input
                                type="date"
                                id="meeting-date"
                                name="date"
                                value={meetingData.date}
                                onChange={handleMeetingChange}
                                className="input-control"
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="input-wrapper">
                            <label htmlFor="meeting-time" className="input-name">Preferred Time</label>
                            <div className="input-container">
                              <span className="input-icon">🕒</span>
                              <input
                                type="time"
                                id="meeting-time"
                                name="time"
                                value={meetingData.time}
                                onChange={handleMeetingChange}
                                className="input-control"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-columns">
                        <div className="form-column">
                          <div className="input-wrapper">
                            <label htmlFor="meeting-duration" className="input-name">Duration</label>
                            <div className="input-container">
                              <span className="input-icon">⏱️</span>
                              <select
                                id="meeting-duration"
                                name="duration"
                                value={meetingData.duration}
                                onChange={handleMeetingChange}
                                className="input-control"
                                required
                              >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-column">
                          <div className="input-wrapper">
                            <label htmlFor="meeting-department" className="input-name">Department</label>
                            <div className="input-container">
                              <span className="input-icon">🏢</span>
                              <select
                                id="meeting-department"
                                name="department"
                                value={meetingData.department}
                                onChange={handleMeetingChange}
                                className="input-control"
                                required
                              >
                                <option value="">Select department</option>
                                <option value="academic">Academic Affairs</option>
                                <option value="technical">Technical Support</option>
                                <option value="financial">Financial Services</option>
                                <option value="student">Student Services</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="input-wrapper">
                        <label htmlFor="meeting-purpose" className="input-name">Meeting Purpose</label>
                        <div className="input-container">
                          <span className="input-icon">🎯</span>
                          <input
                            type="text"
                            id="meeting-purpose"
                            name="purpose"
                            value={meetingData.purpose}
                            onChange={handleMeetingChange}
                            placeholder="Brief description of meeting purpose"
                            className="input-control"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="input-wrapper full-width">
                        <label htmlFor="meeting-notes" className="input-name">Additional Notes</label>
                        <div className="input-container textarea-container">
                          <textarea
                            id="meeting-notes"
                            name="notes"
                            value={meetingData.notes}
                            onChange={handleMeetingChange}
                            rows="3"
                            placeholder="Any additional information that would be helpful for the meeting..."
                            className="input-textarea"
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="form-actions">
                        <div className="action-options">
                          <div className="meeting-info">
                            <span className="info-icon">ℹ️</span>
                            <span className="info-text">
                              Meetings are subject to staff availability
                            </span>
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          className="action-button"
                          disabled={meetingStatus.submitting}
                        >
                          {meetingStatus.submitting ? (
                            <>
                              <span className="button-loader"></span>
                              <span>Scheduling...</span>
                            </>
                          ) : (
                            <>
                              <span className="button-icon">📅</span>
                              <span>Book Meeting</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    
                    <div className="meeting-info-cards">
                      <div className="info-card">
                        <div className="info-card-header">
                          <span className="info-card-icon">📝</span>
                          <h3 className="info-card-title">Confirmation</h3>
                        </div>
                        <p className="info-card-text">You'll receive an email confirmation with meeting details and a calendar invite.</p>
                      </div>
                      
                      <div className="info-card">
                        <div className="info-card-header">
                          <span className="info-card-icon">🔄</span>
                          <h3 className="info-card-title">Rescheduling</h3>
                        </div>
                        <p className="info-card-text">Need to reschedule? You can do so up to 24 hours before your meeting time.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="contact-info meet-contact-info">
                  <div className="info-card">
                    <div className="info-card-header">
                      <span className="info-card-icon">🏢</span>
                      <h3 className="info-card-title">Meeting Locations</h3>
                    </div>
                    <p className="info-card-text">Meetings are held in the Student Center (Room 204) or online via Zoom. Your confirmation email will include location details.</p>
                  </div>
                  
                  <div className="contact-channels">
                    <h3 className="channels-title">Need Immediate Assistance?</h3>
                    <div className="channel-list">
                      <div className="channel-item">
                        <span className="channel-icon">📞</span>
                        <div className="channel-details">
                          <h4 className="channel-name">Phone</h4>
                          <p className="channel-value">(555) 123-4567</p>
                        </div>
                      </div>
                      
                      <div className="channel-item">
                        <span className="channel-icon">📧</span>
                        <div className="channel-details">
                          <h4 className="channel-name">Email</h4>
                          <p className="channel-value">meetings@studentconnect.edu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'message' && (
              <div className="contact-info">
                <div className="info-card">
                  <div className="info-card-header">
                    <span className="info-card-icon">⏱️</span>
                    <h3 className="info-card-title">Response Time</h3>
                  </div>
                  <p className="info-card-text">We typically respond within 24-48 hours on business days.</p>
                </div>
                
                <div className="info-card">
                  <div className="info-card-header">
                    <span className="info-card-icon">🔔</span>
                    <h3 className="info-card-title">Notifications</h3>
                  </div>
                  <p className="info-card-text">You'll receive email notifications when we respond to your message.</p>
                </div>
                
                <div className="contact-channels">
                  <h3 className="channels-title">Other Ways to Reach Us</h3>
                  <div className="channel-list">
                    <div className="channel-item">
                      <span className="channel-icon">📞</span>
                      <div className="channel-details">
                        <h4 className="channel-name">Phone</h4>
                        <p className="channel-value">9179001399</p>
                      </div>
                    </div>
                    
                    <div className="channel-item">
                      <span className="channel-icon">🏢</span>
                      <div className="channel-details">
                        <h4 className="channel-name">Office</h4>
                        <p className="channel-value">Zone 2 ,Miracle IT Career Academy,Akriti Complex,Maharan Pratap Nagar Bhopal,Madhya Pradesh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;