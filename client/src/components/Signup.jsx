import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { studRegister, mentorRegister } from '../store/authSlice';
import AvatarPicker from './student/AvatarPicker';
import GlowingButton from './smallComp/GlowingButton';
import Logo from '../assets/mintLogo.png';
import TreeImage from '../assets/tree.jpg';

const Signup = () => {
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const password = watch('password', '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Reset form when role changes
  useEffect(() => {
    reset();
    setServerError('');
    setAvatarSeed('');
  }, [role, reset]);

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      if (role === 'student') {
        if (!avatarSeed) {
          setServerError('Please select an avatar.');
          setLoading(false);
          return;
        }
        const payload = {
          name: data.name,
          email_id: data.email,
          password: data.password,
          avatarSeed
        };
        await dispatch(studRegister(payload)).unwrap();
        toast.success('Student Registration Successful!', {
          position: 'top-center', autoClose: 1500, theme: 'dark', transition: Bounce,
        });
      } else {
        const payload = {
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          password: data.password
        };
        await dispatch(mentorRegister(payload)).unwrap();
        toast.success('Mentor Registration Successful!', {
          position: 'top-center', autoClose: 1500, theme: 'dark', transition: Bounce,
        });
      }
      setTimeout(() => navigate('/login', { replace: true }), 1000);
    } catch (error) {
      setServerError(error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-signup-theme min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row relative z-10 w-full bg-[#050505] selection:bg-[#4fd1ff]/30 selection:text-[#4fd1ff]">
      
      {/* LEFT SECTION */}
      <div className="w-full lg:w-[50%] md:w-[45%] h-[50vh] md:h-screen relative flex flex-col justify-between p-6 md:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 bg-[#050505] mint-grid-bg">
        {/* Subtle Static Background Gradient overlay to add premium depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1322]/30 via-transparent to-[#050505] pointer-events-none" />

        {/* Top-Left Branding */}
        <div className="relative z-10 flex flex-col gap-1.5 self-start">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="MINT Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold tracking-wider text-white">MINT</span>
          </div>
          <span className="text-xs text-[#9ca3af] font-medium tracking-tight">
            Growing minds through intelligent support.
          </span>
        </div>

        {/* Hero Tree Image (Static) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
          <img
            src={TreeImage}
            alt="Glowing Tree"
            className="max-h-[60%] lg:max-h-[65%] w-auto object-contain"
          />
        </div>

        {/* Bottom Hero Text - dynamic per role */}
        <div className="relative z-10 max-w-md mt-auto pt-6 lg:pt-0">
          {role === 'student' ? (
            <>
              <h2 className="text-3xl lg:text-4.5xl font-semibold tracking-tight leading-tight text-left">
                <span className="text-[#9ca3af]">Begin your</span>
                <br />
                <span className="text-white">journey.</span>
              </h2>
              <p className="text-sm text-[#9ca3af]/90 font-medium leading-relaxed mt-4">
                Join a community where technology and empathy work together to support your academic wellbeing.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4.5xl font-semibold tracking-tight leading-tight text-left">
                <span className="text-[#9ca3af]">Shape the</span>
                <br />
                <span className="text-white">next generation.</span>
              </h2>
              <p className="text-sm text-[#9ca3af]/90 font-medium leading-relaxed mt-4">
                Register as a mentor and guide students with empathy, expertise, and AI-powered tools.
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-[50%] md:w-[55%] h-auto md:h-screen relative flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden bg-[#050505]">
        {/* Soft background glow — olive green to match tree image */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[110px] pointer-events-none" style={{background: 'rgba(107, 142, 35, 0.07)'}} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full blur-[90px] pointer-events-none" style={{background: 'rgba(107, 142, 35, 0.04)'}} />

        {/* Premium Glassmorphism Panel (Leave portal card style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mint-leave-glass-panel w-full max-w-[480px] lg:h-[88%] md:h-[92%] flex flex-col justify-between p-6 md:p-8 lg:p-10 relative overflow-hidden"
        >
          {/* Form container with vertical scroll custom bar for smaller screens */}
          <div className="flex-1 overflow-y-auto pr-1 -mr-2 mint-custom-scrollbar space-y-5">
            {/* Header */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                Create your account
              </h1>
              <p className="text-sm text-[#9ca3af] mt-1.5 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#4fd1ff] hover:text-[#4fd1ff]/80 underline underline-offset-4 decoration-1 transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Role Tab Selector */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl relative">
              {['student', 'mentor'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRole(tab)}
                  className="flex-1 relative py-2 text-xs font-semibold uppercase tracking-wider text-center focus:outline-none cursor-pointer z-10"
                >
                  {role === tab && (
                    <motion.div
                      layoutId="activeTabSelection"
                      className="absolute inset-0 bg-white/10 border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] rounded-lg"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className={`relative transition-colors duration-200 ${role === tab ? 'text-white' : 'text-[#9ca3af] hover:text-white'}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {role === 'student' && (
                    <div className="w-full">
                      <AvatarPicker onSelectAvatar={setAvatarSeed} />
                    </div>
                  )}

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      className="mint-leave-glass-input px-4 py-2.5 text-sm"
                      {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } })}
                    />
                    {errors.name && <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                      {role === 'student' ? 'KIIT Email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder={role === 'student' ? '1234567@kiit.ac.in' : 'name@example.com'}
                      className="mint-leave-glass-input px-4 py-2.5 text-sm"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.email.message}</p>}
                  </div>

                  {/* Contact Number (Mentor Only) */}
                  {role === 'mentor' && (
                    <div>
                      <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="mint-leave-glass-input px-4 py-2.5 text-sm"
                        {...register('contactNumber', {
                          required: 'Contact number is required',
                          pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit number' },
                        })}
                      />
                      {errors.contactNumber && <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.contactNumber.message}</p>}
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mint-leave-glass-input px-4 py-2.5 text-sm"
                      {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="mint-leave-glass-input px-4 py-2.5 text-sm"
                      {...register('confirmPassword', {
                        required: 'Please confirm password',
                        validate: (v) => v === password || 'Passwords do not match',
                      })}
                    />
                    {errors.confirmPassword && <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.confirmPassword.message}</p>}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <GlowingButton
                  type="submit"
                  text={loading ? 'Creating Account...' : 'Create Account'}
                  activeText={loading ? 'Creating Account...' : 'Let\'s Go →'}
                  disabled={loading}
                />
              </div>

              {serverError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#4fd1ff] text-xs text-center font-bold mt-2"
                >
                  {serverError}
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default Signup;

