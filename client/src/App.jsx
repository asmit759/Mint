// src/App.jsx
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import Login from './components/Login';
import StudentSignup from './components/StudentSignup';
// IMPORTANT: ensure this import points to the real file
import StudentLanding from './components/student/Landing';

import MentorSignup from './components/MentorSignup';
import MentorLand from './components/mentor/MentorLand';
import MentorMail from './components/mentor/MentorMail';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AttendanceDashboard from './components/mentor/AttendanceDashboard';
import MentorStudentLocation from './components/mentor/MentorStudentLocation';

import SageChat from './components/student/SageChat';
import BandhuChat from './components/student/BandhuChat';

// Auth checks
import { studCheckAuth, mentorCheckAuth } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, loading } = useSelector((s) => s.auth);

  // Sequential auth check to prevent role race conditions
  useEffect(() => {
    (async () => {
      try {
        await dispatch(mentorCheckAuth()).unwrap();
      } catch {
        try {
          await dispatch(studCheckAuth()).unwrap();
        } catch {
          // both failed → remain unauthenticated
        }
      }
    })();
  }, [dispatch]);

  // Optional debug
  useEffect(() => {
    console.log('🔍 App Auth State:', {
      isAuthenticated,
      role,
      loading,
      currentPath: window.location.pathname,
    });
  }, [isAuthenticated, role, loading]);

  return (
    <Routes>
      {/* Root redirect logic stays role-based */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            role === 'student' ? (
              <Navigate to="/student/landing" replace />
            ) : (
              <Navigate to="/mentor-landing" replace />
            )
          ) : (
            <Login />
          )
        }
      />

      {/* Auth Routes: ALWAYS render these, even if already authenticated */}
      <Route path="/login" element={<Login />} />
      <Route path="/student/signup" element={<StudentSignup />} />
      <Route path="/mentor/signup" element={<MentorSignup />} />

      {/* Protected Student Routes */}
      <Route
        path="/student/landing"
        element={
          <ProtectedRoute allow="student">
            <StudentLanding />
          </ProtectedRoute>
        }
      />

      {/* Student Chatbots */}
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
              <AttendanceDashboard />
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
              <MentorStudentLocation />
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

      {/* Extra mentor links */}
      <Route
        path="/mentor/students"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Students - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/sessions"
        element={
          <ProtectedRoute allow="mentor">
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-indigo-700 text-white p-8">
              <h1 className="text-3xl font-bold">Sessions - Coming Soon</h1>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/messages"
        element={
          <ProtectedRoute allow="mentor">
            <Navigate to="/mentor/chat" replace />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            role === 'student' ? (
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
