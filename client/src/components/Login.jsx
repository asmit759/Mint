import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/mintLogo.png';
import BgImage from '../assets/login_bg.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { studLogin, mentorLogin } from '../store/authSlice';
import GlowingButton from './smallComp/GlowingButton';

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-indigo-600 selection:text-white transition-colors duration-300 relative"
      style={{ backgroundImage: `url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay to ensure readability if the gif is bright/busy */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-background/95 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-border p-8 sm:p-10 relative z-10"
      >
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="MINT Logo" className="w-24 h-24 mb-3 drop-shadow-md" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight font-poppins mb-1">MINT</h1>
          <h2 className="text-xl font-semibold text-text-primary tracking-tight mt-2">Welcome back</h2>
          <p className="text-sm text-text-secondary mt-1">Sign in to your account</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-surface border border-border rounded-xl mb-8 relative">
          {['student', 'mentor'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setUserType(tab)}
              className="flex-1 relative py-2.5 text-sm font-medium z-10 outline-none"
            >
              {userType === tab && (
                <motion.div 
                  layoutId="activeTabLogin" 
                  className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border" 
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-20 transition-colors duration-200 ${userType === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
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
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                  {userType === 'student' ? 'KIIT Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder={userType === 'student' ? '1234567@kiit.ac.in' : 'name@example.com'}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-white/60 transition duration-200"
                  {...register('email', {
                    required: 'Email is required',
                    maxLength: { value: 30, message: 'Must be less than 30 characters' },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-white/60 transition duration-200"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <div className={`w-full mt-6 flex justify-center ${loading ? 'opacity-70 pointer-events-none' : 'pointer-events-auto'}`}>
             <GlowingButton text={loading ? 'Signing in...' : 'Sign In'} className="mt-4" />
          </div>

          {serverError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center mt-3 font-medium">
              {serverError}
            </motion.p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default Login;
