import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute Component
 * @param {string} allow - "student" or "mentor"
 * @param {ReactNode} children - The component to render if allowed
 */
const ProtectedRoute = ({ allow, children }) => {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Show loading screen while verifying auth
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-lg">
        Checking authentication...
      </div>
    );
  }

  // If not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but wrong role → redirect to respective dashboard
  if (allow && role !== allow) {
    return role === "student" ? (
      <Navigate to="/student/landing" replace />
    ) : (
      <Navigate to="/mentor-landing" replace />
    );
  }

  // ✅ Authenticated and correct role → render content
  return children;
};

export default ProtectedRoute;
