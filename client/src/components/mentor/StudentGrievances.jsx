// src/components/mentor/StudentGrievances.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  BiSolidMessageSquareDetail, 
  BiUser, 
  BiTime, 
  BiCheckCircle, 
  BiXCircle 
} from 'react-icons/bi';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { HiExclamationCircle } from 'react-icons/hi';
import { mentorLogout, logout } from '../../store/authSlice';
import axiosClient from '../../utils/AxiosCli';

const StudentGrievances = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [response, setResponse] = useState('');
  const [resolving, setResolving] = useState(false);
  const [filter, setFilter] = useState('all');

  // Get auth config helper
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Check authentication on mount
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
    fetchGrievances();
  }, [isAuthenticated, role]);

  // Fetch all grievances
  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/mentorRoutes/viewAll', getAuthConfig());
      
      if (res.data && Array.isArray(res.data.grievances)) {
        setGrievances(res.data.grievances);
      } else {
        setGrievances([]);
        toast.warning('No grievances found', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error('Error fetching grievances:', err);
      
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to fetch grievances', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Resolve grievance
  const handleResolve = async () => {
    if (!selectedGrievance || !response.trim()) {
      toast.warning('Please enter a response', {
        position: 'top-right',
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }
    
    try {
      setResolving(true);
      await axiosClient.post(
        '/mentorRoutes/resolve',
        {
          grievanceId: selectedGrievance._id,
          response: response,
        },
        getAuthConfig()
      );
      
      // Update local state
      setGrievances(prev =>
        prev.map(g =>
          g._id === selectedGrievance._id
            ? { ...g, resolved: true, response: response }
            : g
        )
      );
      
      toast.success('Grievance resolved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        transition: Bounce,
      });
      
      setSelectedGrievance(null);
      setResponse('');
    } catch (err) {
      console.error('Error resolving grievance:', err);
      
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
        dispatch(mentorLogout());
        navigate('/login');
      } else {
        toast.error('Failed to resolve grievance', {
          position: 'top-right',
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } finally {
      setResolving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(mentorLogout()).unwrap();
    } catch {
      dispatch(logout());
    } finally {
      navigate('/login', { replace: true });
    }
  };

  // Filter grievances
  const filteredGrievances = grievances.filter(g => {
    if (filter === 'resolved') return g.resolved;
    if (filter === 'unresolved') return !g.resolved;
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (!isAuthenticated || role !== 'mentor') {
    return null;
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BiSolidMessageSquareDetail className="text-2xl sm:text-3xl text-text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                          Student Grievances
                        </h1>
                        <p className="text-indigo-300/70 text-xs sm:text-sm mt-1">
                          Manage and resolve student concerns
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 sm:gap-4">
                      <div className="bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-lg px-3 sm:px-4 py-2">
                        <p className="text-xs text-indigo-300 uppercase tracking-wide">Total</p>
                        <p className="text-xl sm:text-2xl font-bold text-text-primary">{grievances.length}</p>
                      </div>
                      <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2">
                        <p className="text-xs text-amber-300 uppercase tracking-wide">Pending</p>
                        <p className="text-xl sm:text-2xl font-bold text-text-primary">
                          {grievances.filter(g => !g.resolved).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-xl p-2 inline-flex gap-2 overflow-x-auto"
            >
              {['all', 'unresolved', 'resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap ${
                    filter === f
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-text-primary shadow-lg'
                      : 'text-indigo-300 hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
              ))}
            </motion.div>

            {/* Grievances Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FaSpinner className="text-4xl sm:text-5xl text-indigo-400 animate-spin" />
              </div>
            ) : filteredGrievances.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 sm:p-12 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiExclamationCircle className="text-4xl sm:text-5xl text-indigo-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-indigo-400 mb-2">No Grievances Found</h3>
                <p className="text-sm sm:text-base text-indigo-300/60">
                  {filter === 'all'
                    ? 'No grievances have been submitted yet.'
                    : `No ${filter} grievances at the moment.`}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredGrievances.map((grievance, index) => (
                  <motion.div
                    key={grievance._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-400/40 transition-all duration-300"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                      {grievance.resolved ? (
                        <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2 sm:px-3 py-1">
                          <BiCheckCircle className="text-emerald-400 text-sm sm:text-base" />
                          <span className="text-xs font-semibold text-emerald-400 uppercase">
                            Resolved
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-2 sm:px-3 py-1">
                          <BiXCircle className="text-amber-400 text-sm sm:text-base" />
                          <span className="text-xs font-semibold text-amber-400 uppercase">
                            Pending
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Student Info */}
                      <div className="flex items-start gap-3 sm:gap-4 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <BiUser className="text-xl sm:text-2xl text-text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1 truncate">
                            {grievance.student?.name || 'Unknown Student'}
                          </h3>
                          <p className="text-xs sm:text-sm text-indigo-300 truncate">
                            {grievance.student?.email_id || 'N/A'}
                          </p>
                          <p className="text-xs text-indigo-400 mt-1">
                            Roll No: {grievance.student?.roll_no || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-3 sm:p-4 mb-4">
                        <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                          {grievance.message || 'No message provided'}
                        </p>
                      </div>

                      {/* Response if resolved */}
                      {grievance.resolved && grievance.response && (
                        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-3 sm:p-4 mb-4">
                          <p className="text-xs text-emerald-400 font-semibold uppercase mb-2">
                            Mentor Response
                          </p>
                          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                            {grievance.response}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-indigo-500/10">
                        <div className="flex items-center gap-2 text-indigo-400 text-xs">
                          <BiTime />
                          <span>{formatDate(grievance.createdAt)}</span>
                        </div>

                        {!grievance.resolved && (
                          <button
                            onClick={() => setSelectedGrievance(grievance)}
                            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-text-primary text-xs sm:text-sm font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resolve Modal */}
        <AnimatePresence>
          {selectedGrievance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedGrievance(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-black border border-indigo-500/30 rounded-2xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FaPaperPlane className="text-text-primary text-sm sm:text-base" />
                    </div>
                    Resolve Grievance
                  </h2>
                  <button
                    onClick={() => setSelectedGrievance(null)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 flex items-center justify-center transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Student Info */}
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-3 sm:p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <BiUser className="text-text-primary text-sm sm:text-base" />
                    </div>
                    <div>
                      <p className="text-text-primary font-semibold text-sm sm:text-base">{selectedGrievance.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-indigo-400">{selectedGrievance.student?.email_id || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-200">{selectedGrievance.message}</p>
                </div>

                {/* Response Input */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-indigo-300 font-semibold mb-2 text-xs sm:text-sm uppercase tracking-wide">
                    Your Response
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your response to resolve this grievance..."
                    rows={5}
                    className="w-full bg-surface/50 border border-indigo-500/30 text-text-primary text-sm sm:text-base rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSelectedGrievance(null)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-text-primary text-sm sm:text-base font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolve}
                    disabled={!response.trim() || resolving}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-text-primary text-sm sm:text-base font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {resolving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Resolving...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Response</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StudentGrievances;
