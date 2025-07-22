import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // Get Firebase ID Token and store in localStorage
      const token = await userCred.user.getIdToken();
      localStorage.setItem('token', token);
      navigate('/'); // Changed from '/dashboard' to home page for regular users
    } catch (error) {
      // Make error messages more user-friendly
      if (error.code === 'auth/user-not-found') {
        setErr('No account found with this email address');
      } else if (error.code === 'auth/wrong-password') {
        setErr('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setErr('Please enter a valid email address');
      } else {
        setErr('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
  {/* Logo Section */}
  <div className="flex items-center justify-center space-x-3 group">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-lg p-2 shadow-lg">
        <img 
          src="./logo.svg" 
          alt="UrbanAura Logo" 
          height={28} 
          width={28}
          className="transition-transform duration-300 group-hover:rotate-6"
        />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
        URBAN
      </span>
      <span className="text-base font-medium text-indigo-400 tracking-[0.2em] uppercase leading-none">
        aura
      </span>
    </div>
  </div>

  {/* Welcome Text */}
  <div>
    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
      Welcome Back
    </h2>
    <p className="text-sm text-gray-600">
      Sign in to your UrbanAura account
    </p>
  </div>
</div>


        {/* Form */}
        <form className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl px-8 py-8 space-y-6 border border-gray-200/50" onSubmit={handleLogin}>
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {err}
            </div>
          )}
          
          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
