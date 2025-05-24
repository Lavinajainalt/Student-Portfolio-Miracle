import React from "react";
import "./Home5.css";

const testimonials = [
  {
    text: "The AI assistant helps me solve doubts instantly.",
    name: "Riya Sharma (Student)",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg"
  },
  {
    text: "Fee management dashboard is very intuitive.",
    name: "Mr. Khanna (Admin)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "Tracking attendance has never been easier.",
    name: "Prof. Anil Verma (Faculty)",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    text: "Voice-enabled chatbot is amazing for accessibility.",
    name: "Samar Iqbal (Student)",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg"
  },
  {
    text: "Analytics panel gives great insights.",
    name: "Dr. Rajeev Nair (Faculty)",
    avatar: "https://randomuser.me/api/portraits/men/53.jpg"
  },
  {
    text: "Dark mode is a blessing!",
    name: "Niharika (Student)",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg"
  },
  {
    text: "Lecture uploads are super fast now.",
    name: "Mr. Yadav (Faculty)",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg"
  },
  {
    text: "The portal reduced my admin workload.",
    name: "Principal Roy",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    text: "Class notifications are never missed now.",
    name: "Aanya Mehta (Student)",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg"
  },
  {
    text: "Online exam proctoring works great.",
    name: "Mr. Raghav Pandey (Faculty)",
    avatar: "https://randomuser.me/api/portraits/men/29.jpg"
  },
  {
    text: "Daily schedule is clearly visible and helpful.",
    name: "Tanya Jain (Student)",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg"
  },
  {
    text: "Parent-teacher meetings are better coordinated.",
    name: "Mrs. Menon (Admin)",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    text: "Performance reports are easy to generate.",
    name: "Dr. Sameer Joshi (Faculty)",
    avatar: "https://randomuser.me/api/portraits/men/37.jpg"
  },
  {
    text: "I'm able to connect with teachers quickly.",
    name: "Aarav Desai (Student)",
    avatar: "https://randomuser.me/api/portraits/men/27.jpg"
  },
  {
    text: "The system feels made for Indian schools.",
    name: "Sneha Kulkarni (Faculty)",
    avatar: "https://randomuser.me/api/portraits/women/19.jpg"
  },
  {
    text: "No more queues for fee payments!",
    name: "Vedant Saxena (Student)",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg"
  }
];

function VerticalTestimonialSlider() {
  const columnsCount = 4;

  const columns = Array.from({ length: columnsCount }, (_, colIndex) =>
    testimonials.filter((_, i) => i % columnsCount === colIndex)
  );

  return (
    <section className="slider-section">
 <h2 className="slider-heading">What Our Students Say</h2>
  <p className="slider-subheading">
    Real voices from learners, faculty, and administrators at Miracle IT Career Academy.
  </p>
      <div className="slider-wrapper">
        {columns.map((col, i) => (
          <div key={i} className={`column ${i % 2 === 0 ? "up" : "down"}`}>
            {[...col, ...col].map((entry, j) => (
              <div className="slider-card" key={j}>
                <img className="avatar" src={entry.avatar} alt={entry.name} />
                <div>
                  <div>{entry.text}</div>
                  <div style={{ fontSize: "13px", color: "#666", marginTop: 4 }}>
                    {entry.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default VerticalTestimonialSlider;
