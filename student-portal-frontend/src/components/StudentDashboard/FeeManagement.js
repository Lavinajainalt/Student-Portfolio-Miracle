import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../Services/api';
import './FeeManagement.css';

const FeeManagement = () => {
  const [installments, setInstallments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [pendingInstallments, setPendingInstallments] = useState(0);
  const [overdueInstallments, setOverdueInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [clickedLinks, setClickedLinks] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    pin: '' // Added PIN field
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchInstallments();
    
    // Add scroll effect handler
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path) => {
    setClickedLinks(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const fetchInstallments = async () => {
    try {
      const response = await apiService.getStudentFees();
      if (response && response.installments) {
        setInstallments(response.installments);
        setTotalAmount(response.total_amount || 0);
        setTotalPaid(response.total_paid || 0);
        setPendingInstallments(response.pending_installments || 0);
        setOverdueInstallments(response.overdue_installments || []);
        setError('');
      } else {
        setError('Invalid fee data received from server');
      }
    } catch (err) {
      console.error('Error fetching fees:', err);
      setError('Failed to fetch fee details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const initiatePaymentProcess = (installment) => {
    setSelectedInstallment(installment);
    setShowPaymentModal(true);
    setCurrentStep(1);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!selectedInstallment) {
      setError('Please select an installment to pay');
      return;
    }

    setCurrentStep(3);
    setProcessingPayment(true);
    
    try {
      // Make payment request with basic details
      const response = await apiService.initiatePayment({
        payment_method: selectedPaymentMethod,
        payment_details: {
          installment_id: selectedInstallment?.id
        }
      });
      
      if (response.message === 'Payment successful') {
        setCurrentStep(4);
        await fetchInstallments();
        setShowPaymentModal(false);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(response.error || 'Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setCurrentStep(2);
    } finally {
      setProcessingPayment(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod('');
    setCurrentStep(1);
    setPaymentDetails({});
  };

  const renderPaymentForm = () => {
    return (
      <>
        <div className="payment-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="payment-header">
            <h3>Payment Details</h3>
            <p>Installment Amount: ₹{selectedInstallment?.amount || 0}</p>
            <p>Due Date: {selectedInstallment?.due_date}</p>
          </div>
          {selectedPaymentMethod === 'CREDIT_CARD' || selectedPaymentMethod === 'DEBIT_CARD' ? (
            <div className="card-payment">
              <div className="payment-field">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentDetailsChange}
                  maxLength="16"
                />
              </div>
              <div className="payment-field">
                <label>Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="John Doe"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentDetailsChange}
                />
              </div>
              <div className="card-extra-details">
                <div className="payment-field">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={handlePaymentDetailsChange}
                    maxLength="5"
                  />
                </div>
                <div className="payment-field">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={handlePaymentDetailsChange}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          ) : selectedPaymentMethod === 'UPI' ? (
            <div className="upi-payment">
              <div className="payment-field">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="example@upi"
                  value={paymentDetails.upiId}
                  onChange={handlePaymentDetailsChange}
                />
              </div>
            </div>
          ) : selectedPaymentMethod === 'NET_BANKING' ? (
            <div className="net-banking">
              <div className="payment-field">
                <label>Bank</label>
                <select
                  name="bankName"
                  value={paymentDetails.bankName}
                  onChange={handlePaymentDetailsChange}
                >
                  <option value="">Select Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                </select>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  };

  if (loading) return <div className="fee-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Enhanced Navbar with scroll effect */}
      <nav className={`navbar animate__animated animate__fadeInDown ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-brand">
          <h2 className="animate__animated animate__pulse animate__infinite animate__slower">Student Portal</h2>
        </div>
        
        <div className="navbar-links">
          <NavLink 
            to="/home" 
            end 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/home'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/home')}
          >
            <i className="fas fa-home"></i> <span>Home</span>
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/dashboard'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/fees" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/fees'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/fees')}
          >
            <i className="fas fa-rupee-sign"></i> <span>Fees</span>
          </NavLink>
          <NavLink 
            to="/courses" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/courses'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/courses')}
          >
            <i className="fas fa-book"></i> <span>Courses</span>
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/about'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/about')}
          >
            <i className="fas fa-info-circle"></i> <span>About</span>
          </NavLink>
          <NavLink 
            to="/maincontact" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''} ${clickedLinks['/maincontact'] ? 'clicked' : ''}`
            }
            onClick={() => handleLinkClick('/maincontact')}
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

      <div className="fee-management-container">
        <h2>Fee Management</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="fee-summary">
          <div className="summary-item">
            <h3>Total Amount</h3>
            <p>₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <h3>Paid Amount</h3>
            <p>₹{totalPaid.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <h3>Pending Installments</h3>
            <p>{pendingInstallments}</p>
          </div>
          <div className="summary-item">
            <h3>Overdue Installments</h3>
            <p>{overdueInstallments.length}</p>
          </div>
        </div>

        <div className="installments-list">
          <h3>Installment Details</h3>
          {installments.map((installment) => (
            <div key={installment.id} className="installment-card">
              <div className="installment-header">
                <h4>Installment {installment.installment_number}</h4>
                <span className={`status ${installment.status.toLowerCase()}`}>
                  {installment.status}
                </span>
              </div>
              <div className="installment-details">
                <p>Amount: ₹{installment.amount.toFixed(2)}</p>
                <p>Due Date: {new Date(installment.due_date).toLocaleDateString()}</p>
                <p>Course: {installment.course}</p>
              </div>

              {installment.status === 'PENDING' && (
                <button
                  onClick={() => initiatePaymentProcess(installment)}
                  className="pay-button"
                  disabled={processingPayment}
                >
                  <i className="fas fa-credit-card"></i>
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>

        {showPaymentModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <button className="close-modal" onClick={closePaymentModal}>&times;</button>
              <div className="payment-steps">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Select Payment Method</div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Enter Details</div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Confirm Payment</div>
                <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4. Complete</div>
              </div>

              {currentStep === 1 && (
                <div className="payment-methods">
                  <h3>Select Payment Method</h3>
                  <div className="payment-method-grid">
                    <button onClick={() => handlePaymentMethodSelect('CREDIT_CARD')}>
                      <i className="fas fa-credit-card"></i>
                      Credit Card
                    </button>
                    <button onClick={() => handlePaymentMethodSelect('DEBIT_CARD')}>
                      <i className="fas fa-credit-card"></i>
                      Debit Card
                    </button>
                    <button onClick={() => handlePaymentMethodSelect('NET_BANKING')}>
                      <i className="fas fa-university"></i>
                      Net Banking
                    </button>
                    <button onClick={() => handlePaymentMethodSelect('UPI')}>
                      <i className="fas fa-mobile-alt"></i>
                      UPI
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="payment-details">
                  <h3>Enter Payment Details</h3>
                  {renderPaymentForm()}
                  <button 
                    className="proceed-button"
                    onClick={() => setCurrentStep(3)}
                  >
                    Proceed
                  </button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="payment-confirmation">
                  <h3>Confirm Payment</h3>
                  <div className="confirmation-details">
                    <p><strong>Amount:</strong> ₹{selectedInstallment.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Payment Method:</strong> {selectedPaymentMethod.replace('_', ' ')}</p>
                    <p><strong>Installment:</strong> {selectedInstallment.installment_number}</p>
                  </div>
                  <button 
                    className="confirm-button"
                    onClick={handlePayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <span>
                        <i className="fas fa-spinner fa-spin"></i> Processing...
                      </span>
                    ) : (
                      'Confirm Payment'
                    )}
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="payment-success">
                  <i className="fas fa-check-circle success-icon"></i>
                  <h3>Payment Successful!</h3>
                  <p>Your payment has been processed successfully.</p>
                  <button className="close-button" onClick={closePaymentModal}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement; 