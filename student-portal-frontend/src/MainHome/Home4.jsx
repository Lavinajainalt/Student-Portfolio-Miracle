import React from "react";
import { motion } from "framer-motion";
import { FaCloud, FaDatabase, FaJava, FaRobot, FaChartLine, FaLaptopCode, FaLock, FaBug } from "react-icons/fa";
import './Home4.css'
const coursesWithIcons = [
  { name: "Generative AI Certification Course", icon: <FaRobot /> },
  { name: "Big Data Hadoop Certification Course", icon: <FaDatabase /> },
  { name: "Java: Spring Boot Course", icon: <FaJava /> },
  { name: "Certification Course in DevOps", icon: <FaCloud /> },
  { name: "AI and Machine Learning", icon: <FaRobot /> },
  { name: "Data Analytics Course for Beginners", icon: <FaChartLine /> },
  { name: "Data Science Course for Professionals", icon: <FaChartLine /> },
  { name: "Full Stack Web Development with Certification", icon: <FaLaptopCode /> },
  { name: "Cloud Computing Certification Course", icon: <FaCloud /> },
  { name: "Introduction to Programming (C/C++)", icon: <FaLaptopCode /> },
  { name: "Cyber Security & Ethical Hacking", icon: <FaLock /> },
  { name: "Software Testing Certification Course", icon: <FaBug /> },
];

const popUpVariants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const MoreCoursesMarquee = () => {
  return (
    <div className="marquee-wrapper">
      <h2>🚀 More Courses We Provide</h2>
       <div className="marquee-strip">
    <div className="marquee-content">

          {coursesWithIcons.map((course, idx) => (
            <motion.div
              className="marquee-item"
              key={idx}
              initial="hidden"
              animate="visible"
              variants={popUpVariants}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div className="icon" variants={popUpVariants}>
                {course.icon}
              </motion.div>
              <motion.div className="label" variants={popUpVariants}>
                {course.name}
              </motion.div>
            </motion.div>
          ))}
          {/* Repeat for seamless marquee */}
          {coursesWithIcons.map((course, idx) => (
            <motion.div
              className="marquee-item"
              key={"repeat-" + idx}
              initial="hidden"
              animate="visible"
              variants={popUpVariants}
              transition={{ delay: idx * 0.1 }}
            >
              <motion.div className="icon" variants={popUpVariants}>
                {course.icon}
              </motion.div>
              <motion.div className="label" variants={popUpVariants}>
                {course.name}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreCoursesMarquee;
