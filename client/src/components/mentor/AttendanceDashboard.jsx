// AttendanceDashboard.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer, Bounce } from 'react-toastify'

const AttendanceDashboard = () => {
  const navigate = useNavigate()
  const [attendanceData, setAttendanceData] = useState(null)
  const [mentorDetails, setMentorDetails] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState(0)
  const [selectedYear, setSelectedYear] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Fetch mentor details and mentees
  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:4000/mentorRoutes/getMentorDetails',
          {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          }
        )

        console.log('Mentor Details:', response.data)

        if (response.data.success) {
          setMentorDetails(response.data.mentorDetails)
          // Set first student as default if available
          if (response.data.mentorDetails?.mentees?.length > 0) {
            setSelectedStudent(response.data.mentorDetails.mentees[0])
          }
        }
      } catch (error) {
        console.error('Error fetching mentor details:', error)
        toast.error('Failed to load mentor details', {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        })
      }
    }
    fetchMentorDetails()
  }, [])

  // Fetch attendance data when student is selected
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedStudent) return

      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `http://localhost:4000/mentorRoutes/uploadAttendance?studentId=${selectedStudent._id}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          }
        )

        console.log('Attendance Data:', response.data)

        if (response.data.success) {
          setAttendanceData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching attendance:', error)
        toast.error('Failed to load attendance data', {
          position: "top-center",
          theme: "dark",
          transition: Bounce,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchAttendance()
  }, [selectedStudent])

  // Handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student)
    setIsDropdownOpen(false)
    setSelectedSemester(0)
    setSelectedYear(0)
  }

  // Calculate overall attendance percentage
  const calculateOverallPercentage = (subjects) => {
    if (!subjects || subjects.length === 0) return 0
    const total = subjects.reduce((sum, subject) => sum + subject.percentage, 0)
    return (total / subjects.length).toFixed(1)
  }

  // Get color based on percentage
  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 75) return 'text-yellow-400'
    if (percentage >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'stroke-green-500'
    if (percentage >= 75) return 'stroke-yellow-500'
    if (percentage >= 60) return 'stroke-orange-500'
    return 'stroke-red-500'
  }

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = (size - 10) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${getProgressColor(percentage)} transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getPercentageColor(percentage)}`}>
            {percentage}%
          </span>
          <span className="text-xs text-gray-400">Overall</span>
        </div>
      </div>
    )
  }

  if (loading && !attendanceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400 text-lg">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  const currentYearData = attendanceData?.attendance?.[selectedYear]
  const currentSemesterData = currentYearData?.semesters?.[selectedSemester]

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
          {/* Top Bar with Email Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Attendance Dashboard
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mentor/send-email')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg shadow-indigo-500/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </motion.button>
          </div>

          {/* Student Dropdown and Info */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex-1 w-full lg:w-auto">
              {/* Student Selector Dropdown */}
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Select Student
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full lg:w-96 px-4 py-3 bg-gray-900 border border-indigo-700/50 rounded-lg text-white flex items-center justify-between hover:border-indigo-600 transition duration-200"
                >
                  {selectedStudent ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedStudent.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{selectedStudent.name}</p>
                        <p className="text-sm text-gray-400">{selectedStudent.email}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Select a student...</span>
                  )}
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
                      className="absolute z-10 w-full mt-2 bg-gray-900 border border-indigo-700/50 rounded-lg shadow-2xl shadow-indigo-900/50 overflow-hidden"
                    >
                      <div className="max-h-80 overflow-y-auto">
                        {mentorDetails?.mentees?.length > 0 ? (
                          mentorDetails.mentees.map((student) => (
                            <div
                              key={student._id}
                              onClick={() => handleStudentSelect(student)}
                              className={`px-4 py-3 hover:bg-indigo-600/20 cursor-pointer transition duration-150 ${
                                selectedStudent?._id === student._id ? 'bg-indigo-600/30' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {student.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{student.name}</p>
                                  <p className="text-gray-400 text-sm">{student.email}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-gray-400 text-center">
                            No students found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Overall Progress Circle */}
            {attendanceData && (
              <CircularProgress 
                percentage={parseFloat(calculateOverallPercentage(currentSemesterData?.subjects))} 
              />
            )}
          </div>

          {/* Course and Year Info */}
          {attendanceData && (
            <p className="text-gray-400 mb-4">
              {attendanceData.course} • Academic Year {currentYearData?.year}
            </p>
          )}

          {/* Semester Tabs */}
          {currentYearData?.semesters && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {currentYearData.semesters.map((semester, index) => (
                <motion.button
                  key={semester._id}
                  onClick={() => setSelectedSemester(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                    selectedSemester === index
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-indigo-700/30'
                  }`}
                >
                  {semester.semester} Semester
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* No Data Message */}
        {!attendanceData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-indigo-800/30 rounded-xl p-12 text-center"
          >
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-400 mb-2">No Attendance Data Available</h3>
            <p className="text-gray-500">Select a student to view their attendance records</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        {attendanceData && currentSemesterData && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              {/* Total Subjects */}
              <div className="bg-gray-900 border border-indigo-800/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Subjects</p>
                    <p className="text-3xl font-bold text-white">{currentSemesterData.subjects?.length || 0}</p>
                  </div>
                  <div className="bg-indigo-600/20 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Classes */}
              <div className="bg-gray-900 border border-indigo-800/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Classes</p>
                    <p className="text-3xl font-bold text-white">
                      {currentSemesterData.subjects?.reduce((sum, s) => sum + s.totalDays, 0) || 0}
                    </p>
                  </div>
                  <div className="bg-blue-600/20 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Present */}
              <div className="bg-gray-900 border border-indigo-800/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Present</p>
                    <p className="text-3xl font-bold text-green-400">
                      {currentSemesterData.subjects?.reduce((sum, s) => sum + s.present, 0) || 0}
                    </p>
                  </div>
                  <div className="bg-green-600/20 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Absent */}
              <div className="bg-gray-900 border border-indigo-800/30 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Absent</p>
                    <p className="text-3xl font-bold text-red-400">
                      {currentSemesterData.subjects?.reduce((sum, s) => sum + s.absent, 0) || 0}
                    </p>
                  </div>
                  <div className="bg-red-600/20 p-3 rounded-lg">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subject Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <AnimatePresence mode="wait">
                {currentSemesterData.subjects?.map((subject, index) => (
                  <motion.div
                    key={subject._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-gray-900 border border-indigo-800/30 rounded-xl p-6 shadow-xl shadow-indigo-900/10 hover:shadow-indigo-900/30 transition-all duration-300"
                  >
                    {/* Subject Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{subject.subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {subject.facultyName}
                        </div>
                        <p className="text-xs text-gray-500">ID: {subject.facultyId}</p>
                      </div>
                      
                      {/* Percentage Badge */}
                      <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                        subject.percentage >= 90 ? 'bg-green-600/20 text-green-400' :
                        subject.percentage >= 75 ? 'bg-yellow-600/20 text-yellow-400' :
                        subject.percentage >= 60 ? 'bg-orange-600/20 text-orange-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {subject.percentage}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            subject.percentage >= 90 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                            subject.percentage >= 75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                            subject.percentage >= 60 ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                            'bg-gradient-to-r from-red-600 to-red-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-400">{subject.totalDays}</p>
                        <p className="text-xs text-gray-500 mt-1">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{subject.present}</p>
                        <p className="text-xs text-gray-500 mt-1">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{subject.absent}</p>
                        <p className="text-xs text-gray-500 mt-1">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{subject.excuses}</p>
                        <p className="text-xs text-gray-500 mt-1">Excused</p>
                      </div>
                    </div>

                    {/* Warning Message */}
                    {subject.percentage < 75 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 bg-red-900/20 border border-red-700/30 rounded-lg p-3 flex items-start gap-2"
                      >
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xs text-red-400">
                          Attendance below required 75%. Need {Math.ceil((0.75 * (subject.totalDays + 1) - subject.present))} more classes to reach 75%.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
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

export default AttendanceDashboard
