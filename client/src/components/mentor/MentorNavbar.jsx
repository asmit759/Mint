// src/components/mentor/MentorNavbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Logo from '../../assets/mintLogo.png';

// Prefer name, then fullName, then first+last; finally show email local-part
const getDisplayName = (u) => {
  if (!u) return 'Mentor';
  if (u.name && u.name.trim()) return u.name;
  if (u.fullName && u.fullName.trim()) return u.fullName;
  const composite = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
  if (composite) return composite;
  const em = u.email || u.email_id || '';
  return em ? em.split('@')[0] : 'Mentor';
};

const MentorNavbar = ({ onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Read user from Redux; component will re-render when auth state changes
  const { user } = useSelector((s) => s.auth); // uses React-Redux hooks best practices
  const name = getDisplayName(user);
  const email = user?.email || user?.email_id || '';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=6366f1&color=fff`;

  const navLinks = [
    { name: 'Dashboard', path: '/mentor-landing' },
    { name: 'Students',  path: '/mentor/student-location' }, // existing route
    { name: 'Sessions',  path: '/mentor/attendance' },       // existing route
    { name: 'Messages',  path: '/mentor/chat' },             // existing route
  ];


  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  };

  const handleLogoutClick = async () => {
    setIsProfileOpen(false);
    if (typeof onLogout === 'function') {
      await onLogout();
    }
  };

  return (
    <nav className="bg-gray-900/30 backdrop-blur-md border-b border-indigo-800/30 shadow-lg shadow-indigo-900/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/mentor-landing" className="flex items-center space-x-3 group">
              <motion.img
                src={Logo}
                alt="MINT Logo"
                className="h-10 w-10 cursor-pointer"
                whileHover={{ scale: 1.05, filter: 'drop-shadow(0 0 15px rgba(99,102,241,.6))' }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-poppins group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-200">
                MINT
              </span>
            </Link>
          </div>

          {/* Desktop links */}
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

          {/* Profile + Mobile button */}
          <div className="flex items-center space-x-4">
            {/* Desktop profile */}
            <div className="hidden md:block relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((v) => !v)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 backdrop-blur-sm transition duration-200 border border-indigo-700/30"
              >
                <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full border-2 border-indigo-500" />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="text-xs text-gray-400">Mentor</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-gray-800/80 backdrop-blur-xl border border-indigo-700/30 rounded-lg shadow-2xl shadow-indigo-900/50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-indigo-700/30">
                      <p className="text-sm font-medium text-white">{name}</p>
                      <p className="text-xs text-gray-400 mt-1">{email}</p>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0M19.428 15.341a8 8 0 10-14.856 0" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </div>
                      </Link>

                      <div className="border-t border-indigo-700/30 my-2"></div>

                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-150"
                        onClick={handleLogoutClick}
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

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm transition duration-200"
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-indigo-800/30 py-4 backdrop-blur-md"
            >
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

              <div className="border-t border-indigo-800/30 pt-4">
                <div className="flex items-center space-x-3 px-4 mb-3">
                  <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full border-2 border-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-gray-400">{email}</p>
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
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-150"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await handleLogoutClick();
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
  );
};

export default MentorNavbar;
