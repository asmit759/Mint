import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/mintLogo.png';
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

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (stateUserType === 'student') navigate('/student/landing');
      else navigate('/mentor-landing');
    }
  }, [isAuthenticated, stateUserType, navigate]);

  // Submit handler
  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const credentials =
        userType === 'student'
          ? { email_id: data.email, password: data.password }
          : { email: data.email, password: data.password };

      const action =
        userType === 'student'
          ? await dispatch(studLogin(credentials)).unwrap()
          : await dispatch(mentorLogin(credentials)).unwrap();

      toast.success(`${userType === 'student' ? 'Student' : 'Mentor'} Login Successful!`, {
        position: 'top-center',
        autoClose: 2000,
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    float: {
      y: [-10, 10, -10],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
  };
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: (i) => ({
      scaleX: 1,
      transition: { delay: i * 0.1 + 0.5, duration: 0.5, ease: 'easeOut' },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 flex items-center justify-center px-4 lg:px-8">
      <div className="flex w-full max-w-6xl gap-8 items-center">
        {/* LEFT PANEL */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center flex-1 space-y-6 p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="relative" variants={logoVariants} animate="float">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
            <motion.img
              src={Logo}
              alt="MINT Logo"
              className="w-48 h-48 relative z-10 drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-600 font-poppins tracking-tight"
            variants={itemVariants}
          >
            MINT
          </motion.h1>
          <motion.p
            className="text-xl text-indigo-200 text-center max-w-md font-light leading-relaxed"
            variants={itemVariants}
          >
            Because every great journey needs a guide.
          </motion.p>

          <motion.div className="flex gap-4 mt-8" variants={itemVariants}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={lineVariants}
                className={`${
                  i === 0 ? 'w-16' : i === 1 ? 'w-8' : 'w-4'
                } h-1 bg-gradient-to-r ${
                  i === 0
                    ? 'from-indigo-500 to-purple-500'
                    : i === 1
                    ? 'from-purple-500 to-pink-500'
                    : 'from-pink-500 to-indigo-500'
                } rounded-full`}
                style={{ originX: 0 }}
              />
            ))}
          </motion.div>

          <motion.div className="mt-8 text-center space-y-2" variants={itemVariants}>
            <p className="text-gray-400 text-sm">Connecting students with mentors</p>
            <p className="text-gray-500 text-xs">@MINT all rights reserved 2025</p>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/50 p-8 w-full max-w-md border border-indigo-800/30"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold text-indigo-400 text-center mb-8 font-poppins">
            Login
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('student')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  userType === 'student'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-indigo-700/30'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserType('mentor')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition duration-200 ${
                  userType === 'mentor'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-indigo-700/30'
                }`}
              >
                Mentor
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                {...register('email', {
                  required: 'Email is required',
                  maxLength: { value: 30, message: 'Email must be less than 30 characters' },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {serverError && (
              <p className="text-red-400 text-sm text-center mt-3">{serverError}</p>
            )}
          </form>

          <div className="mt-6 text-center flex flex-col gap-2">
            <p className="text-gray-400 text-sm">Don't have an account?</p>
            <div className="flex justify-center gap-3">
              <Link
                to="/student/signup"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200"
              >
                Student Sign Up
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/mentor/signup"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition duration-200"
              >
                Mentor Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default Login;
