import React, { useEffect, useRef } from 'react';
import './CommunityHub.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { NavLink } from 'react-router-dom';
import ThemeToggleWrapper from '../components/ThemeToggleWrapper';
import { useTheme } from '../context/ThemeContext';

import student from '../Images/OIP.webp';
import student1 from '../Images/People2.png';
import student2 from '../Images/People3.jpeg';
import student3 from '../Images/Person1.webp';

export default function CampusCommunityHub() {
  const svgRef = useRef(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 1000 });
const drawCurves = () => {
  const svg = svgRef.current;
  if (!svg) return;

  const avatarGroups = document.querySelectorAll('.member-group');
  const content = document.querySelector('.hub-content');
  if (!content) return;

  const contentRect = content.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  avatarGroups.forEach((group, index) => {
    const groupRect = group.getBoundingClientRect();

    const startX = groupRect.left + groupRect.width / 2 - svgRect.left;
    const startY = groupRect.top + groupRect.height / 2 - svgRect.top;

    // Give each avatar a different target point on the content box
    const yOffsets = [-50, 90, 80, 100];
    const endX = contentRect.left + contentRect.width / 2 - svgRect.left;
    const endY = contentRect.top + contentRect.height / 2 + yOffsets[index] - svgRect.top;

    // Direction-aware control points
    const dx = (endX - startX) / 1.5;
    const dy = (endY - startY) / 1.5;
    const c1x = startX + dx;
    const c1y = startY;
    const c2x = endX - dx;
    const c2y = endY;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`);
    path.setAttribute('class', `dotted-line ${['blue', 'orange', 'purple', 'red'][index % 4]}`);
    svg.appendChild(path);
  });
};


    const ensureImagesLoadedThenDraw = () => {
      const avatars = document.querySelectorAll('.profile-pic');
      let loaded = 0;

      avatars.forEach(img => {
        if (img.complete) {
          loaded++;
        } else {
          img.addEventListener('load', () => {
            loaded++;
            if (loaded === avatars.length) requestAnimationFrame(drawCurves);
          });
        }
      });

      if (loaded === avatars.length) requestAnimationFrame(drawCurves);
    };

    ensureImagesLoadedThenDraw();
    window.addEventListener('resize', drawCurves);
    return () => window.removeEventListener('resize', drawCurves);
  }, []);

  return (
    <section className="hub-section" data-aos="fade-up">
      <ThemeToggleWrapper />
      <svg className="connection-lines" ref={svgRef}>
        {/* Lines are dynamically inserted */}
      </svg>

      <div className="profile-wrapper">
        <div className="member-group top-left">
          <img src={student} alt="Student 1" className="profile-pic" />
          <div className="message-bubble">Let's collaborate!</div>
        </div>
        <div className="member-group middle-left">
          <img src={student1} alt="Student 2" className="profile-pic" />
          <div className="message-bubble">Need help?</div>
        </div>
        <div className="member-group top-right">
          <img src={student3} alt="Student 4" className="profile-pic" />
          <div className="message-bubble">Good morning!</div>
        </div>
        <div className="member-group bottom-right">
          <img src={student2} alt="Student 3" className="profile-pic" />
          <div className="message-bubble">Ready to learn!</div>
        </div>
      </div>

      <div className="hub-content" data-aos="zoom-in">
        <h2>
          Give your <span className="accent">students</span> a voice <br />
          with <span className="accent underline">Community</span>
        </h2>
        <p>
          Students at Miracle IT collaborate, support each other, and grow together on our digital campus.
        </p>
        <NavLink to="/communitycenter" className="action-button">
          Join the Community →
        </NavLink>
        <p className="footnote">Free for all enrolled students.</p>
      </div>
    </section>
  );
}
