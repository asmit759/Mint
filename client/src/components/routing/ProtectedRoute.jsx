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


  return children;
};

export default ProtectedRoute;
