// MentorMail.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer, Bounce } from 'react-toastify'
import { logout } from '../../store/authSlice'
import MentorNavbar from './MentorNavbar'

const MentorMail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [mentorDetails, setMentorDetails] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ✅ FIXED: Removed token redirect - ProtectedRoute handles auth
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          console.warn('No token found')
          return
        }

        const response = await axios.get('http://localhost:4000/mentorRoutes/getMentorDetails', {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        })

        if (response.data.success) {
          setMentorDetails(response.data.mentorDetails)
        }
      } catch (error) {
        console.error('Error fetching mentor details:', error)
        // Don't navigate here - let ProtectedRoute handle auth failures
      }
    }
    fetchMentorDetails()
  }, []) // ✅ Empty dependencies - only run once on mount

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } catch (_) {
      // optional toast
    } finally {
      localStorage.removeItem('token')
      navigate('/login', { replace: true })
    }
  }

  const handleStudentToggle = (email) => {
    setSelectedStudents(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === mentorDetails?.mentees?.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(mentorDetails?.mentees?.map(m => m.email) || [])
    }
  }

  const handleSendMail = async (e) => {
    e.preventDefault()
    
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student', {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      })
      return
    }

    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in all fields', {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:4000/mentorRoutes/sendMailToStudent',
        {
          studentEmailArray: selectedStudents,
          title: title,
          body: body
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        }
      )

      if (response.data.success) {
        toast.success('Email sent successfully!', {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        })
        setSelectedStudents([])
        setTitle('')
        setBody('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email', {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950">
      <MentorNavbar onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            type="button"
            onClick={() => navigate('/mentor-landing')}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-4 transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            Send Email to Students
          </h1>
          <p className="text-gray-400">Compose and send emails to your mentees</p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 border border-indigo-800/30 rounded-2xl shadow-2xl shadow-indigo-900/20 p-8"
        >
          <form onSubmit={handleSendMail} className="space-y-6">
            
            {/* Student Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Select Students ({selectedStudents.length} selected)
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white flex items-center justify-between hover:border-indigo-600 transition duration-200"
                >
                  <span className="text-gray-300">
                    {selectedStudents.length === 0 
                      ? 'Choose students...' 
                      : `${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} selected`
                    }
                  </span>
                  <svg 
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-2 bg-gray-800 border border-indigo-700/50 rounded-lg shadow-2xl shadow-indigo-900/50 overflow-hidden"
                    >
                      {/* Select All Option */}
                      <div
                        onClick={handleSelectAll}
                        className="px-4 py-3 hover:bg-indigo-600/20 cursor-pointer transition duration-150 border-b border-indigo-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition duration-200 ${
                            selectedStudents.length === mentorDetails?.mentees?.length
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-indigo-500'
                          }`}>
                            {selectedStudents.length === mentorDetails?.mentees?.length && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-white font-medium">Select All</span>
                        </div>
                      </div>

                      {/* Student List */}
                      <div className="max-h-64 overflow-y-auto">
                        {mentorDetails?.mentees?.map((student) => (
                          <div
                            key={student._id}
                            onClick={() => handleStudentToggle(student.email)}
                            className="px-4 py-3 hover:bg-indigo-600/20 cursor-pointer transition duration-150"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition duration-200 ${
                                selectedStudents.includes(student.email)
                                  ? 'bg-indigo-600 border-indigo-600'
                                  : 'border-indigo-500'
                              }`}>
                                {selectedStudents.includes(student.email) && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium">{student.name}</p>
                                <p className="text-gray-400 text-sm">{student.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Email Title */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Email Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter email subject"
                className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Email Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here... (HTML supported)"
                rows={10}
                className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
              />
              <p className="text-gray-500 text-xs mt-2">
                Tip: You can use HTML tags like &lt;p&gt;, &lt;b&gt;, &lt;i&gt; for formatting
              </p>
            </div>

            {/* Preview Section */}
            {body && (
              <div className="bg-gray-800 border border-indigo-700/30 rounded-lg p-4">
                <p className="text-indigo-300 text-sm font-medium mb-2">Preview:</p>
                <div 
                  className="text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            )}

            {/* Send Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setSelectedStudents([])
                  setTitle('')
                  setBody('')
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition duration-200 border border-indigo-700/30"
              >
                Clear
              </button>
            </div>
          </form>
        </motion.div>
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

export default MentorMail
