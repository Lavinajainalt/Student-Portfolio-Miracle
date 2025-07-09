import React, { useState, useEffect } from 'react';
import People1 from '../Images/Person1.webp'
import People2 from '../Images/People2.png' 
import People3 from '../Images/People3.jpeg'
import Phone from '../Images/phone.png'
import './Contact1.css'

export default function Contact1() {
  const [activeScreen, setActiveScreen] = useState(0);
  
  // Animation to cycle through screens
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 5000); // Change screen every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="contact-container">
      <div className="contact-split-layout">
        {/* Left Side - Contact Heading */}
        <div className="contact-heading-section">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">We'd love to hear from you. Here's how you can reach us...</p>
          
          <div className="contact-info">
            <div className="contact-method">
              <span className="contact-icon">📞</span>
              <p>0 9179001399</p>
            </div>
            <div className="contact-method">
              <span className="contact-icon">📧</span>
              <p>support@studentportal.com</p>
            </div>
            <div className="contact-method">
              <span className="contact-icon">📍</span>
              <p>Zone 2 ,Miracle IT Career Academy,Akriti Complex,Maharan Pratap Nagar Bhopal,Madhya Pradesh</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Phone Animation */}
        <div className="phone-animation-section">
          {/* Phone in the center */}
          <div className="center-phone">
            <img src={Phone} alt="Phone" className="phone-image" />
            
            {/* Phone Screen Content - Animated */}
            <div className="phone-screen">
              {/* Screen 1: 24/7 Support with People */}
              <div className={`phone-screen-content ${activeScreen === 0 ? 'active' : ''}`}>
                <h3>24/7</h3>
                <p>Customer Support</p>
                
                <div className="phone-people">
                  <img src={People1} alt="Support Team" className="phone-people-image" />
                  <img src={People2} alt="Support Team" className="phone-people-image" />
                  <img src={People3} alt="Support Team" className="phone-people-image" />
                </div>
                
                <div className="support-icons">
                  <span className="support-icon">📞</span>
                  <span className="support-icon">💬</span>
                  <span className="support-icon">📧</span>
                </div>
                <p className="always-available">Always Available</p>
              </div>
              
              {/* Screen 2: Consultation */}
              <div className={`phone-screen-content ${activeScreen === 1 ? 'active' : ''}`}>
                <h3>Consultation</h3>
                <div className="consultation-icon">🤝</div>
                <div className="consultation-info">
                  <p>Book a session with our experts</p>
                  <div className="consultation-options">
                    <div className="consultation-option">
                      <span>📚</span>
                      <p>Academic</p>
                    </div>
                    <div className="consultation-option">
                      <span>💻</span>
                      <p>Technical</p>
                    </div>
                  </div>
                  <button className="phone-button">Schedule</button>
                </div>
              </div>
              
              {/* Screen 3: Contact Form */}
              <div className={`phone-screen-content ${activeScreen === 2 ? 'active' : ''}`}>
                <h3>Contact Form</h3>
                <div className="phone-form">
                  <div className="phone-form-field">
                    <label>Name</label>
                    <div className="phone-input"></div>
                  </div>
                  <div className="phone-form-field">
                    <label>Email</label>
                    <div className="phone-input"></div>
                  </div>
                  <div className="phone-form-field">
                    <label>Message</label>
                    <div className="phone-textarea"></div>
                  </div>
                  <button className="phone-button">Send</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Screen indicators */}
          <div className="screen-indicators">
            <div className={`indicator ${activeScreen === 0 ? 'active' : ''}`}></div>
            <div className={`indicator ${activeScreen === 1 ? 'active' : ''}`}></div>
            <div className={`indicator ${activeScreen === 2 ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>
    </div>
  )
}