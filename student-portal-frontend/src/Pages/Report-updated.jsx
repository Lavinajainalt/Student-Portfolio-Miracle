import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Dashboard/StudentNavbar.css';
import './Report.css';
import logoimage from '../Images/logo.png';
import apiService from '../Services/api-updated';

export default function Report() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [clickedLinks, setClickedLinks] = useState({});
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  
  // All students from the Indian names script
  const allStudents = [
    {
      name: "Rahul Sharma",
      studentId: "ST22001",
      program: "Data Science",
      batch: "2023",
      email: "rahul@example.com",
      phone: "9876543210",
      dob: "1997-05-15",
      address: "42 MG Road, Delhi",
      enrollmentDate: "2023-08-01",
      status: "Active",
      profileImage: "https://via.placeholder.com/150"
    },
    {
      name: "Priya Patel",
      studentId: "ST22002",
      program: "Post Graduate Diploma in Frontend Engineering",
      batch: "2023",
      email: "priya@example.com",
      phone: "9876543211",
      dob: "1998-07-12",
      address: "123 Gandhi Road, Mumbai",
      enrollmentDate: "2023-08-01",
      status: "Active",
      profileImage: "https://via.placeholder.com/150"
    },
    {
      name: "Amit Singh",
      studentId: "ST22003",
      program: "Cyber Security",
      batch: "2023",
      email: "amit@example.com",
      phone: "9876543212",
      dob: "1996-11-23",
      address: "78 Nehru Street, Bangalore",
      enrollmentDate: "2023-08-01",
      status: "Active",
      profileImage: "https://via.placeholder.com/150"
    },
    {
      name: "Neha Gupta",
      studentId: "ST22004",
      program: "Data Science",
      batch: "2023",
      email: "neha@example.com",
      phone: "9876543213",
      dob: "1999-03-28",
      address: "15 Patel Nagar, Hyderabad",
      enrollmentDate: "2023-08-01",
      status: "Inactive",
      profileImage: "https://via.placeholder.com/150"
    },
    {
      name: "Vikram Reddy",
      studentId: "ST22005",
      program: "Post Graduate Diploma in Frontend Engineering",
      batch: "2023",
      email: "vikram@example.com",
      phone: "9876543214",
      dob: "1997-09-05",
      address: "56 Tagore Lane, Chennai",
      enrollmentDate: "2023-08-01",
      status: "Active",
      profileImage: "https://via.placeholder.com/150"
    }
  ];
  
  // Current student data
  const [studentData, setStudentData] = useState({
    loading: false,
    error: null,
    data: allStudents[currentStudentIndex]
  });
  const [feesData, setFeesData] = useState({
    loading: true,
    error: null,
    data: null,
    lastUpdated: null
  });
  
  // Function to fetch fee data from FeeStructure and FeeInstallment models
  const refreshFeeData = async () => {
    try {
      setFeesData({ loading: true, error: null, data: null, lastUpdated: null });
      
      // Get student ID from current student
      const studentId = studentData.data.studentId;
      
      // Fetch fee structure for this specific student
      const response = await apiService.getStudentFeesById(studentId);
      
      if (response && response.success && response.data) {
        console.log('Fee structure data for student', studentId, ':', response.data);
        
        const feeStructure = response.data;
        
        // Process installments and payments
        const payments = feeStructure.installments
          .filter(inst => inst.payment) // Only include installments with payments
          .map(inst => ({
            date: inst.payment.payment_date ? new Date(inst.payment.payment_date).toLocaleDateString() : inst.due_date,
            description: `Installment ${inst.installment_number}`,
            amount: inst.amount,
            status: inst.status === 'PAID' ? 'Paid' : 'Pending',
            method: inst.payment?.payment_method || 'N/A',
            transactionId: inst.payment?.transaction_id || 'N/A'
          }));
        
        // Calculate totals
        const totalFees = feeStructure.total_amount;
        const paidAmount = feeStructure.installments
          .filter(inst => inst.status === 'PAID')
          .reduce((sum, inst) => sum + parseFloat(inst.amount || 0), 0);
        const dueAmount = totalFees - paidAmount;
        
        // Find next due date
        const pendingInstallments = feeStructure.installments.filter(inst => inst.status === 'PENDING');
        const nextDueDate = pendingInstallments.length > 0 ? pendingInstallments[0].due_date : 'None';
        
        setFeesData({
          loading: false,
          data: {
            totalFees,
            paidAmount,
            dueAmount,
            dueDate: nextDueDate,
            payments,
            studentName: feeStructure.student_name,
            program: feeStructure.program
          },
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setFeesData({
          loading: false,
          data: null,
          error: 'No fee structure data available',
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error fetching fee structure data:', error);
      setFeesData({
        loading: false,
        data: null,
        error: 'Failed to load fee structure data',
        lastUpdated: new Date()
      });
    }
  };

  // Effect for scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Effect for loading fees data - only runs when student changes
  useEffect(() => {
    // Check for payment data in URL params (from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const hasPayment = urlParams.get('payment');
    
    if (hasPayment === 'success') {
      console.log('Payment success detected in URL params, refreshing immediately');
      refreshFeeData(); // Fetch latest data
    } else {
      // Only fetch data when student changes
      refreshFeeData();
    }
  }, [currentStudentIndex]); // Only re-run when student changes
  
  // Add event listener for custom payment events
  useEffect(() => {
    // Listen for payment completion events
    const handlePaymentComplete = (event) => {
      console.log('Payment completion detected, refreshing fee data...', event.detail);
      
      // Fetch latest payment data
      refreshFeeData();
    };
    
    // Listen for backend data change events
    const handleBackendDataChange = (event) => {
      console.log('Backend data change detected:', event.detail);
      refreshFeeData(); // Fetch latest data when backend data changes
    };
    
    window.addEventListener('payment-completed', handlePaymentComplete);
    window.addEventListener('fees-data-changed', handleBackendDataChange);
    
    // Add a manual refresh button for testing
    window.refreshReportData = refreshFeeData;
    
    return () => {
      window.removeEventListener('payment-completed', handlePaymentComplete);
      window.removeEventListener('fees-data-changed', handleBackendDataChange);
      delete window.refreshReportData;
    };
  }, []);

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <div className="dashboard-container">
      {/* Navbar with scroll effect */}
      <nav className={`navbar animate__animated animate__fadeInDown ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <img src={logoimage} alt="Logo" className="navbar-logo" />
          <h2 className="animate__animated animate__pulse animate__infinite animate__slower">Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink 
            to="/homefaculty" 
            end 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/homefaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/homefaculty')}
          >
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/feedback" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/feedback'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/feedback')}
          >
            <i className="fas fa-comment"></i> <span>Feedback</span>
          </NavLink>
          <NavLink 
            to="/report" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/report'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/report')}
          >
            <i className="fas fa-file-alt"></i> <span>Report</span>
          </NavLink>
          <NavLink 
            to="/aboutfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/aboutfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/aboutfaculty')}
          >
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink 
            to="/contactfaculty" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/contactfaculty'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/contactfaculty')}
          >
            <i className="fas fa-envelope"></i> <span>Contact</span>
          </NavLink>
          <NavLink 
            to="/communitycenter" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/communitycenter'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/communitycenter')}
          >
            <i className="fas fa-users"></i> <span>Community</span>
          </NavLink>
        </div>
        
        <div className="navbar-user">
          <span className="animate__animated animate__fadeIn">{user?.username || 'Student'}</span>
          <button className="logout-btn animate__animated animate__fadeIn" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Report content */}
      <div className="dashboard-content">
        {/* Student Details Section */}
        <div className="content-card">
          <h2>Student Details</h2>
          
          {studentData.loading ? (
            <div className="loading-spinner">Loading student data...</div>
          ) : studentData.error ? (
            <div className="error-message">{studentData.error}</div>
          ) : (
            <div className="student-details">
              <div className="student-navigation">
                <button 
                  onClick={() => {
                    const newIndex = (currentStudentIndex - 1 + allStudents.length) % allStudents.length;
                    setCurrentStudentIndex(newIndex);
                    setStudentData({...studentData, data: allStudents[newIndex]});
                  }}
                  className="nav-button"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <span className="student-counter">{currentStudentIndex + 1} of {allStudents.length}</span>
                <button 
                  onClick={() => {
                    const newIndex = (currentStudentIndex + 1) % allStudents.length;
                    setCurrentStudentIndex(newIndex);
                    setStudentData({...studentData, data: allStudents[newIndex]});
                  }}
                  className="nav-button"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              <div className="student-profile-header">
                <div className="student-avatar">
                  <img src={studentData.data?.profileImage || 'https://via.placeholder.com/150'} alt="Student" />
                </div>
                <div className="student-basic-info">
                  <h3>{studentData.data?.name || 'Student Name'}</h3>
                  <p className="student-id">ID: {studentData.data?.studentId || 'N/A'}</p>
                  <p className="student-program">{studentData.data?.program || 'Program'} | {studentData.data?.batch || 'Batch'}</p>
                </div>
              </div>
              
              <div className="student-info-grid">
                <div className="info-card">
                  <span className="info-label">Email</span>
                  <span className="info-value">{studentData.data?.email || 'N/A'}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{studentData.data?.phone || 'N/A'}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">{studentData.data?.dob || 'N/A'}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Address</span>
                  <span className="info-value">{studentData.data?.address || 'N/A'}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Enrollment Date</span>
                  <span className="info-value">{studentData.data?.enrollmentDate || 'N/A'}</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Status</span>
                  <span className={`info-value status ${studentData.data?.status?.toLowerCase() || ''}`}>
                    {studentData.data?.status || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Fees Section */}
        <div className="content-card">
          <h2>Fees Report</h2>
          
          {feesData.loading ? (
            <div className="loading-spinner">Loading fees data from API...</div>
          ) : feesData.error ? (
            <div className="error-message">{feesData.error}</div>
          ) : !feesData.data ? (
            <div className="error-message">No payment data available</div>
          ) : (
            <div className="fees-container">
              <div className="fees-summary">
                <div className="fees-card">
                  <h3>Total Fees</h3>
                  <div className="fees-amount">₹{feesData.data?.totalFees || 0}</div>
                </div>
                <div className="fees-card">
                  <h3>Paid Amount</h3>
                  <div className="fees-amount">₹{feesData.data?.paidAmount || 0}</div>
                  <div className="payment-progress">
                    <div 
                      className="progress-bar" 
                      style={{width: `${(feesData.data?.paidAmount / feesData.data?.totalFees) * 100}%`}}
                    ></div>
                  </div>
                  <div className="payment-percentage">
                    {Math.round((feesData.data?.paidAmount / feesData.data?.totalFees) * 100)}% Complete
                  </div>
                </div>
                <div className="fees-card">
                  <h3>Due Amount</h3>
                  <div className="fees-amount due">₹{feesData.data?.dueAmount || 0}</div>
                </div>
                <div className="fees-card">
                  <h3>Next Due Date</h3>
                  <div className="fees-date">{feesData.data?.dueDate || 'N/A'}</div>
                </div>
              </div>
              
              <div className="fees-details">
                <h3>Payment History</h3>
                <div className="refresh-controls">
                  <button 
                    className="refresh-button" 
                    onClick={() => {
                      console.log("Manual refresh triggered");
                      refreshFeeData(); // Fetch latest payment data from Django admin
                    }}
                  >
                    <i className="fas fa-sync-alt"></i> Refresh Payment Data
                  </button>
                  <div className="last-updated">
                    Last updated: {feesData.lastUpdated ? feesData.lastUpdated.toLocaleTimeString() : 'Never'}
                  </div>
                </div>
                <table className="fees-table">
                  <thead>
                    <tr>
                      <th>Installment</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Transaction ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feesData.data?.payments?.length > 0 ? (
                      feesData.data.payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.description}</td>
                          <td>{payment.date}</td>
                          <td>₹{payment.amount}</td>
                          <td>{payment.method === 'CREDIT_CARD' ? 'Credit Card' : 
                               payment.method === 'DEBIT_CARD' ? 'Debit Card' : 
                               payment.method === 'NET_BANKING' ? 'Net Banking' : 
                               payment.method === 'UPI' ? 'UPI' : 'N/A'}</td>
                          <td>{payment.transactionId || 'N/A'}</td>
                          <td>
                            <span className={`status-badge ${payment.status.toLowerCase()}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No payment history available for {feesData.data?.studentName || 'this student'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}