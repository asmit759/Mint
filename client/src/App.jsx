// src/App.jsx
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages/Components
import Login from './components/Login';
import StudentSignup from './components/StudentSignup';
import StudentLanding from './components/student/Landing';
import MentorSignup from './components/MentorSignup';
import MentorNavbar from './components/mentor/MentorNavbar';
import MentorLand from './components/mentor/MentorLand';
import ProtectedRoute from './components/routing/ProtectedRoute';

function App() {
  const { isAuthenticated, userType } = useSelector((s) => s.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated
              ? (userType === 'student' ? <Navigate to="/student/landing" /> : <Navigate to="/mentor-landing" />)
              : <Login />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? (userType === 'student' ? <Navigate to="/student/landing" /> : <Navigate to="/mentor-landing" />)
              : <Login />
          }
        />
        <Route
          path="/student/signup"
          element={isAuthenticated ? <Navigate to="/student/landing" /> : <StudentSignup />}
        />
        <Route
          path="/mentor/signup"
          element={isAuthenticated ? <Navigate to="/mentor-landing" /> : <MentorSignup />}
        />

        {/* Protected: Student */}
        <Route
          path="/student/landing"
          element={
            <ProtectedRoute allow="student">
              <StudentLanding />
            </ProtectedRoute>
          }
        />

        {/* Protected: Mentor */}
        <Route
          path="/mentor-landing"
          element={
            <ProtectedRoute allow="mentor">
              <>
                {/* <MentorNavbar /> */}
                <MentorLand />
              </>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
