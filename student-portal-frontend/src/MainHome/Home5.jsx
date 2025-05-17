import React, { useState, useEffect, useRef } from "react";
import "./Home5.css"; // Import your CSS file for styling


 const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "CEO, Victory Co.",
    photo: "https://www.shutterstock.com/image-photo/portrait-happy-indian-teenager-college-260nw-2159627891.jpg",
    text: "I would like to say a big Thank you for your immense effort and support. In addition, I have feeling that our further events are going to be Great as well, good luck to the team.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Marketing Manager",
    photo: "https://th.bing.com/th/id/OIP.TLqzGCaCQoTHoNXcMhIa5wHaE8?cb=iwp2&w=612&h=408&rs=1&pid=ImgDetMain",
    text: "Amazing platform with great instructors! It helped me level up my career and connect with professionals in the industry.",
  },
  {
    id: 3,
    name: "Amit Singh",
    role: "Software Engineer",
    photo: "https://th.bing.com/th/id/OIP.F9YOpXgr0zYBgM1fwBSQcAHaLH?cb=iwp2&w=600&h=900&rs=1&pid=ImgDetMain",
    text: "The courses are very detailed and up to date. The hands-on projects helped me get real-world experience quickly.",
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Product Designer",
    photo: "https://media.istockphoto.com/id/1301397300/photo/portrait-of-young-woman-stock-photo.jpg?s=612x612&w=0&k=20&c=Xvgo-k58_woBTuQaRNZ4JXP2SQsw_RSbrlSbt7XbQlU=",
    text: "I love the community support and the quality of content. The flexible schedule helped me learn while working full-time.",
  },
  {
    id: 5,
    name: "Vikram Joshi",
    role: "Cloud Architect",
    photo: "https://img.freepik.com/premium-photo/indian-students-isolated-white-background_988871-9.jpg",
    text: "Highly recommend this to anyone serious about tech careers. The instructors are top-notch and very supportive.",
  },
];



export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;
  const timeoutRef = useRef(null);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const nextSlide = () => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    };

    timeoutRef.current = setTimeout(nextSlide, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [current, length]);

  const prevSlide = () => {
    clearTimeout(timeoutRef.current);
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    clearTimeout(timeoutRef.current);
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  return (
    <div className="testimonial-slider-container">
    <div className="testimonial-slider">
      <h2 className="slider-title">Hear From Our Success Stories</h2>

      <div className="slider-main">
        <button className="arrow left" onClick={prevSlide} aria-label="Previous testimonial">
          &#8592;
        </button>

        <div className="testimonial-content">
          <div className="photo-container">
            <img src={testimonials[current].photo} alt={testimonials[current].name} />
          </div>
          <div className="text-box">
            <p className="testimonial-text">“{testimonials[current].text}”</p>
            <p className="testimonial-name">{testimonials[current].name}</p>
            <p className="testimonial-role">{testimonials[current].role}</p>
          </div>
        </div>

        <button className="arrow right" onClick={nextSlide} aria-label="Next testimonial">
          &#8594;
        </button>
      </div>

      <div className="slider-thumbnails">
        {testimonials.map((t, idx) => (
          <div
            key={t.id}
            className={`thumbnail ${idx === current ? "active" : ""}`}
            onClick={() => {
              clearTimeout(timeoutRef.current);
              setCurrent(idx);
            }}
          >
            <img src={t.photo} alt={t.name} />
          </div>
        ))}
      </div>

      <p className="slide-count">
        {current + 1} / {length}
      </p>
    </div>
    </div>
  );
}
