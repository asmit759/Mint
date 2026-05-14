// src/components/MentorSignup.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { mentorRegister } from '../store/authSlice';

const MentorSignup = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();
  const [formData, setFormData] = useState(null);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!formData) return;

    const registerMentor = async () => {
      setServerError('');
      setLoading(true);
      try {
        await dispatch(mentorRegister(formData)).unwrap();
        toast.success('Mentor Registration Successful!', {
          position: 'top-center',
          autoClose: 1200,
          theme: 'dark',
          transition: Bounce,
        });
        setTimeout(() => navigate('/login', { replace: true }), 800);
      } catch (error) {
        setServerError(error || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
        setFormData(null);
      }
    };

    registerMentor();
  }, [formData, dispatch, navigate]);

  const onSubmit = (data) => setFormData(data);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center px-4 py-8">
      <div className="bg-surface rounded-2xl shadow-2xl shadow-indigo-900/50 p-8 w-full max-w-md border border-border">
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-8">Mentor Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-surface border border-indigo-700/50 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-surface border border-indigo-700/50 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">Contact Number</label>
            <input
              type="tel"
              placeholder="Enter your contact number"
              className="w-full px-4 py-3 bg-surface border border-indigo-700/50 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              {...register('contactNumber', {
                required: 'Contact number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' },
              })}
            />
            {errors.contactNumber && <p className="text-red-400 text-sm mt-1">{errors.contactNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-surface border border-indigo-700/50 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 bg-surface border border-indigo-700/50 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === getValues('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-indigo-700 text-text-primary font-semibold py-3 rounded-lg transition duration-200 shadow-lg shadow-indigo-500/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Sign Up as Mentor'}
          </button>

          {serverError && <p className="text-red-400 text-sm text-center mt-3">{serverError}</p>}
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Login here</Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="dark" transition={Bounce} />
    </div>
  );
};

export default MentorSignup;
