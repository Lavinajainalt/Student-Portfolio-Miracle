import React, { useState, useEffect } from 'react';
import './Home3.css';
import { motion } from 'framer-motion';
import LaptopImage from '../Images/laptop.png';

const featureCards = [
  {
    title: "Courses",
    description: "Explore courses to succeed",
    icon: "fas fa-book",
    bg: "#d1e8ff"
  },
  {
    title: "Schedule",
    description: "Check academic timelines",
    icon: "fas fa-calendar-alt",
    bg: "#ffe6cc"
  },
  {
    title: "Progress",
    description: "Track achievements and growth",
    icon: "fas fa-chart-line",
    bg: "#e6ffe6"
  },
  {
    title: "Community",
    description: "Collaborate with peers",
    icon: "fas fa-users",
    bg: "#f9e0ff"
  }
];

export default function Home3() {
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % featureCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (<>
 
        <div className="section-header">
          <h2>Everything You Need</h2>
          <div className="section-divider"></div>
          <p>Access all the tools and resources for your academic success</p>
        </div>
    <div className="laptop-container">
      
      {/* Left Section */}
      <div className="left-section">
        <img src={LaptopImage} alt="Laptop" className="laptop-base" />
        <div className="screen-grid">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              className="laptop-card"
              initial={false}
              animate={{
                scale: index === highlightIndex ? 1.05 : 1,
                zIndex: index === highlightIndex ? 1 : 0,
                backgroundColor: card.bg
              }}
              transition={{ duration: 0.4 }}
            >
              <i className={card.icon}></i>
              <h4>{card.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2>{featureCards[highlightIndex].title}</h2>
        <p>{featureCards[highlightIndex].description}</p>
        <button>Learn More</button>
      </div>
    </div>
    </>
  );
}
