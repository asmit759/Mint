// MentorNavbar.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from "../../assets/mintLogo.png"

const MentorNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock user data - replace with actual user data from your auth context
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff"
  }

  const navLinks = [
    { name: 'Dashboard', path: '/mentor/dashboard' },
    { name: 'Students', path: '/mentor/students' },
    { name: 'Sessions', path: '/mentor/sessions' },
    { name: 'Messages', path: '/mentor/messages' },
  ]

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  }
  

  return (
    <nav className="bg-gray-900 border-b border-indigo-800/30 shadow-lg shadow-indigo-900/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/mentor/dashboard" className="flex items-center space-x-3 group">
              <motion.img
                src={Logo}
                alt="MINT Logo"
                className="h-12 w-12 cursor-pointer scale-180"
                whileHover={{
                  scale: 1.05,
                  filter: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))"
                }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-poppins group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-200">
                MINT 
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-indigo-600/20 rounded-lg transition duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            
            {/* Desktop User Profile Dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 border border-indigo-700/30"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border-2 border-indigo-500"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">Mentor</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-gray-800 border border-indigo-700/30 rounded-lg shadow-2xl shadow-indigo-900/50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-indigo-700/30">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/mentor/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </div>
                      </Link>
                      
                      <Link
                        to="/mentor/settings"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition duration-150"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </div>
                      </Link>

                      <div className="border-t border-indigo-700/30 my-2"></div>
                      
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-150"
                        onClick={() => {
                          setIsProfileOpen(false)
                          // Add logout logic here
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-indigo-800/30 py-4"
            >
              {/* Mobile Nav Links */}
              <div className="space-y-1 mb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-indigo-600/20 rounded-lg transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Profile */}
              <div className="border-t border-indigo-800/30 pt-4">
                <div className="flex items-center space-x-3 px-4 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-indigo-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  to="/mentor/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition duration-150"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                
                <Link
                  to="/mentor/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white transition duration-150"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-150"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    // Add logout logic here
                  }}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default MentorNavbar
