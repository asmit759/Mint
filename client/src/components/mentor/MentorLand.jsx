import React, { useState, useEffect } from 'react';
import { FiLogOut, FiMail, FiCalendar, FiClock, FiMessageSquare, FiAlertTriangle, FiMapPin, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { mentorLogout, logout } from '../../store/authSlice';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../utils/AxiosCli';

import mintLogo from '../../assets/mintLogo.png';
import bgImage from '../../assets/mentor_bg.png';
import GlowingButton from '../smallComp/GlowingButton';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const [mentorDetails, setMentorDetails] = useState(user || null);

  useEffect(() => {
    setMentorDetails(user || null);
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axiosClient.get(
          '/mentorRoutes/getMentorDetails'
        );
        if (data?.success) setMentorDetails(data.mentorDetails);
      } catch { }
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

  const nameToShow = getMentorName(user, mentorDetails);

  return (
    <>
      {/* IMAGE SECTION */}
      <div className="relative min-h-screen font-poppins overflow-hidden flex flex-col">

        {/* Background */}
        <img
          src={bgImage}
          alt="Background"
          className="absolute top-0 z-[-2] h-full max-w-none object-cover"
          style={{ 
            width: '130vw', // Forces the image to be wider than the screen
            left: '-15vw' // Adjust this to shift! (-30vw pushes image left, 0 pushes image right)
          }}
        />

        <div className="absolute inset-0 z-[-1] bg-black/20" />

        {/* Header */}
        <header className="flex justify-between items-center p-6 md:px-10">
          <div className="flex items-center gap-4">
            <img
              src={mintLogo}
              alt="Mint Logo"
              className="w-14 h-14 object-contain"
            />
            <span className="text-2xl font-bold text-white tracking-wide">
              MINT
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div
              onClick={() => navigate('/mentor/profile')}
              className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white/50 overflow-hidden flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition hover:ring-2 hover:ring-white/50"
              title="Profile"
            >
              {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                nameToShow.charAt(0).toUpperCase()
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto space-y-12">

          {/* Welcome */}
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
              Welcome back,
            </h1>

            <h2 className="text-3xl md:text-5xl font-bold text-white/80 drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
              {nameToShow}
            </h2>
          </div>

          {/* Content */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 -translate-y-2 items-center">

            <div className="hidden md:block"></div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-8 bg-black/20 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] rounded-[2.5rem]">

              {/* Left Column */}
              <div className="flex flex-col items-center justify-center gap-4">

                <div className="flex justify-center w-full">
                  <GlowingButton
                    text="Mail Mentees"
                    icon={<FiMail />}
                    onClick={() => navigate('/mentor/send-email')}
                    className="w-44"
                  />
                </div>

                <div className="flex justify-center gap-4 w-full">
                  <GlowingButton
                    text="Leaves"
                    icon={<FiCalendar />}
                    onClick={() => navigate('/mentor/leave-applications')}
                    className="w-40"
                  />

                  <GlowingButton
                    text="Chats"
                    icon={<FiMessageSquare />}
                    onClick={() => navigate('/mentor/chat')}
                    className="w-44"
                  />
                </div>

                <div className="flex justify-center w-full">
                  <GlowingButton
                    text="Student Attendance Reports"
                    icon={<FiClock />}
                    onClick={() => navigate('/mentor/attendance')}
                    className="w-40"
                  />
                </div>

              </div>

              {/* Divider */}
              <div className="hidden sm:block w-[1.5px] h-48 bg-white/30 rounded-full mx-2"></div>
              <div className="block sm:hidden h-[1.5px] w-48 bg-white/30 rounded-full my-2"></div>

              {/* Right Column */}
              <div className="flex flex-col items-start justify-center gap-4">

                <GlowingButton
                  text="Grievances"
                  icon={<FiAlertTriangle />}
                  onClick={() => navigate('/mentor/grievances')}
                  className="w-44"
                />

                <GlowingButton
                  text="Location"
                  icon={<FiMapPin />}
                  onClick={() => navigate('/mentor/student-location')}
                  className="w-44"
                />

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER BELOW IMAGE */}
      <footer className="w-full bg-black py-4 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <span>
          Made with <FiHeart className="inline text-red-500 mx-1" />
          by Asmit and Omm
        </span>

        <span className="mt-2 md:mt-0">
          © Mint 2026 All Rights Reserved
        </span>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};

export default MentorDashboard;
