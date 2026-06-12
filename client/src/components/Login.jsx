import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/mintLogo.png';
import TreeImage from '../assets/tree.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { studLogin, mentorLogin } from '../store/authSlice';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [serverError, setServerError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userType: stateUserType } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (stateUserType === 'student') navigate('/student/landing');
      else navigate('/mentor-landing');
    }
  }, [isAuthenticated, stateUserType, navigate]);

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const credentials =
        userType === 'student'
          ? { email_id: data.email, password: data.password }
          : { email: data.email, password: data.password };

      if (userType === 'student') {
        await dispatch(studLogin(credentials)).unwrap();
      } else {
        await dispatch(mentorLogin(credentials)).unwrap();
      }

      toast.success(`${userType === 'student' ? 'Student' : 'Mentor'} Login Successful!`, {
        position: 'top-center',
        autoClose: 1500,
        theme: 'dark',
        transition: Bounce,
      });

      setTimeout(() => {
        navigate(userType === 'student' ? '/student/landing' : '/mentor-landing');
      }, 800);
    } catch (err) {
      setServerError(err?.message || 'Login failed. Please check your credentials.');
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
          {userType === 'student' ? (
            <>
              <h2 className="text-3xl lg:text-4.5xl font-semibold tracking-tight leading-tight text-left">
                <span className="text-[#9ca3af]">Welcome</span>
                <br />
                <span className="text-white">back.</span>
              </h2>
              <p className="text-sm text-[#9ca3af]/90 font-medium leading-relaxed mt-4">
                Sign in to access your wellbeing dashboard, AI support, and campus resources.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl lg:text-4.5xl font-semibold tracking-tight leading-tight text-left">
                <span className="text-[#9ca3af]">Good to see</span>
                <br />
                <span className="text-white">you, mentor.</span>
              </h2>
              <p className="text-sm text-[#9ca3af]/90 font-medium leading-relaxed mt-4">
                Sign in to manage your students, review leave requests, and access mentor tools.
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-[50%] md:w-[55%] h-auto md:h-screen relative flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden bg-[#050505]">
        {/* Soft background glow on the right too */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#4fd1ff]/5 blur-[120px] pointer-events-none" />

        {/* Premium Glassmorphism Panel (Leave portal card style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mint-leave-glass-panel w-full max-w-[480px] p-6 md:p-8 lg:p-10 relative overflow-hidden"
        >
          <div className="space-y-6">
            {/* Header - Logo removed from center */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-[#9ca3af] mt-1.5 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#4fd1ff] hover:text-[#4fd1ff]/80 underline underline-offset-4 decoration-1 transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Role Tab Selector */}
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl relative">
              {['student', 'mentor'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setUserType(tab)}
                  className="flex-1 relative py-2 text-xs font-semibold uppercase tracking-wider text-center focus:outline-none cursor-pointer z-10"
                >
                  {userType === tab && (
                    <motion.div
                      layoutId="activeTabLoginSelection"
                      className="absolute inset-0 bg-white/10 border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.3)] rounded-lg"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className={`relative transition-colors duration-200 ${userType === tab ? 'text-white' : 'text-[#9ca3af] hover:text-white'}`}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={userType}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold tracking-wider text-[#9ca3af] uppercase mb-1.5 ml-1">
                      {userType === 'student' ? 'KIIT Email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      placeholder={userType === 'student' ? '1234567@kiit.ac.in' : 'name@example.com'}
                      className="mint-leave-glass-input px-4 py-2.5 text-sm"
                      {...register('email', {
                        required: 'Email is required',
                        maxLength: { value: 30, message: 'Must be less than 30 characters' },
                      })}
                    />
                    {errors.email && (
                      <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

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
                    {errors.password && (
                      <p className="text-[#4fd1ff] text-xs mt-1 ml-1 font-semibold">{errors.password.message}</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="mint-btn-primary w-full py-3 px-4 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer focus:outline-none active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In →'}
                </button>
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

export default Login;
