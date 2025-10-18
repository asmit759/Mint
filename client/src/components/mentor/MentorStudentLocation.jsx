// MentorStudentLocation.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast, ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MentorStudentLocation = () => {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch location data
  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        'http://localhost:4000/location/mentor-student',
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        }
      )

      console.log('Location Data:', response.data)
      
      if (response.data.success) {
        setLocations(response.data.data)
        if (response.data.data.length > 0 && !selectedStudent) {
          setSelectedStudent(response.data.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast.error('Failed to load location data', {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLocations()
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLocations()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLocations()
  }

  // Convert coordinates to Google Maps embed URL
  const getEmbedUrl = (latitude, longitude) => {
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}&zoom=15`
  }

  // Get regular Google Maps URL
  const getMapUrl = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now - then
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400 text-lg">Loading location data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                Student Location Tracker
              </h1>
              <p className="text-gray-400">Real-time location monitoring for your mentees</p>
            </div>
            
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg shadow-indigo-500/50 disabled:opacity-50"
            >
              <svg 
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* No Data Message */}
        {locations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-indigo-800/30 rounded-xl p-12 text-center"
          >
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Location Data Available</h3>
            <p className="text-gray-500">Students haven't shared their locations yet</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Students List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-gray-900 border border-indigo-800/30 rounded-xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Students ({locations.length})
                </h2>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {locations.map((student) => (
                    <motion.div
                      key={student._id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedStudent?._id === student._id
                          ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-2 border-indigo-500'
                          : 'bg-gray-800 border border-indigo-700/30 hover:border-indigo-600/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {student.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{student.name || 'Student'}</h3>
                          <p className="text-gray-400 text-sm truncate">{student.email}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(student.lastKnownLocation?.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Map and Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <AnimatePresence mode="wait">
                {selectedStudent && (
                  <motion.div
                    key={selectedStudent._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Student Info Card */}
                    <div className="bg-gray-900 border border-indigo-800/30 rounded-xl shadow-xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                            {selectedStudent.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">{selectedStudent.name || 'Student'}</h2>
                            <p className="text-gray-400">{selectedStudent.email}</p>
                          </div>
                        </div>
                        
                        {/* Open in Google Maps Button */}
                        <a
                          href={getMapUrl(
                            selectedStudent.lastKnownLocation?.latitude,
                            selectedStudent.lastKnownLocation?.longitude
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open in Maps
                        </a>
                      </div>

                      {/* Location Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 border border-indigo-700/30 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">Latitude</p>
                          <p className="text-white font-mono font-semibold">
                            {selectedStudent.lastKnownLocation?.latitude?.toFixed(6) || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-800 border border-indigo-700/30 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">Longitude</p>
                          <p className="text-white font-mono font-semibold">
                            {selectedStudent.lastKnownLocation?.longitude?.toFixed(6) || 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-800 border border-indigo-700/30 rounded-lg p-4">
                          <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                          <p className="text-white font-semibold text-sm">
                            {formatTime(selectedStudent.lastKnownLocation?.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Embedded Map */}
                    <div className="bg-gray-900 border border-indigo-800/30 rounded-xl shadow-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-700/30 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Location Map
                        </h3>
                      </div>
                      
                      {/* Responsive Map Container */}
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://www.google.com/maps?q=${selectedStudent.lastKnownLocation?.latitude},${selectedStudent.lastKnownLocation?.longitude}&z=15&output=embed`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Student Location Map"
                        />
                      </div>

                      {/* Map URL Display */}
                      <div className="bg-gray-800 border-t border-indigo-700/30 p-4">
                        <p className="text-gray-400 text-sm mb-2">Google Maps URL:</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={getMapUrl(
                              selectedStudent.lastKnownLocation?.latitude,
                              selectedStudent.lastKnownLocation?.longitude
                            )}
                            className="flex-1 px-4 py-2 bg-gray-900 border border-indigo-700/50 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getMapUrl(
                                selectedStudent.lastKnownLocation?.latitude,
                                selectedStudent.lastKnownLocation?.longitude
                              ))
                              toast.success('URL copied to clipboard!', {
                                position: "top-center",
                                theme: "dark",
                                transition: Bounce,
                              })
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default MentorStudentLocation
