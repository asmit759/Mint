// src/components/student/StudentLanding.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiLogOut, FiCalendar, FiAlertTriangle, FiHome, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { studLogout, logout } from '../../store/authSlice';
import mintLogo from '../../assets/mintLogo.png';
import heroImage from '../../assets/git.png';
import kiitBandhuImage from '../../assets/kiitBandhu.png';
import kiitSageImage from '../../assets/kiitSage.png';

const displayName = (user) =>
  user?.name ||
  user?.fullName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
  user?.email ||
  user?.email_id ||
  'User';

const StudentLanding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate for programmatic routing
  const { user } = useSelector((state) => state.auth);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleLogout = async () => {
    try {
      await dispatch(studLogout()).unwrap();
      navigate('/login', { replace: true });
    } catch {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  // NEW: navigation handlers for tiles
  const goToLeaveApply = () => navigate('/leave/apply');      // e.g. student leave form
  const goToGrievanceCampus = () => navigate('/grievance/campus');  // campus grievance
  const goToGrievanceHostel = () => navigate('/grievance/hostel');  // hostel/mess grievance

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-indigo-950 text-white font-poppins">
      <section id="welcome" className="min-h-screen flex flex-col p-6 md:p-8">
        <motion.header variants={containerVariants} initial="hidden" animate="visible" className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <img src={mintLogo} alt="Mint Logo" className="w-16 h-16" />
            <span className="text-3xl font-bold text-indigo-400">MINT</span>
          </motion.div>

          <motion.button
            variants={itemVariants}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-300 rounded-lg hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-indigo-700/50 transition-colors"
          >
            <FiLogOut />
            Logout
          </motion.button>
        </motion.header>

        <div className="flex-grow flex items-center justify-center w-full">
          <motion.main variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div variants={itemVariants} id="actions" className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Welcome to Mint,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500">
                  {displayName(user)}
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-indigo-200 font-light">
                What would you like to do today?
              </p>

              <div className="mt-10 space-y-6">
                {/* Apply for Leave tile now navigates */}
                <motion.button
                  onClick={goToLeaveApply}
                  className="w-full text-left flex items-center gap-4 p-5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:scale-105"
                  whileHover={{ y: -5 }}
                >
                  <FiCalendar className="text-3xl text-white flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Apply for Leave</h3>
                    <p className="text-sm text-indigo-200">Submit a leave request to your mentor for approval.</p>
                  </div>
                </motion.button>

                {/* Grievances section: two navigable tiles */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 font-semibold tracking-wider">RAISE A GRIEVANCE</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <motion.button
                      onClick={goToGrievanceCampus}
                      className="w-full text-left flex items-center gap-3 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-indigo-800/50 hover:border-indigo-700 transition-all duration-300"
                      whileHover={{ y: -3 }}
                    >
                      <FiAlertTriangle className="text-2xl text-indigo-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-300">General Campus</h4>
                        <p className="text-xs text-gray-400">Report campus-related issues.</p>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={goToGrievanceHostel}
                      className="w-full text-left flex items-center gap-3 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800 border border-indigo-800/50 hover:border-indigo-700 transition-all duration-300"
                      whileHover={{ y: -3 }}
                    >
                      <FiHome className="text-2xl text-indigo-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-300">Hostel or Mess</h4>
                        <p className="text-xs text-gray-400">Issues with accommodation or food.</p>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/50 p-6 w-full border border-indigo-800/30">
              <motion.div className="w-full h-auto rounded-xl overflow-hidden mb-6 shadow-lg shadow-black/30" whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}>
                <img src={heroImage} alt="Illustration of mentorship" className="w-full h-full object-cover max-h-[350px]" />
              </motion.div>
              <p className="text-gray-400 leading-relaxed">
                Mint is your dedicated partner in navigating university life.
              </p>
            </motion.div>
          </motion.main>
        </div>
      </section>

      {/* Chatbots section unchanged */}
      <section id="chatbots" className="py-20 px-6 md:px-8">
        <motion.div className="w-full max-w-5xl mx-auto" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Meet Your AI Companions
            </h2>
            <p className="mt-3 text-lg text-indigo-200 font-light">Get instant help and support, anytime you need it.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/kiit-bandhu">
              <motion.div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/50 p-8 w-full border border-indigo-800/30 flex items-center gap-6 transition-all duration-300 hover:border-indigo-600 hover:shadow-indigo-700/60" whileHover={{ y: -10, scale: 1.03 }}>
                <img src={kiitBandhuImage} alt="KIIT Bandhu" className="w-24 h-24 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    Kiit Bandhu <FiMessageSquare className="text-indigo-400" />
                  </h3>
                  <p className="mt-2 text-gray-400">Your go-to guide for university rules, academic queries, and campus info.</p>
                </div>
              </motion.div>
            </Link>

            <Link to="/kiit-sage">
              <motion.div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/50 p-8 w-full border border-indigo-800/30 flex items-center gap-6 transition-all duration-300 hover:border-indigo-600 hover:shadow-indigo-700/60" whileHover={{ y: -10, scale: 1.03 }}>
                <img src={kiitSageImage} alt="KIIT Sage" className="w-24 h-24 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    Kiit Sage <FiHeart className="text-pink-400" />
                  </h3>
                  <p className="mt-2 text-gray-400">A compassionate companion for mental wellness and confidential support.</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="w-full bg-black text-gray-500 text-center py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">Made with ❤️ by Asmit And Omm</p>
          <nav className="flex gap-4 sm:gap-6">
            <button onClick={() => scrollTo('welcome')} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Welcome</button>
            <button onClick={() => scrollTo('actions')} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Actions</button>
            <button onClick={() => scrollTo('chatbots')} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">Chatbots</button>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default StudentLanding;
