import React, { useState } from 'react';
import axios from 'axios';
import './Contact2.css';

export default function Contact2() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    success: false,
    error: false,
    message: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredPosition: ''
  });
  const [showForm, setShowForm] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'Please select a resume file to upload'
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'Please upload a PDF or Word document (doc/docx)'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: 'File size must be less than 5MB'
      });
      return;
    }

    setUploadStatus({
      uploading: true,
      success: false,
      error: false,
      message: 'Uploading your resume...'
    });

    // Create form data for file upload
    const uploadData = new FormData();
    uploadData.append('resume', selectedFile);
    uploadData.append('name', formData.name);
    uploadData.append('email', formData.email);
    uploadData.append('phone', formData.phone);
    uploadData.append('preferred_position', formData.preferredPosition);

    try {
      console.log('Attempting to upload resume with data:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferred_position: formData.preferredPosition,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size
      });

      // Create axios instance with default config
      const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        timeout: 30000, // 30 second timeout
        maxContentLength: 5 * 1024 * 1024, // 5MB max size
        maxBodyLength: 5 * 1024 * 1024,
        headers: {
          'Accept': 'application/json',
        }
      });

      // First make an OPTIONS request to check CORS
      try {
        await axiosInstance.options('/api/contact/careers/upload-resume/');
      } catch (corsError) {
        console.error("CORS preflight failed:", corsError);
      }

      // Send to backend API
      const response = await axiosInstance.post('/api/contact/careers/upload-resume/', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(prev => ({
            ...prev,
            message: `Uploading: ${percentCompleted}%`
          }));
        }
      });

      console.log("Upload response:", response.data);

      // Handle success
      setUploadStatus({
        uploading: false,
        success: true,
        error: false,
        message: response.data.message || 'Resume uploaded successfully! We will contact you soon.'
      });

      // Reset form
      setSelectedFile(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredPosition: ''
      });
      setShowForm(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setUploadStatus({
          uploading: false,
          success: false,
          error: false,
          message: ''
        });
      }, 5000);

    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config
      });
      
      let errorMessage = 'Failed to upload resume. ';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timed out. Please try again.';
      } else if (!error.response) {
        errorMessage += 'Cannot connect to server. Please check if the server is running at http://localhost:8000';
      } else if (error.response?.status === 413) {
        errorMessage += 'File size too large.';
      } else if (error.response?.status === 415) {
        errorMessage += 'Invalid file type.';
      } else if (error.response?.status === 400) {
        const errors = error.response.data.errors;
        if (errors) {
          // Format validation errors
          errorMessage += Object.entries(errors)
            .map(([field, error]) => `${field}: ${error}`)
            .join(', ');
        } else {
          errorMessage += error.response.data.message || 'Please check your form data and try again.';
        }
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Upload endpoint not found. Please check the server configuration.';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage += 'Permission error. Please try again.';
      } else {
        errorMessage += error.response?.data?.message || 'Please try again later.';
      }
      
      setUploadStatus({
        uploading: false,
        success: false,
        error: true,
        message: errorMessage
      });
    }
  };
  // Job opportunities at web development companies
  const jobOpportunities = [
    {
      id: 1,
      name: "TechFusion Digital",
      icon: "fas fa-globe",
      color: "#3B82F6",
      position: "Frontend Developer",
      openings: 3
    },
    {
      id: 2,
      name: "Webcraft Studios",
      icon: "fas fa-laptop-code",
      color: "#10B981",
      position: "Full Stack Developer",
      openings: 2
    },
    {
      id: 3,
      name: "Pixel Perfect Design",
      icon: "fas fa-paint-brush",
      color: "#F59E0B",
      position: "UI/UX Designer",
      openings: 4
    },
    {
      id: 4,
      name: "CloudSite Solutions",
      icon: "fas fa-cloud",
      color: "#6366F1",
      position: "Cloud Engineer",
      openings: 2
    },
    {
      id: 5,
      name: "Responsive Web Experts",
      icon: "fas fa-mobile-alt",
      color: "#EC4899",
      position: "Mobile Developer",
      openings: 3
    },
    {
      id: 6,
      name: "SEO Web Masters",
      icon: "fas fa-search",
      color: "#8B5CF6",
      position: "SEO Specialist",
      openings: 2
    }
  ];

  return (
    <div className="partners-container">
      <div className="partners-header">
        <h1 className="partners-title">Career Opportunities</h1>
        <p className="partners-subtitle">We connect talented students with job opportunities at these leading web development companies</p>
      </div>

      <div className="webdev-marquee-container">
        <div className="webdev-marquee">
          <div className="webdev-marquee-content">
            {/* First set of cards */}
            {jobOpportunities.map(job => (
              <div className="webdev-card" key={job.id}>
                <div className="webdev-icon-container" style={{ backgroundColor: `${job.color}20` }}>
                  <i className={job.icon} style={{ color: job.color }}></i>
                </div>
                <h3 className="webdev-name">{job.name}</h3>
                <div className="job-details">
                  <p className="job-position">{job.position}</p>
                  <div className="job-openings">
                    <span className="openings-count">{job.openings}</span>
                    <span className="openings-text">Openings</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Duplicate set for continuous scrolling */}
            {jobOpportunities.map(job => (
              <div className="webdev-card" key={`dup-${job.id}`}>
                <div className="webdev-icon-container" style={{ backgroundColor: `${job.color}20` }}>
                  <i className={job.icon} style={{ color: job.color }}></i>
                </div>
                <h3 className="webdev-name">{job.name}</h3>
                <div className="job-details">
                  <p className="job-position">{job.position}</p>
                  <div className="job-openings">
                    <span className="openings-count">{job.openings}</span>
                    <span className="openings-text">Openings</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="partnership-benefits">
        <h2 className="benefits-title">Why Work With Our Partner Companies</h2>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3>Competitive Salary</h3>
            <p>Above-industry-average compensation packages for qualified candidates</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3>Remote Work</h3>
            <p>Flexible work arrangements with remote and hybrid options available</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3>Career Growth</h3>
            <p>Continuous learning opportunities and clear advancement paths</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3>Great Benefits</h3>
            <p>Comprehensive health insurance, retirement plans, and paid time off</p>
          </div>
        </div>
      </div>

      <div className="partnership-cta">
        <div className="cta-content">
          <h2>Ready to start your tech career?</h2>
          <p>Submit your resume and we'll match you with the perfect opportunity at one of our partner companies</p>
          
          {!showForm ? (
            <button className="cta-button" onClick={() => setShowForm(true)}>
              <i className="fas fa-file-upload"></i> Upload Resume
            </button>
          ) : (
            <div className="resume-upload-form">
              {uploadStatus.message && (
                <div className={`upload-status ${uploadStatus.error ? 'error' : uploadStatus.success ? 'success' : ''}`}>
                  {uploadStatus.uploading && <div className="upload-spinner"></div>}
                  <p>{uploadStatus.message}</p>
                </div>
              )}
              
              <form onSubmit={handleResumeUpload}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name"></label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email"></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone"></label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="preferredPosition"></label>
                    <select 
                      id="preferredPosition" 
                      name="preferredPosition" 
                      value={formData.preferredPosition}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a position</option>
                      {jobOpportunities.map(job => (
                        <option key={job.id} value={job.position}>{job.position} at {job.name}</option>
                      ))}
                      <option value="Any">Open to any position</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group file-upload">
                  <label htmlFor="resume"></label>
                  <div className="file-input-container">
                    <input 
                      type="file" 
                      id="resume" 
                      name="resume" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required 
                    />
                    <div className="file-input-button">
                      <i className="fas fa-file-upload"></i> Select File
                    </div>
                    <span className="file-name">
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </span>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={uploadStatus.uploading}
                  >
                    {uploadStatus.uploading ? 'Uploading...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}