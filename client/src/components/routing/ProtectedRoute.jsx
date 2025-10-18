import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allow = "any", redirectTo = "/login" }) => {
  const { isAuthenticated, userType, loading } = useSelector((s) => s.auth);
  const location = useLocation();

  // ✅ NEW: Debug logging
  console.log('🛡️ ProtectedRoute Check:', {
    path: location.pathname,
    isAuthenticated,
    userType,
    loading,
    allow
  });

  // 🚧 Prevent premature redirect during auth load
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700">
        <div className="text-center text-white p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking access...</p>
        </div>
      </div>
    );
  }

  // 🚫 Not logged in
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // ✅ User role allowed
  if (allow === "any" || allow === userType) {
    console.log('✅ Access granted');
    return children;
  }

  // 🚷 Role mismatch
  console.log('⚠️ Role mismatch, redirecting');
  return <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
