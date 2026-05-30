import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { studRegister, mentorRegister } from '../store/authSlice';
import AvatarPicker from './student/AvatarPicker';
import Logo from '../assets/mintLogo.png';
import BgImage from '../assets/loginpage_bg.gif';
import GlowingButton from './smallComp/GlowingButton';

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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-indigo-600 selection:text-white transition-colors duration-300 relative"
      style={{ backgroundImage: `url(${BgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      
      {/* Overlay to ensure readability */}
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
          <h2 className="text-xl font-semibold text-text-primary tracking-tight mt-2">Create an account</h2>
          <p className="text-sm text-text-secondary mt-1">Join as a student or mentor</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-surface border border-border rounded-xl mb-8 relative">
          {['student', 'mentor'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRole(tab)}
              className="flex-1 relative py-2.5 text-sm font-medium z-10 outline-none"
            >
              {role === tab && (
                <motion.div 
                  layoutId="activeTabSignup" 
                  className="absolute inset-0 bg-background rounded-lg shadow-sm border border-border" 
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`relative z-20 transition-colors duration-200 ${role === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Form */}
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
                <div className="flex justify-center mb-6">
                  <AvatarPicker onSelectAvatar={setAvatarSeed} />
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-200"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                  {role === 'student' ? 'KIIT Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder={role === 'student' ? '1234567@kiit.ac.in' : 'name@example.com'}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-200"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
              </div>

              {/* Contact Number (Mentor Only) */}
              {role === 'mentor' && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Contact Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-200"
                    {...register('contactNumber', {
                      required: 'Contact number is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit number' },
                    })}
                  />
                  {errors.contactNumber && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.contactNumber.message}</p>}
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition duration-200"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition duration-200"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (v) => v === password || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <div className="w-full mt-4 flex justify-center pointer-events-auto">
             {loading ? (
                <button disabled className="w-full bg-indigo-600/50 text-white font-medium py-3.5 rounded-xl cursor-not-allowed">
                  Creating account...
                </button>
             ) : (
                <GlowingButton text="Create Account" className="mt-2" />
             )}
          </div>

          {serverError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center mt-3 font-medium">
              {serverError}
            </motion.p>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default Signup;
