import React, { useEffect, useRef } from 'react';
import './Game.css';
import { NavLink } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Game() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // init AOS with 1s duration, animate once

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;

    function resizeCanvas() {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    resizeCanvas();

    class Ripple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 60 + Math.random() * 40;
        this.lineWidth = 2;
        this.alpha = 1;
        this.growthRate = 0.8 + Math.random() * 0.3;
        this.fadeRate = 0.02 + Math.random() * 0.015;
      }

      update() {
        this.radius += this.growthRate;
        this.alpha -= this.fadeRate;
        if (this.alpha < 0) this.alpha = 0;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(67, 40, 184, ${this.alpha})`;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      isDone() {
        return this.alpha <= 0;
      }
    }

    const ripples = [];
    const rippleInterval = 800;
    let lastRippleTime = 0;

    for (let i = 0; i < 7; i++) {
      ripples.push(new Ripple(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    function animate(timestamp = 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastRippleTime > rippleInterval) {
        ripples.push(new Ripple(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
        lastRippleTime = timestamp;
      }

      ripples.forEach((ripple) => {
        ripple.update();
        ripple.draw();
      });

      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].isDone()) {
          ripples.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="game-container"
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#DDE0F2',
        borderRadius: '15px',
        padding: '3rem 4rem',
        width: '1250px',
        margin: 'auto',
        marginTop: '0.5rem',
  
        height: '70vh',
        color: '#4328B8',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: '15px',
        }}
      />

      <div className="game-content" style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="game-header"
          style={{ marginBottom: '2rem' }}
          data-aos="fade-up"
        >
          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: '700',
              letterSpacing: '2px',
              textShadow: '0 2px 6px rgba(67, 40, 184, 0.4)',
              marginBottom: '0.5rem',
              lineHeight: '1.1',
            }}
          >
            Welcome to the Game Section
          </h1>
          <p
            style={{
              fontSize: '1.35rem',
              fontWeight: '500',
              color: '#5c4db2',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: '1.5',
              letterSpacing: '0.03em',
              textShadow: '0 1px 3px rgba(67, 40, 184, 0.15)',
            }}
            data-aos="fade-up"
            data-aos-delay="150"
          >
            Test your knowledge and skills with our interactive games designed for IT students.
          </p>
        </div>
        <div
          className="game-buttons"
          data-aos="zoom-in"
          data-aos-delay="300"
        >
          <NavLink
            to="/quiz"
            className="game-button"
            style={{
              display: 'inline-block',
              backgroundColor: '#4328B8',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '1.2rem',
              boxShadow: '0 0 20px #6e5dffcc',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a3acb';
              e.currentTarget.style.boxShadow = '0 0 30px #7a65ffcc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4328B8';
              e.currentTarget.style.boxShadow = '0 0 20px #6e5dffcc';
            }}
          >
            Start Quiz
          </NavLink>
        </div>
      </div>
    </div>
  );
}
