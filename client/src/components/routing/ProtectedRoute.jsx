import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute Component
 * @param {string} allow - "student" or "mentor"
 * @param {ReactNode} children - The component to render if allowed
 */
const ProtectedRoute = ({ allow, children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allow && role !== allow) {
    if (role === "student") {
      return <Navigate to="/student/landing" replace />;
    } else if (role === "mentor") {
      return <Navigate to="/mentor-landing" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
