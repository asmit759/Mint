// src/components/routing/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allow = 'any', redirectTo = '/login' }) => {
  const { isAuthenticated, userType } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (allow === 'any' || allow === userType) return children;
  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
