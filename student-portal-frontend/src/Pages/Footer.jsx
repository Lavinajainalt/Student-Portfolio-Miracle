import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css';
import logo from '../Images/logo.png';

export default function Footer() {
  return (
    <footer className="miracle-footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-logo-col">
          <img src={logo} alt="Miracle IT" />
          <p>Empowering your future with expert-led education and innovation.</p>
        </div>

        <div className="footer-col">
          <h4>Academy</h4>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/faculty">Faculty</NavLink>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <NavLink to="/help">Help Center</NavLink>
          <NavLink to="/faq">FAQs</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="footer-col newsletter">
          <h4>Newsletter</h4>
          <p>Stay updated on events and courses.</p>
          <input type="email" placeholder="Your email" />
          <button>Subscribe</button>
        </div>
      </div>

      {/* Social Icons Row */}
      <div className="footer-socials">
        <a href="https://www.bing.com/ck/a?!&&p=a38e6e9ec86e51af575741d63e1c6616e67fe640866420112a5ac1857f2a5a92JmltdHM9MTc0NzM1MzYwMA&ptn=3&ver=2&hsh=4&fclid=21cc2a4f-083d-69ab-07b7-3ea709c568fd&psq=facebook+miracle+it+carrer+academy&u=a1aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL01pcmFjbGVJVENhcmVlckFjYWRlbXkvYWJvdXQv&ntb=1"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="https://www.bing.com/ck/a?!&&p=942df311a4a65ae409b4f68f4f1c4ca7c0cca45e0b25e6f4cbf220783f39e10aJmltdHM9MTc0NzM1MzYwMA&ptn=3&ver=2&hsh=4&fclid=21cc2a4f-083d-69ab-07b7-3ea709c568fd&psq=instagram+miracle+it+carrer+academy&u=a1aHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9taXJhY2xlaXRjYXJlZXJhY2FkZW15L3JlZWxzLw&ntb=1"><i className="fab fa-instagram"></i></a>
        <a href="https://www.bing.com/ck/a?!&&p=45f551879499e64bca3de5eb4ea15ce31ae579cd951b5aceca62362a843fd63aJmltdHM9MTc0NzM1MzYwMA&ptn=3&ver=2&hsh=4&fclid=21cc2a4f-083d-69ab-07b7-3ea709c568fd&psq=twitter+miracle+it+carrer+academy+bohpal&u=a1aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2NvbXBhbnkvbWlyYWNsZS1pdC1jYXJlZXItYWNhZGVteS8&ntb=1"><i className="fab fa-linkedin-in"></i></a>
      </div>

      {/* SVG Waves at Bottom */}
   <div className="footer-waves">
  <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>

    <path fill="url(#waveGradient)" fillOpacity="0.6"
      d="M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z">
      <animate attributeName="d" dur="12s" repeatCount="indefinite"
        values="
        M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z;
        M0,180 C400,280 1000,40 1440,140 L1440,320 L0,320 Z;
        M0,160 C360,320 1080,0 1440,160 L1440,320 L0,320 Z;" />
    </path>

    <path fill="url(#waveGradient)" fillOpacity="0.3"
      d="M0,200 C480,260 960,60 1440,180 L1440,320 L0,320 Z">
    </path>

    <path fill="#c7d2fe" fillOpacity="0.2"
      d="M0,240 C360,200 1080,220 1440,160 L1440,320 L0,320 Z">
    </path>

    <path fill="#e0e7ff" fillOpacity="0.1"
      d="M0,260 C480,300 960,180 1440,200 L1440,320 L0,320 Z">
    </path>
  </svg>
</div>


      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Miracle IT Career Academy. All rights reserved.</p>
      </div>
    </footer>
  );
}
