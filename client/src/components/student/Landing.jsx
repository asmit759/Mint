import React from 'react';
import { motion } from 'framer-motion';
import { FiLogOut, FiCalendar, FiAlertTriangle, FiHome, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { MdShareLocation } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { studLogout, logout } from '../../store/authSlice';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import axiosClient from '../../utils/AxiosCli';
import 'react-toastify/dist/ReactToastify.css';

import mintLogo from '../../assets/mintLogo.png';
import heroVideo from '../../assets/Git.mp4';

import kiitBandhuImage from '../../assets/KiitBandhu.png';
import kiitSageImage from '../../assets/KiitSage.png';
import ThemeToggle from '../ThemeToggle';

const displayName = (user) =>
  user?.name ||
  user?.fullName ||
  [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
  user?.email ||
  user?.email_id ||
  'User';

const StudentLanding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [sharingLoc, setSharingLoc] = React.useState(false);

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

  const goToLeaveApply = () => navigate('/leave/apply');
  const goToGrievanceCampus = () => navigate('/grievance/campus');
  const goToGrievanceHostel = () => navigate('/grievance/hostel');

  const shareLocation = React.useCallback(() => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation not supported on this browser.', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    setSharingLoc(true);

    const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords || {};
        try {
          await axiosClient.post('/location/share-location', { latitude, longitude }, { withCredentials: true });
          toast.success('Location shared successfully.', { position: 'top-center', theme: 'dark', transition: Bounce });
        } catch (err) {
          const msg = err?.response?.data?.message || err?.response?.data?.error || 'Failed to share location.';
          toast.error(msg, { position: 'top-center', theme: 'dark', transition: Bounce });
        } finally {
          setSharingLoc(false);
        }
      },
      (error) => {
        const map = { 1: 'Permission denied. Please allow location access.', 2: 'Position unavailable. Try again outdoors or check GPS.', 3: 'Location request timed out. Please try again.' };
        toast.error(map[error?.code] || error?.message || 'Unable to get location.', { position: 'top-center', theme: 'dark', transition: Bounce });
        setSharingLoc(false);
      },
      options
    );
  }, []);

  return (
    <div className="bg-background text-text-primary font-poppins transition-colors duration-300">
      <section id="welcome" className="min-h-screen flex flex-col p-6 md:p-8">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-between items-center w-full max-w-7xl mx-auto mb-10"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4 relative">
            <div className="flex flex-col items-start">
              <img src={mintLogo} alt="Mint Logo" className="w-16 h-16" />
            </div>
            <span className="text-3xl font-bold text-primary">MINT</span>
          </motion.div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <motion.button
              variants={itemVariants}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              <FiLogOut />
              Logout
            </motion.button>
          </div>
        </motion.header>

        <div className="flex-grow flex items-center justify-center w-full">
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center"
          >
            <motion.div variants={itemVariants} id="actions" className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-text-primary">
                Welcome to Mint,{' '}
                <span className="text-primary">
                  {displayName(user)}
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-text-secondary font-light">What would you like to do today?</p>

              
              <div className="mt-6 space-y-7">
                <motion.button
                  onClick={goToLeaveApply}
                  className="group relative w-full text-left flex items-center gap-4 p-6 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/25 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,.15)]"
                  whileHover={{ y: -5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 bg-gradient-to-br from-indigo-400/25 via-purple-400/20 to-indigo-600/25" />
                  <FiCalendar className="relative z-[1] text-3xl text-text-primary/90" />
                  <div className="relative z-[1]">
                    <h3 className="text-lg font-semibold text-text-primary">Apply for Leave</h3>
                    <p className="text-sm text-indigo-200/90">Submit a leave request to your mentor for approval.</p>
                  </div>
                </motion.button>
                <div className="space-y-5">
                  <p className="text-sm text-text-secondary font-semibold tracking-wider">RAISE A GRIEVANCE</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <motion.button
                      onClick={goToGrievanceCampus}
                      className="group relative w-full text-left flex items-center gap-4 p-5 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/25 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,.15)]"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 bg-gradient-to-tr from-indigo-400/25 to-transparent" />
                      <FiAlertTriangle className="relative z-[1] text-2xl text-indigo-300" />
                      <div className="relative z-[1]">
                        <h4 className="font-semibold text-indigo-300">General Campus</h4>
                        <p className="text-xs text-text-secondary/90">Report campus-related issues.</p>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={goToGrievanceHostel}
                      className="group relative w-full text-left flex items-center gap-4 p-5 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/25 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,.15)]"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 bg-gradient-to-tr from-cyan-400/20 to-transparent" />
                      <FiHome className="relative z-[1] text-2xl text-indigo-300" />
                      <div className="relative z-[1]">
                        <h4 className="font-semibold text-indigo-300">Hostel or Mess</h4>
                        <p className="text-xs text-text-secondary/90">Issues with accommodation or food.</p>
                      </div>
                    </motion.button>

                    {/* Share Location */}
                    <motion.button
                      onClick={shareLocation}
                      disabled={sharingLoc}
                      className="group sm:col-span-2 relative w-full flex items-center gap-5 p-5 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/25 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 disabled:opacity-60 shadow-[inset_0_1px_0_0_rgba(255,255,255,.15)]"
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 bg-gradient-to-br from-red-400/25 via-orange-400/20 to-transparent" />
                      <span className="relative z-[1] inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-red-400 to-orange-500 ring-2 ring-red-300/40 shadow-lg shadow-red-900/20">
                        <MdShareLocation className="w-6 h-6 text-text-primary drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" />
                      </span>
                      <div className="relative z-[1] text-left">
                        <h4 className="font-semibold tracking-wide">Share location</h4>
                        <p className="text-xs text-red-100/90">
                          {sharingLoc ? 'Sharing current location...' : 'Update your current coordinates for your mentor.'}
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            
            <motion.div
              variants={itemVariants}
              className="bg-surface rounded-2xl shadow-xl p-6 w-full border border-border"
            >
              <motion.div
                className="w-full rounded-xl overflow-hidden mb-6 shadow-lg shadow-black/30 aspect-video"
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <video
                  className="w-full h-full object-cover"
                  src={heroVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </motion.div>
              <p className="text-text-secondary leading-relaxed">
                Mint is your dedicated partner in navigating university life. We connect you with experienced mentors and provide a suite of tools for academic support, grievance resolution, and personal well-being.
              </p>
            </motion.div>
          </motion.main>
        </div>
      </section>

      
      <section id="chatbots" className="py-20 px-6 md:px-8">
        <motion.div
          className="w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary">
              Meet Your AI Companions
            </h2>
            <p className="mt-3 text-lg text-text-secondary font-light">Get instant help and support, anytime you need it.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/kiit-bandhu">
              <motion.div
                className="group relative rounded-2xl p-9 w-full border border-white/25 bg-white/8 backdrop-blur-xl backdrop-saturate-150 flex items-center gap-7 transition-all duration-300 hover:bg-white/12"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <span className="pointer-events-none absolute -inset-1 rounded-3xl opacity-30 group-hover:opacity-60 blur-2xl transition-opacity duration-700 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
                <img src={kiitBandhuImage} alt="KIIT Bandhu" className="w-24 h-24 flex-shrink-0 relative z-[1]" />
                <div className="relative z-[1]">
                  <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    Kiit Bandhu <FiMessageSquare className="text-indigo-300" />
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    Your go-to guide for university rules, academic queries, and campus info.
                  </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/kiit-sage">
              <motion.div
                className="group relative rounded-2xl p-9 w-full border border-white/25 bg-white/8 backdrop-blur-xl backdrop-saturate-150 flex items-center gap-7 transition-all duration-300 hover:bg-white/12"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <span className="pointer-events-none absolute -inset-1 rounded-3xl opacity-30 group-hover:opacity-60 blur-2xl transition-opacity duration-700 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500" />
                <img src={kiitSageImage} alt="KIIT Sage" className="w-24 h-24 flex-shrink-0 relative z-[1]" />
                <div className="relative z-[1]">
                  <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    Kiit Sage <FiHeart className="text-pink-300" />
                  </h3>
                  <p className="mt-2 text-text-secondary">
                    A compassionate companion for mental wellness and confidential support.
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="w-full bg-surface border-t border-border text-text-secondary text-center py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">Made with ❤️ by Asmit And Omm</p>
          <nav className="flex gap-4 sm:gap-6">
            <button onClick={() => scrollTo('welcome')} className="text-sm hover:text-primary transition-colors">Welcome</button>
            <button onClick={() => scrollTo('actions')} className="text-sm hover:text-primary transition-colors">Actions</button>
            <button onClick={() => scrollTo('chatbots')} className="text-sm hover:text-primary transition-colors">Chatbots</button>
          </nav>
        </div>
      </footer>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default StudentLanding;
