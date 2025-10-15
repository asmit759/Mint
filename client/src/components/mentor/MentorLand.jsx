// MentorDashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import MentorNavbar from '../mentor/MentorNavbar'
import { BiSolidMessageSquareDetail } from "react-icons/bi";

const MentorDashboard = () => {
  const navigate = useNavigate()
  const [mentorDetails, setMentorDetails] = useState(null)
  const [stats, setStats] = useState({
    totalMentees: 0,
    pendingLeaves: 0,
    unreadMessages: 0,
    activeLocations: 0
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          'http://localhost:4000/mentorRoutes/getMentorDetails',
          {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          }
        )
        if (response.data.success) {
          setMentorDetails(response.data.mentorDetails)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    fetchDashboardData()
  }, [])

  const dashboardItems = [
    {
      id: 1,
      title: 'Mail Mentees',
      description: 'Send emails and announcements to your mentees',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      route: '/mentor/mail-mentees',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glowColor: 'rgba(236, 72, 153, 0.3)',
      size: 'large', // bento style: large tile
    },
    {
      id: 2,
      title: 'Attendance',
      description: 'Monitor and track mentee attendance records',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      route: '/mentor/attendance',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      size: 'medium',
    },
    {
      id: 3,
      title: 'Leave Applications',
      description: 'Review and approve leave requests',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      route: '/mentor/leave-applications',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      glowColor: 'rgba(251, 146, 60, 0.3)',
      size: 'medium',
    },
    {
      id: 4,
      title: 'Student Location',
      description: 'View real-time location of mentees',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      route: '/mentor/student-location',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glowColor: 'rgba(20, 184, 166, 0.3)',
      size: 'small',
    },
    {
      id: 5,
      title: 'Messages',
      description: 'Chat with your mentees in real-time',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      route: '/mentor/chat',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      size: 'small',
    },
    {
      id: 6,
      title: 'Student Grievances',
      description: 'Resolve mentee grievances',
      icon: (
        <BiSolidMessageSquareDetail className='h-14 w-14'/>
      ),
      route: '/mentor/grievances',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      size: 'small',
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const handleNavigation = (route) => {
    navigate(route)
  }

  return (
    
    <div className='bg-gradient-to-br from-gray-800 via-black to-indigo-700 min-h-screen'>
        <MentorNavbar/>
        <div className=" bg-gradient-to-br p-6 md:p-10">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Welcome back, <span className="text-transparent bg-clip-text  bg-purple-400">{mentorDetails?.name || 'Mentor'}</span>
                </h1>
                <p className="text-gray-300 text-lg">Manage your mentees and track their progress</p>
            </motion.div>

            {/* Bento Grid Layout */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl"
            >
                {dashboardItems.map((item) => (
                <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => handleNavigation(item.route)}
                    className={`
                    group relative cursor-pointer rounded-3xl overflow-hidden
                    ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                    ${item.size === 'medium' ? 'md:col-span-1 md:row-span-2' : ''}
                    ${item.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
                    `}
                    style={{
                    minHeight: item.size === 'large' ? '400px' : item.size === 'medium' ? '400px' : '190px'
                    }}
                >
                    {/* Glassmorphism Background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20">
                    {/* Animated Gradient Overlay */}
                    <div 
                        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    />
                    
                    {/* Glow Effect */}
                    <div 
                        className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                        style={{ background: item.glowColor }}
                    />
                    </div>

                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-between">
                    {/* Icon and Title Section */}
                    <div>
                        <div 
                        className={`
                            w-16 h-16 mb-6 text-white/80 group-hover:text-white 
                            transition-all duration-300 group-hover:scale-110
                            ${item.size === 'large' ? 'md:w-24 md:h-24' : ''}
                        `}
                        >
                        {item.icon}
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:[text-shadow:0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300">
                        {item.title}
                        </h3>
                        
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                        {item.description}
                        </p>
                    </div>

                    {/* Stats and Arrow */}
                    <div className="flex items-center justify-between mt-6">
                        
                        
                        <div className="w-40 h-12 rounded-[10rem] bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-1">
                        <svg className="w-2xl h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        </div>
                    </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                </motion.div>
                ))}
            </motion.div>
            </div>
    </div>
    
  )
}

export default MentorDashboard
