// src/App.jsx
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import Login from './components/Login';
import StudentSignup from './components/StudentSignup';
import StudentLanding from './components/student/Landing';

import MentorSignup from './components/MentorSignup';
import MentorLand from './components/mentor/MentorLand';
import MentorMail from './components/mentor/MentorMail';
import ProtectedRoute from './components/routing/ProtectedRoute';

import SageChat from './components/student/SageChat';
import BandhuChat from './components/student/BandhuChat';

function App() {
  const { isAuthenticated, userType, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    console.log('🔍 App Auth State:', {
      isAuthenticated,
      userType,
      loading,
      currentPath: window.location.pathname
    });
  }, [isAuthenticated, userType, loading]);

  return (
    <Routes>
      {/* Root redirect logic */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            userType === 'student' ? (
              <Navigate to="/student/landing" replace />
            ) : (
              <Navigate to="/mentor-landing" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            userType === 'student' ? (
              <Navigate to="/student/landing" replace />
            ) : (
              <Navigate to="/mentor-landing" replace />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/student/signup"
        element={
          isAuthenticated ? (
            userType === 'student' ? (
              <Navigate to="/student/landing" replace />
            ) : (
              <Navigate to="/mentor-landing" replace />
            )
          ) : (
            <StudentSignup />
          )
        }
      />
      <Route
        path="/mentor/signup"
        element={
          isAuthenticated ? (
            userType === 'mentor' ? (
              <Navigate to="/mentor-landing" replace />
            ) : (
              <Navigate to="/student/landing" replace />
            )
          ) : (
            <MentorSignup />
          )
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student/landing"
        element={
          <ProtectedRoute allow="student">
            <StudentLanding />
          </ProtectedRoute>
        }
      />

      {/* NEW: Student Chatbots */}
      <Route
        path="/kiit-sage"
        element={
          <ProtectedRoute allow="student">
            <SageChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kiit-bandhu"
        element={
          <ProtectedRoute allow="student">
            <BandhuChat />
          </ProtectedRoute>
        }
      />

      {/* Protected Mentor Routes */}
      <Route
        path="/mentor-landing"
        element={
          <ProtectedRoute allow="mentor">
            <MentorLand />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/send-email"
        element={
          <ProtectedRoute allow="mentor">
            <MentorMail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentor/attendance"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Attendance Page - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/leave-applications"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Leave Applications - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/student-location"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Student Location - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/chat"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Messages - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/grievances"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Student Grievances - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            userType === 'student' ? (
              <Navigate to="/student/landing" replace />
            ) : (
              <Navigate to="/mentor-landing" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

export default App;
