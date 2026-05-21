// src/components/mentor/MentorMail.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import axiosClient from '../../utils/AxiosCli';
import { mentorLogout, logout } from '../../store/authSlice';
import GlowingButton from '../smallComp/GlowingButton';
import { 
  FiChevronDown, 
  FiArrowLeft,
  FiCornerDownRight,
  FiUsers
} from 'react-icons/fi';

import mintLogo from '../../assets/mintLogo.png';

const emailOf = (s) =>
  s?.email ?? s?.email_id ?? s?.emailId ?? s?.contact?.email ?? '';

const MentorMail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((s) => s.auth);

  const [mentorDetails, setMentorDetails] = useState(user || null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMentorDetails(user || null);
  }, [user]);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      setFetchingData(true);
      try {
        const { data } = await axiosClient.get('/mentorRoutes/getMentorDetails', { withCredentials: true });
        if (data?.success) {
          setMentorDetails(data.mentorDetails || user || null);
        } else {
          toast.error(data?.message || 'Failed to load mentor details', { position: 'top-center', theme: 'dark', transition: Bounce });
        }
      } catch (error) {
        console.error('Error fetching mentor details:', error);
        toast.error('Failed to load mentor details', { position: 'top-center', theme: 'dark', transition: Bounce });
      } finally {
        setFetchingData(false);
      }
    };
    if (isAuthenticated && role === 'mentor') fetchMentorDetails(); else setFetchingData(false);
  }, [isAuthenticated, role, user]);

  const mentees = mentorDetails?.mentees ?? mentorDetails?.students ?? [];

  const handleStudentToggle = (student) => {
    const email = emailOf(student);
    if (!email) return;
    setSelectedStudents((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAll = () => {
    const allEmails = (mentees || []).map(emailOf).filter(Boolean);
    if (selectedStudents.length === allEmails.length) setSelectedStudents([]);
    else setSelectedStudents(allEmails);
  };

  const handleSendMail = async (e) => {
    e?.preventDefault();
    if (!isAuthenticated || role !== 'mentor') {
      toast.error('You must be logged in as a mentor to send emails', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }
    if (!title.trim() || !body.trim()) {
      toast.error('Please fill in all fields', { position: 'top-center', theme: 'dark', transition: Bounce });
      return;
    }

    const uniqueEmails = [...new Set(selectedStudents)];

    setLoading(true);
    try {
      const { data } = await axiosClient.post(
        '/mentorRoutes/sendMailToStudent',
        { studentEmailArray: uniqueEmails, title, body },
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success('Email sent successfully!', { position: 'top-center', theme: 'dark', transition: Bounce });
        setSelectedStudents([]);
        setTitle('');
        setBody('');
      } else {
        toast.error(data?.message || 'Failed to send email', { position: 'top-center', theme: 'dark', transition: Bounce });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send email', { position: 'top-center', theme: 'dark', transition: Bounce });
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    {
      id: 1,
      label: 'Schedule Meeting',
      subject: 'Upcoming Mentorship Meeting',
      content: 'Hi there,\n\nJust a quick reminder about our upcoming mentorship meeting. Please come prepared with any updates or questions.\n\nBest,\nYour Mentor'
    },
    {
      id: 2,
      label: 'Checking In',
      subject: 'Motivation & Check-in',
      content: 'Hi there,\n\nWanted to quickly check in and see how your studies are going. Remember that consistency is key!\n\nBest,\nYour Mentor'
    },
    {
      id: 3,
      label: 'Attendance',
      subject: 'Attendance Follow-up',
      content: 'Hi there,\n\nI noticed some discrepancies in your recent attendance. Let\'s schedule a time to discuss this so we can keep you on track.\n\nBest,\nYour Mentor'
    },
    {
      id: 4,
      label: 'Career Guidance',
      subject: 'Career Opportunities',
      content: 'Hi there,\n\nI found some great resources regarding your career interests. Let\'s discuss them in our next session!\n\nBest,\nYour Mentor'
    }
  ];

  const applyTemplate = (subject, content) => {
    setTitle(subject);
    setBody(content);
    toast.success('Template applied', { position: 'top-center', autoClose: 1000, hideProgressBar: true, theme: 'dark' });
  };

  return (
    <div className="relative min-h-screen bg-background font-poppins text-text-primary overflow-hidden flex flex-col selection:bg-primary/20 selection:text-text-primary transition-colors duration-300">
      
      {/* Refined Ambient Lighting: Softer, larger, deeply blurred */}
      <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-text-secondary/[0.04] rounded-full blur-[140px] pointer-events-none transition-colors duration-300" />
      <div className="absolute bottom-[-10%] right-[5%] w-[40vw] h-[40vw] bg-primary/[0.03] rounded-full blur-[160px] pointer-events-none transition-colors duration-300" />

      <main className="flex-grow flex flex-col p-6 sm:p-12 w-full max-w-6xl mx-auto mt-4 relative z-10">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="w-full flex items-center justify-between -translate-y-6"
        >
          <button 
            onClick={() => navigate('/mentor/dashboard')} 
            className="flex items-center gap-3 text-xs text-text-secondary hover:text-text-primary font-medium tracking-widest uppercase transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Dashboard
          </button>

          {/* Mint Logo */}
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
            <img
              src={mintLogo}
              alt="Mint Logo"
              className="w-14 h-14 object-contain"
            />
            <span className="text-xl font-medium text-text-primary tracking-[0.15em] transition-colors duration-300">
              MINT
            </span>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-text-primary mb-5 transition-colors duration-300">
            Mentorship <span className="text-text-secondary transition-colors duration-300">Communication.</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-light tracking-wide max-w-xl transition-colors duration-300">
            A premium space to guide, inspire, and connect with your mentees.
          </p>
        </motion.div>

        {/* Asymmetric Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start w-full">
          
          {/* Main Composer Area (Left 7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-10"
          >
            
            {/* Recipient Selector */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] text-text-secondary font-medium tracking-widest uppercase flex items-center justify-between ml-2 transition-colors duration-300">
                <span>To</span>
                {selectedStudents.length > 0 && (
                  <span className="text-primary font-semibold transition-colors duration-300">{selectedStudents.length} Selected</span>
                )}
              </label>
              <div className="relative z-20">
                <button 
                  type="button" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="w-full px-6 py-5 bg-surface border border-border rounded-3xl text-left flex items-center justify-between hover:bg-surface/80 hover:border-border/80 transition-all shadow-xl shadow-black/5 backdrop-blur-xl transition-colors duration-300"
                >
                  <span className="text-text-primary font-light text-[15px] transition-colors duration-300">
                    {selectedStudents.length === 0 ? 'Select Recipients...' : `${selectedStudents.length} Mentee${selectedStudents.length > 1 ? 's' : ''}`}
                  </span>
                  <FiChevronDown className={`text-text-secondary w-5 h-5 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8, scale: 0.98 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: -8, scale: 0.98 }} 
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} 
                      className="absolute top-full left-0 right-0 mt-4 bg-surface/95 backdrop-blur-3xl border border-border rounded-[1.75rem] shadow-2xl shadow-black/10 overflow-hidden z-50 transition-colors duration-300"
                    >
                      {!fetchingData && mentees.length > 0 && (
                        <div onClick={handleSelectAll} className="px-6 py-5 border-b border-border hover:bg-background/50 cursor-pointer transition flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedStudents.length === mentees.length ? 'border-primary bg-primary/20' : 'border-border'}`}>
                            {selectedStudents.length === mentees.length && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <span className="text-text-primary font-light text-sm tracking-wide transition-colors duration-300">Select All</span>
                        </div>
                      )}

                      <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {fetchingData ? (
                          <div className="p-8 text-center text-text-secondary font-light text-sm">Loading mentees...</div>
                        ) : mentees.length === 0 ? (
                          <div className="p-8 text-center text-text-secondary font-light text-sm">No mentees found.</div>
                        ) : (
                          mentees.map(student => {
                            const email = emailOf(student);
                            const isSelected = selectedStudents.includes(email);
                            return (
                              <div key={student._id || email} onClick={() => handleStudentToggle(student)} className="px-6 py-4 hover:bg-background/50 cursor-pointer transition-colors flex items-center gap-4 border-b border-border last:border-none">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary/20' : 'border-border'}`}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-text-primary font-light text-[15px] tracking-wide transition-colors duration-300">{student.name ?? 'Unnamed'}</span>
                                  <span className="text-text-secondary font-light text-xs mt-1 transition-colors duration-300">{email}</span>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Subject Input */}
            <div className="flex flex-col gap-3 z-10">
              <label className="text-[11px] text-text-secondary font-medium tracking-widest uppercase ml-2 transition-colors duration-300">Subject</label>
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-text-secondary/10 to-transparent rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Message Subject" 
                  className="relative w-full px-6 py-5 bg-surface border border-border rounded-3xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:bg-background transition-all shadow-xl shadow-black/5 font-light text-[15px] transition-colors duration-300"
                />
              </div>
            </div>

            {/* Body Textarea */}
            <div className="flex flex-col gap-3 z-10">
              <label className="text-[11px] text-text-secondary font-medium tracking-widest uppercase ml-2 transition-colors duration-300">Message</label>
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-text-secondary/10 to-transparent rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <textarea 
                  value={body} 
                  onChange={(e) => setBody(e.target.value)} 
                  placeholder="Write your message here... (HTML supported)" 
                  rows={10} 
                  className="relative w-full px-6 py-6 bg-surface border border-border rounded-3xl text-text-primary placeholder-text-secondary/60 focus:outline-none focus:bg-background transition-all shadow-xl shadow-black/5 font-light text-[15px] resize-none leading-relaxed transition-colors duration-300"
                />
              </div>
            </div>

            {/* CTA Section */}
            <div className="pt-4 flex flex-col sm:flex-row gap-5 justify-end z-10">
              <div className="w-full sm:w-32 opacity-70 hover:opacity-100 transition-opacity">
                <GlowingButton 
                  text="Clear" 
                  onClick={() => { setSelectedStudents([]); setTitle(''); setBody(''); }}
                  className="!min-h-[50px] !text-[15px]"
                />
              </div>
              <div className="w-full sm:w-44">
                <GlowingButton 
                  text={loading ? "Sending..." : "Send"} 
                  icon={loading ? null : <FiCornerDownRight className="w-4 h-4" />} 
                  onClick={handleSendMail}
                  className="!min-h-[50px] !text-[15px]"
                />
              </div>
            </div>

          </motion.div>

          {/* Right Column: Templates & Insights (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-12 mt-4 lg:pl-6">
            
            {/* Mentor Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <label className="text-[11px] text-text-secondary font-medium tracking-widest uppercase ml-2 transition-colors duration-300">Overview</label>
              <div className="p-8 bg-surface border border-border rounded-[2rem] flex items-end justify-between shadow-2xl shadow-black/5 transition-colors duration-300">
                <div className="flex flex-col">
                  <span className="text-6xl font-light text-text-primary tracking-tighter transition-colors duration-300">{mentees.length}</span>
                  <span className="text-[11px] text-text-secondary font-medium uppercase tracking-widest mt-2 transition-colors duration-300">Total Mentees</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-border bg-background/50 flex items-center justify-center transition-colors duration-300">
                  <FiUsers className="text-text-secondary w-5 h-5 transition-colors duration-300" />
                </div>
              </div>
            </motion.div>

            {/* Quick Templates */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <label className="text-[11px] text-text-secondary font-medium tracking-widest uppercase ml-2 transition-colors duration-300">Quick Actions</label>
              <div className="grid grid-cols-1 gap-4">
                {templates.map(template => (
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    key={template.id}
                    onClick={() => applyTemplate(template.subject, template.content)}
                    className="group flex flex-col items-start gap-1 p-6 bg-surface hover:bg-surface/80 border border-border rounded-[2rem] transition-colors text-left shadow-2xl shadow-black/5 transition-colors duration-300"
                  >
                    <span className="text-[15px] font-medium text-text-primary group-hover:text-text-primary/80 transition-colors tracking-wide transition-colors duration-300">
                      {template.label}
                    </span>
                    <span className="text-xs text-text-secondary font-light line-clamp-1 tracking-wider mt-1 group-hover:text-text-secondary/80 transition-colors transition-colors duration-300">
                      {template.subject}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

          </div>

        </div>
      </main>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default MentorMail;
