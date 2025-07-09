import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import './welcomePage.css';
import ThemeToggleWrapper from '../components/ThemeToggleWrapper';

function WelcomePage() {
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  // Content for welcome slides
  const welcomeSlides = [
    {
      title: "Welcome to Miracle IT Career Academy",
      subtitle: "Your gateway to IT excellence",
      icon: "🚀",
      color: "var(--primary)"
    },
    {
      title: "Personalized Learning Experience",
      subtitle: "Access courses tailored to your career goals",
      icon: "📚",
      color: "var(--secondary)"
    },
    {
      title: "Industry-Leading Certification",
      subtitle: "Prepare for in-demand IT certifications",
      icon: "🏆",
      color: "var(--accent)"
    }
  ];

  useEffect(() => {
    // Show loader for 4 seconds
    const loaderTimer = setTimeout(() => {
      setLoading(false);
      setShowWelcome(true);
    }, 4000);
    
    return () => clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    // Auto-advance slides
    if (showWelcome && activeSlide < welcomeSlides.length - 1) {
      const slideTimer = setTimeout(() => {
        setActiveSlide(prev => prev + 1);
      }, 3000);
      
      return () => clearTimeout(slideTimer);
    }
  }, [showWelcome, activeSlide, welcomeSlides.length]);

  const handleContinue = () => {
    setShowWelcome(false);
    setTimeout(() => navigate('/select-role'), 500);
  };

  const handleSkip = () => {
    handleContinue();
  };

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  if (loading) return <Loader />;

  return (
    <div className={`welcome-page ${showWelcome ? 'show' : 'hide'}`}>
      <ThemeToggleWrapper />
      <div className="welcome-background">
        <div className="animated-gradient"></div>
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>
      
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="academy-logo">
            <span className="logo-letter">M</span>
          </div>
          <h2 className="academy-name">Miracle IT Career Academy</h2>
        </div>
        
        <div className="welcome-slider">
          {welcomeSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`welcome-slide ${index === activeSlide ? 'active' : ''}`}
              style={{
                '--slide-color': slide.color,
                '--slide-index': index,
                '--active-index': activeSlide
              }}
            >
              <div className="slide-icon" style={{ backgroundColor: slide.color }}>
                <span>{slide.icon}</span>
              </div>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          ))}
        </div>
        
        <div className="slide-indicators">
          {welcomeSlides.map((_, index) => (
            <button 
              key={index} 
              className={`slide-indicator ${index === activeSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            ></button>
          ))}
        </div>
        
        <div className="welcome-actions">
          {activeSlide < welcomeSlides.length - 1 ? (
            <>
              <button className="action-button skip-button" onClick={handleSkip}>
                Skip
              </button>
              <button 
                className="action-button next-button" 
                onClick={() => setActiveSlide(prev => prev + 1)}
              >
                Next
              </button>
            </>
          ) : (
            <button className="action-button continue-button" onClick={handleContinue}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
