// src/components/mentor/MentorLand.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import MentorNavbar from '../mentor/MentorNavbar';
import { BiSolidMessageSquareDetail } from 'react-icons/bi';
import { mentorLogout, logout } from '../../store/authSlice';
import axios from 'axios';

const getMentorName = (u, m) => {
  const name =
    u?.name ||
    m?.name ||
    u?.fullName ||
    [u?.firstName, u?.lastName].filter(Boolean).join(' ');
  if (name && name.trim()) return name;
  const em = u?.email || u?.email_id || m?.email || '';
  return em ? em.split('@')[0] : 'Mentor';
};

const MentorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((s) => s.auth);
  const [mentorDetails, setMentorDetails] = useState(user || null);

  useEffect(() => {
    setMentorDetails(user || null);
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:4000/mentorRoutes/getMentorDetails',
          { withCredentials: true }
        );
        if (data?.success) setMentorDetails(data.mentorDetails);
      } catch {}
    };
    if (role === 'mentor' && user && !user?.contactNumber) fetchDashboardData();
  }, [role, user]);

  const handleLogout = async () => {
    try {
      await dispatch(mentorLogout()).unwrap();
      navigate('/login', { replace: true });
    } catch {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  const dashboardItems = [
    {
      id: 1,
      title: 'Mail Mentees',
      description: 'Send personalized emails and important announcements to your mentees',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      route: '/mentor/send-email',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      size: 'large',
    },
    {
      id: 2,
      title: 'Attendance',
      description: 'Monitor and track mentee attendance records with detailed insights',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      route: '/mentor/attendance',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      size: 'medium',
    },
    {
      id: 3,
      title: 'Leave Applications',
      description: 'Review and approve mentee leave requests efficiently',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      route: '/mentor/leave-applications',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      glowColor: 'rgba(251, 146, 60, 0.4)',
      size: 'medium',
    },
    {
      id: 4,
      title: 'Student Location',
      description: 'View real-time location tracking of your mentees',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      route: '/mentor/student-location',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glowColor: 'rgba(20, 184, 166, 0.4)',
      size: 'small',
    },
    {
      id: 5,
      title: 'Messages',
      description: 'Connect and chat with your mentees in real-time',
      icon: (
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      route: '/mentor/chat',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      size: 'small',
    },
    {
      id: 6,
      title: 'Student Grievances',
      description: 'Address and resolve mentee concerns promptly',
      icon: <BiSolidMessageSquareDetail className="h-14 w-14" />,
      route: '/mentor/grievances',
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      glowColor: 'rgba(147, 51, 234, 0.4)',
      size: 'small',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    },
  };

  const handleNavigation = (route, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate(route);
  };

  const nameToShow = getMentorName(user, mentorDetails);

  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-black to-indigo-700 min-h-screen overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <MentorNavbar onLogout={handleLogout} />
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome back,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
              {nameToShow}
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light">
            Manage your mentees and track their progress seamlessly
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto"
        >
          {dashboardItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleNavigation(item.route, e)}
              className={`
                group relative cursor-pointer rounded-2xl overflow-hidden
                transform transition-all duration-300
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'medium' ? 'md:col-span-1 md:row-span-2' : ''}
                ${item.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
              `}
              style={{
                minHeight:
                  item.size === 'large' ? '420px' :
                  item.size === 'medium' ? '420px' : '200px',
              }}
            >
              {/* Glass morphism background */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 transition-all duration-700 ease-out`}
                />
                <div
                  className="absolute -inset-2 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 ease-out"
                  style={{ background: item.glowColor }}
                />
              </div>

              {/* Content */}
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">
                <div className="flex-1">
                  <div
                    className={`
                      w-16 h-16 mb-6 text-white/80 group-hover:text-white
                      transition-all duration-500 group-hover:scale-125 group-hover:rotate-6
                      ${item.size === 'large' ? 'md:w-20 md:h-20' : ''}
                    `}
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:translate-x-1 transition-all duration-300">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 text-sm md:text-base leading-relaxed group-hover:text-white transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                {/* Arrow button */}
                <div className="flex items-center justify-end mt-6">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 group-hover:translate-x-2 border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>

      <footer className="w-full bg-black text-gray-500 text-center py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">Made with ❤️ by Asmit And Omm</p>
          <nav className="flex gap-4 sm:gap-6">
            <button
              onClick={() => scrollTo('welcome')}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Welcome
            </button>
            <button
              onClick={() => scrollTo('actions')}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Actions
            </button>
            <button
              onClick={() => scrollTo('chatbots')}
              className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Chatbots
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default MentorDashboard;
