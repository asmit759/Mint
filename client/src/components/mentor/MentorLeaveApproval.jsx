// src/components/mentor/MentorLeaveApproval.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../utils/AxiosCli';
import { mentorLogout } from '../../store/authSlice';
import MentorNavbar from '../mentor/MentorNavbar';


const MentorLeaveApproval = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);

  const [allLeaves, setAllLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return 'N/A';

        // Remove all non-digits
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');

        // Handle optional +91 or 0 prefix
        let digits = cleaned;
        if (digits.startsWith('91') && digits.length === 12) {
            digits = digits.slice(2);
        } else if (digits.startsWith('0') && digits.length === 11) {
            digits = digits.slice(1);
        }

        // Ensure it's 10 digits now
        if (digits.length !== 10) return phoneNumber;

        // Format as +91 XXXXX XXXXX
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    };

  useEffect(() => {
    if (!isAuthenticated || role !== 'mentor') {
      toast.error('Unauthorized access. Please login as mentor.', {
        position: 'top-right',
        autoClose: 3000,
        transition: Bounce,
      });
      navigate('/login');
      return;
    }
    fetchLeaveRequests();
  }, [isAuthenticated, role]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/leave/pending-leaves', getAuthConfig());
      
      // ✅ Updated: Response is now a direct array, not wrapped in an object
      if (Array.isArray(response.data)) {
        setAllLeaves(response.data);
      } else {
        toast.warning('Unexpected response format', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        setAllLeaves([]);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to fetch leave requests', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLeaves = () => {
    switch (activeTab) {
      case 'pending':
        return allLeaves.filter(leave => leave.status === 'Pending' || !leave.mentorApproval);
      case 'approved':
        return allLeaves.filter(leave => leave.status === 'Approved');
      case 'rejected':
        return allLeaves.filter(leave => leave.status === 'Rejected');
      case 'all':
        return allLeaves;
      default:
        return allLeaves;
    }
  };

  const leaveRequests = getFilteredLeaves();

  const calculateDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleLeaveDecision = async (leaveId, decision) => {
    try {
      setProcessingId(leaveId);
      
      const response = await axiosClient.post(
        '/leave/approve-leave-mentor',
        { leaveId, decision },
        getAuthConfig()
      );

      if (response.data.message) {
        toast.success(`Leave ${decision.toLowerCase()} successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        
        // Refresh data after decision
        await fetchLeaveRequests();
      } else {
        toast.warning('Failed to process leave', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error processing leave:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        dispatch(mentorLogout());
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to perform this action.', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to process leave request', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = allLeaves.filter(leave => leave.status === 'Pending' || !leave.mentorApproval).length;
  const approvedCount = allLeaves.filter(leave => leave.status === 'Approved').length;
  const rejectedCount = allLeaves.filter(leave => leave.status === 'Rejected').length;

  if (!isAuthenticated || role !== 'mentor') {
    return null;
  }

  const handleLogout = async () => {
      try {
        await dispatch(mentorLogout()).unwrap();
      } catch {
        dispatch(logout());
      } finally {
        navigate('/login', { replace: true });
      }
    };
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-950 ">
        <MentorNavbar onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent mb-4">
              Leave Approval Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Review and manage student leave requests</p>
            <div className="mt-4 h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-800 inline-flex gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pending
                {pendingCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{pendingCount}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'approved'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approved
                {approvedCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{approvedCount}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'rejected'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rejected
                {rejectedCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{rejectedCount}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                All
                {allLeaves.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{allLeaves.length}</span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-yellow-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-medium mb-1">Pending Requests</p>
                  <h3 className="text-5xl font-bold text-white">{pendingCount}</h3>
                </div>
                <div className="bg-yellow-500/20 rounded-full p-5">
                  <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium mb-1">Approved</p>
                  <h3 className="text-5xl font-bold text-white">{approvedCount}</h3>
                </div>
                <div className="bg-green-500/20 rounded-full p-5">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm font-medium mb-1">Rejected</p>
                  <h3 className="text-5xl font-bold text-white">{rejectedCount}</h3>
                </div>
                <div className="bg-red-500/20 rounded-full p-5">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leave Requests Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="animate-ping rounded-full h-12 w-12 bg-indigo-500/50"></div>
                </div>
              </div>
            </div>
          ) : leaveRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-24"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-16 border border-gray-700/50 shadow-2xl">
                <svg className="w-28 h-28 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-3xl font-bold text-gray-300 mb-3">No {activeTab === 'all' ? '' : activeTab} Requests</h3>
                <p className="text-gray-500 text-lg">
                  {activeTab === 'pending' && 'All leave requests have been reviewed'}
                  {activeTab === 'approved' && 'No approved leaves found'}
                  {activeTab === 'rejected' && 'No rejected leaves found'}
                  {activeTab === 'all' && 'No leave requests available'}
                </p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {leaveRequests.map((leave, index) => {
                  const duration = calculateDuration(leave.fromDate, leave.toDate);
                  const formattedFromDate = formatDate(leave.fromDate);
                  const formattedToDate = formatDate(leave.toDate);
                  
                  // ✅ Updated: Get student details directly from leave object
                  const studentName = leave.studentName || 'Student';
                  const studentEmail = leave.studentEmail || 'N/A';
                  const studentContact = leave.studentParentContact || 'N/A';
                  const studentId = typeof leave.studentId === 'string' ? leave.studentId : leave.studentId?._id;
                  
                  return (
                    <motion.div
                      key={leave._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-lg rounded-3xl p-8 border border-indigo-500/20 hover:border-indigo-500/60 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-2"
                    >
                      {/* Student Header */}
                      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                        <div className="flex items-center space-x-5">
                          <div className="relative">
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl w-16 h-16 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-300">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 rounded-full w-5 h-5 border-2 border-black ${
                              leave.status === 'Approved' ? 'bg-green-500' : 
                              leave.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                              {studentName}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">{studentId}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold border shadow-lg ${
                          leave.status === 'Pending' 
                            ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/40 shadow-yellow-500/20'
                            : leave.status === 'Approved'
                            ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border-green-500/40 shadow-green-500/20'
                            : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500/40 shadow-red-500/20'
                        }`}>
                          {leave.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </div>

                      {/* Student Contact Info */}
                      <div className="space-y-3 mb-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-5 border border-indigo-500/20">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs">Email</p>
                            <p className="text-white text-sm font-medium break-all">{studentEmail}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs">Parent Contact</p>
                            <p className="text-white text-sm font-medium">{formatPhoneNumber(studentContact)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Leave Details */}
                      <div className="space-y-5 mb-8">
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
                          <div className="flex items-center space-x-3 text-gray-400 text-sm mb-3">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Duration</span>
                          </div>
                          <p className="text-white text-lg font-semibold ml-8">
                            {formattedFromDate} → {formattedToDate}
                          </p>
                          <p className="text-indigo-400 text-sm font-medium ml-8 mt-2">
                            📅 {duration} {duration === 1 ? 'day' : 'days'}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
                          <div className="flex items-center space-x-3 text-gray-400 text-sm mb-3">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span className="font-semibold">Reason</span>
                          </div>
                          <p className="text-white text-base ml-8 leading-relaxed">{leave.reason}</p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-gray-400 text-sm">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-semibold">Parent Approval</span>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              leave.parentApproval 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                            }`}>
                              {leave.parentApproval ? '✓ Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {leave.status === 'Approved' && leave.passotp && (
                          <div className="bg-gradient-to-br from-indigo-800/60 to-purple-900/60 backdrop-blur-sm rounded-2xl p-5 border border-indigo-500/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-gray-300 text-sm">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span className="font-semibold">Pass OTP</span>
                              </div>
                              <span className="bg-indigo-500/30 text-indigo-200 px-4 py-1 rounded-lg text-lg font-mono font-bold tracking-wider">
                                {leave.passotp}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {(leave.status === 'Pending' || !leave.mentorApproval) && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleLeaveDecision(leave._id, 'Approved')}
                            disabled={processingId === leave._id}
                            className="flex-1 group/btn relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-3">
                              {processingId === leave._id ? (
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              <span className="text-lg">Approve</span>
                            </div>
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                          </button>

                          <button
                            onClick={() => handleLeaveDecision(leave._id, 'Rejected')}
                            disabled={processingId === leave._id}
                            className="flex-1 group/btn relative bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                          >
                            <div className="relative flex items-center justify-center space-x-3">
                              <svg className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-lg">Reject</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
};

export default MentorLeaveApproval;
