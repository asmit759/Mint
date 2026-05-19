import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { studCheckAuth } from '../../store/authSlice';
import axiosClient from '../../utils/AxiosCli';
import AvatarPicker, { avatarUrl } from './AvatarPicker';
import { FiArrowLeft, FiCamera, FiRefreshCw } from 'react-icons/fi';

const StudentProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [hostelName, setHostelName] = useState('Not Assigned');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedSeed, setSelectedSeed] = useState(null);

  // Fetch hostel details if assigned
  useEffect(() => {
    const fetchHostelName = async () => {
      try {
        const { data } = await axiosClient.get("/studentFacility/studentHostel");
        if (data.hostel) {
          setHostelName(data.hostel.hostelName);
        }
      } catch (err) {
        console.error("Failed to fetch student hostel", err);
      }
    };
    if (user?.hostel) {
      fetchHostelName();
    }
  }, [user]);

  const handleSaveAvatar = async () => {
    if (!selectedSeed) {
      toast.warning('Please select an avatar first!', { theme: 'dark' });
      return;
    }
    
    setLoading(true);
    try {
      const generatedUrl = avatarUrl(selectedSeed);
      await axiosClient.put("/studentFacility/studUpdateDetails", {
        profilePhotoUrl: generatedUrl
      });
      
      toast.success('Avatar updated successfully!', {
        position: 'top-center',
        autoClose: 1500,
        theme: 'dark',
        transition: Bounce,
      });

      // Refetch user data to update Redux state
      await dispatch(studCheckAuth()).unwrap();
      
      setShowAvatarPicker(false);
      setSelectedSeed(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update avatar', { theme: 'dark' });
    } finally {
      setLoading(false);
    }
  };

  const address = user?.address && user.address.length > 0 ? user.address[0] : {};

  // Formatted items using strictly dark glassmorphism classes (never flips to light mode)
  const InfoCard = ({ label, value }) => (
    <div className="bg-black/40 border border-white/10 p-4 rounded-xl transition-all duration-300 hover:border-indigo-500/40 shadow-sm">
      <span className="text-[10px] text-indigo-300 block mb-1 uppercase tracking-widest font-semibold">{label}</span>
      <span className="text-sm font-medium text-indigo-100">{value || 'Not Assigned'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-poppins relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Header Section - Strictly Black/Dark Theme */}
      <header className="flex-shrink-0 h-20 bg-black/90 border-b border-white/10 backdrop-blur-md px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link to="/student/landing" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <FiArrowLeft className="w-5 h-5 text-indigo-300 hover:text-white" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
              MINT_Profile
            </h1>
            <p className="text-xs text-indigo-300/60">Official Student Profile Record</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => dispatch(studCheckAuth())}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-indigo-300 hover:text-indigo-100"
            title="Refresh Profile"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-grow max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12 z-10">
        
        {/* LEFT COLUMN: Avatar & Profile Actions */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center sticky top-28 shadow-2xl">
            
            {/* Avatar Frame */}
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-full blur opacity-25"></div>
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white/20 bg-black/60 flex items-center justify-center">
                {user?.profilePhotoUrl ? (
                  <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-light text-indigo-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Meta */}
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 tracking-tight text-center">
              {user?.name}
            </h3>
            <p className="text-xs text-indigo-300/85 mt-1 text-center font-mono">{user?.email_id}</p>
            
            {/* Divider */}
            <div className="w-full h-[1px] bg-white/15 my-6"></div>

            {/* Change Avatar Trigger */}
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-indigo-200 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiCamera className="w-4 h-4" />
              {showAvatarPicker ? "Cancel Selection" : "Change Avatar Image"}
            </button>

            {/* Expansible Avatar Picker */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full mt-6 pt-6 border-t border-white/15 overflow-hidden"
                >
                  <AvatarPicker onSelectAvatar={setSelectedSeed} />
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowAvatarPicker(false);
                        setSelectedSeed(null);
                      }}
                      className="px-4 py-2 text-xs text-indigo-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAvatar}
                      disabled={loading || !selectedSeed}
                      className="px-5 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {loading ? 'Saving...' : 'Save Avatar'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Details Sections */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section: Academic Details */}
          <div className="bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
            <h4 className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-450 rounded-full animate-pulse"></span>
              Academic & Campus Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <InfoCard label="Roll Number" value={user?.roll_no} />
              <InfoCard label="Semester" value={user?.semester ? `Semester ${user.semester}` : null} />
              <InfoCard label="Branch" value={user?.branch} />
              <InfoCard label="Assigned Hostel" value={hostelName} />
              <InfoCard label="Room Number" value={user?.room_no} />
              <InfoCard label="Registered Age" value={user?.age ? `${user.age} Years` : null} />
            </div>
          </div>

          {/* Section: Parent Details */}
          <div className="bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
            <h4 className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-450 rounded-full animate-pulse"></span>
              Parental Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard label="Father's Name" value={user?.fatherName} />
              <InfoCard label="Father's Contact" value={user?.fatherContact} />
              <InfoCard label="Mother's Name" value={user?.motherName} />
              <InfoCard label="Mother's Contact" value={user?.motherContact} />
              <div className="sm:col-span-2">
                <InfoCard label="Parent's Email Address" value={user?.parentEmail} />
              </div>
            </div>
          </div>

          {/* Section: Address Details */}
          <div className="bg-white/8 border border-white/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
            <h4 className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-450 rounded-full animate-pulse"></span>
              Permanent Residential Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InfoCard label="Street Address" value={address.street} />
              </div>
              <InfoCard label="City" value={address.city} />
              <InfoCard label="State" value={address.state} />
              <InfoCard label="Pincode" value={address.pincode} />
              <InfoCard label="Country" value={address.country} />
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black py-6 px-6 md:px-12 flex justify-between items-center text-zinc-600 text-xs font-mono">
        <span>MINT University Mentorship & Support Platform</span>
        <span>© 2026 MINT</span>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default StudentProfile;
