// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/select-role" />;
  }
  
  if (requiredRole && user.user.role !== requiredRole) {
    return <Navigate to="/select-role" />;
  }
  
  return children;
}

export default ProtectedRoute;
