// src/components/mentor/StudentLocation.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { BiCurrentLocation } from 'react-icons/bi';
import { mentorLogout, logout } from '../../store/authSlice';

const MentorStudentLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch mentor details and mentees
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const res = await axios.get('http://localhost:4000/mentorRoutes/getMentorDetails', {
          withCredentials: true,
        });
        setMentees(res.data.mentorDetails.mentees || []);
      } catch (err) {
        console.error('Error fetching mentor details:', err);
        setError('Failed to load mentees');
      }
    };
    fetchMentorDetails();
  }, []);

  // Fetch student location
  const handleFetchLocation = async () => {
    if (!selectedEmail) return;
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('https://mint-backend-9mha.onrender.com/location/get-location', {
        params: { studentEmail: selectedEmail },
      });
      
      if (res.data.success) {
        setLocationData(res.data);
      } else {
        setError('Location not available for this student');
        setLocationData(null);
      }
    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Failed to fetch location. Please try again.');
      setLocationData(null);
    } finally {
      setLoading(false);
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

  // Extract coordinates from mapUrl
  const getCoordinates = (mapUrl) => {
    if (!mapUrl) return null;
    const match = mapUrl.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };

  const coordinates = locationData?.mapUrl ? getCoordinates(locationData.mapUrl) : null;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Main Content */}
      <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <HiLocationMarker className="text-3xl text-text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                      Student Location Tracker
                    </h1>
                    <p className="text-indigo-300/70 text-sm mt-1">Track real-time location of your mentees</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-6 shadow-2xl mb-6"
          >
            <label className="flex items-center gap-2 text-indigo-300 font-semibold mb-4 text-sm uppercase tracking-wide">
              <FaUser className="text-indigo-400" />
              Select Student
            </label> 
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <select
                  className="w-full bg-surface/50 border border-indigo-500/30 text-text-primary rounded-xl px-4 py-3.5 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                             hover:border-indigo-400/50 transition-all duration-200 appearance-none cursor-pointer"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                >
                  <option value="" className="bg-surface">-- Select a Mentee --</option>
                  {mentees.map((mentee) => (
                    <option key={mentee._id} value={mentee.email_id} className="bg-surface">
                      {mentee.name} ({mentee.email_id})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleFetchLocation}
                disabled={!selectedEmail || loading}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
                           text-text-primary font-semibold rounded-xl shadow-lg shadow-indigo-500/30
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <BiCurrentLocation className="text-xl" />
                    <span>Track Location</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Location Display */}
          {locationData && coordinates && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >

              {/* Interactive Map Card */}
              <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-500/20 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-indigo-300 uppercase tracking-wide">
                      Live Map View
                    </h3>
                  </div>
                  <a
                    href={locationData.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-indigo-500 text-text-primary rounded-lg transition-colors duration-200 text-sm font-semibold"
                  >
                    <span>Open in Google Maps</span>
                    <FaExternalLinkAlt />
                  </a>
                </div>

                {/* Embedded Google Map */}
                <div className="relative w-full h-[500px] bg-surface">
                  <iframe
    src={locationData.mapUrl.replace('https://www.google.com/maps', 'https://maps.google.com/maps') + '&output=embed'}
    width="100%"
    height="400"
    style={{ border: 0, borderRadius: '10px' }}
    allowFullScreen
    loading="lazy"
  ></iframe>
                  
                  {/* Overlay for styling */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-indigo-500/30 rounded-lg px-4 py-2">
                    <p className="text-text-primary text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Student Location
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 backdrop-blur-xl border border-indigo-400/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-text-primary font-bold mb-2">Location Information</h4>
                    <p className="text-indigo-300 text-sm leading-relaxed">
                      The map above shows the real-time location of the selected student. You can click on "Open in Google Maps" to view detailed directions and nearby landmarks. Location data is updated automatically.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !locationData && selectedEmail && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-12 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiLocationMarker className="text-5xl text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-400 mb-2">No Location Data</h3>
              <p className="text-indigo-300/60">Click "Track Location" to view the student's current position.</p>
            </motion.div>
          )}

          {/* Initial State */}
          {!selectedEmail && !loading && !locationData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-12 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-4xl text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-400 mb-2">Select a Student</h3>
              <p className="text-indigo-300/60">Choose a mentee from the dropdown above to track their location.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorStudentLocation;
