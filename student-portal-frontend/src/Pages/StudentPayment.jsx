import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { getSocket } from '../services/socketService';
import './StudentPayment.css';

const StudentPayment = () => {
  const { user } = useAuth();
  const [feesData, setFeesData] = useState({
    loading: true,
    error: null,
    data: null
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  useEffect(() => {
    fetchFeesData();
  }, []);
  
  const fetchFeesData = async () => {
    try {
      setFeesData(prev => ({ ...prev, loading: true }));
      
      // Make API call to backend
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/fees/student/${user.id}`);
      
      setFeesData({
        loading: false,
        data: response.data,
        error: null
      });
    } catch (error) {
      console.error('Error fetching fees data:', error);
      
      // Fallback to mock data
      const mockData = getMockFeesData();
      
      setFeesData({
        loading: false,
        data: mockData,
        error: null
      });
    }
  };
  
  const getMockFeesData = () => {
    // Mock data for Priya Patel
    const totalFees = 120000;
    const installmentAmount = totalFees / 4;
    const paidInstallments = 2;
    
    const startDate = new Date('2023-01-15');
    const installmentDates = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + (i * 3));
      installmentDates.push(date.toISOString().split('T')[0]);
    }
    
    const payments = [];
    
    // Add paid installments
    for (let i = 0; i < paidInstallments; i++) {
      payments.push({
        date: installmentDates[i],
        description: `Installment ${i + 1}`,
        amount: installmentAmount,
        status: 'Paid'
      });
    }
    
    // Add pending installments
    for (let i = paidInstallments; i < 4; i++) {
      payments.push({
        date: installmentDates[i],
        description: `Installment ${i + 1}`,
        amount: installmentAmount,
        status: 'Pending'
      });
    }
    
    const paidAmount = paidInstallments * installmentAmount;
    const dueAmount = totalFees - paidAmount;
    const nextDueDate = paidInstallments < 4 ? installmentDates[paidInstallments] : 'None';
    
    return {
      totalFees: totalFees,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      dueDate: nextDueDate,
      payments: payments
    };
  };
  
  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      
      // In a real app, this would be a payment gateway integration
      // For demo, we'll simulate a payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Make API call to update payment status
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/fees/payment`, {
        studentId: user.id,
        installmentNumber: feesData.data.payments.filter(p => p.status === 'Pending')[0].description.split(' ')[1],
        amount: feesData.data.payments.filter(p => p.status === 'Pending')[0].amount
      });
      
      // Emit socket event to notify other users
      const socket = getSocket();
      socket.emit('fee-payment', {
        studentId: user.id,
        studentName: user.first_name + ' ' + user.last_name
      });
      
      setPaymentSuccess(true);
      fetchFeesData(); // Refresh data
      
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  if (feesData.loading) {
    return <div className="loading-spinner">Loading fees data...</div>;
  }
  
  if (feesData.error) {
    return <div className="error-message">{feesData.error}</div>;
  }
  
  const nextPayment = feesData.data.payments.find(payment => payment.status === 'Pending');
  
  return (
    <div className="student-payment-container">
      <h2>Fee Payment</h2>
      
      <div className="payment-summary">
        <div className="summary-card">
          <h3>Total Fees</h3>
          <div className="amount">₹{feesData.data.totalFees}</div>
        </div>
        <div className="summary-card">
          <h3>Paid Amount</h3>
          <div className="amount">₹{feesData.data.paidAmount}</div>
          <div className="payment-progress">
            <div 
              className="progress-bar" 
              style={{width: `${(feesData.data.paidAmount / feesData.data.totalFees) * 100}%`}}
            ></div>
          </div>
          <div className="payment-percentage">
            {Math.round((feesData.data.paidAmount / feesData.data.totalFees) * 100)}% Complete
          </div>
        </div>
        <div className="summary-card">
          <h3>Due Amount</h3>
          <div className="amount due">₹{feesData.data.dueAmount}</div>
        </div>
      </div>
      
      {nextPayment ? (
        <div className="next-payment-section">
          <h3>Next Payment Due</h3>
          <div className="next-payment-details">
            <div className="payment-info">
              <p><strong>Description:</strong> {nextPayment.description}</p>
              <p><strong>Amount:</strong> ₹{nextPayment.amount}</p>
              <p><strong>Due Date:</strong> {nextPayment.date}</p>
            </div>
            <button 
              className={`pay-now-button ${paymentProcessing ? 'processing' : ''}`}
              onClick={handlePayment}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
          {paymentSuccess && (
            <div className="payment-success-message">
              Payment successful! Your payment has been recorded.
            </div>
          )}
        </div>
      ) : (
        <div className="all-paid-message">
          <h3>All payments completed</h3>
          <p>You have paid all your installments. Thank you!</p>
        </div>
      )}
      
      <div className="payment-history">
        <h3>Payment History</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feesData.data.payments.map((payment, index) => (
              <tr key={index} className={payment.status.toLowerCase()}>
                <td>{payment.date}</td>
                <td>{payment.description}</td>
                <td>₹{payment.amount}</td>
                <td>
                  <span className={`status-badge ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPayment;