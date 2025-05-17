import React from "react";
import "./coursemodle.css";

const CourseModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{course}</h2>
        <p>
          Detailed info about <strong>{course}</strong> goes here. Syllabus,
          duration, tools, and outcomes.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CourseModal;
