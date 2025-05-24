import React, { useEffect, useState } from 'react'
import './Course.css'

export default function Course() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos for the logged-in student
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await fetch('http://localhost:8000/core/student-videos/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error('Failed to fetch videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="course-videos">
      <h2>Your Course Videos</h2>
      {videos.length === 0 ? (
        <p>No videos available for your course.</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <h3>{video.title}</h3>
              <video width="600" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
