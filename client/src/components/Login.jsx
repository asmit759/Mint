// Login.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axios from 'axios'
import { Link } from 'react-router-dom'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [formData, setFormData] = useState(null);
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!formData) return

    const loginUser = async () => {
      setServerError('')
      setLoading(true)
      try {
        const response = await axios.post('http://localhost:4000/mentor/login', formData)
        toast.success('Login Success', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } catch (error) {
        setServerError(error.response?.data?.message || 'Login failed. Please try again.')
      } finally {
        setLoading(false)
        setFormData(null)
      }
    }

    loginUser()
  }, [formData])

  const onSubmit = (data) => {
    setFormData(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/50 p-8 w-full max-w-md border border-indigo-800/30">
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-8">
            Login
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-indigo-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              {...register("email", { 
                required: "Email is required", 
                maxLength: { value: 30, message: "Email must be less than 30 characters" }
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
              {...register("password", { 
                required: "Password is required",
                pattern: { 
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/, 
                  message: "Enter a strong password" 
                }
              })}
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
          <p className="text-gray-400 text-sm">
            Don't have an account?
          </p>
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
      </div>
      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default Login
