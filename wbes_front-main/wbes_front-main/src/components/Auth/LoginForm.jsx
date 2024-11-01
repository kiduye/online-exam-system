// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { user, role, token } = response.data;
      dispatch(
        setUser({
          email: user.email,
          _id: user._id,
          role,
          firstName: role === 'student' ? user.firstName : '',
          token,
        })
      );

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      switch (role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'superadmin':
          navigate('/superadmin/dashboard');
          break;
        case 'instructor':
          navigate('/instructor/dashboard');
          break;
        case 'departmentboard':
          navigate('/departmentboard/dashboard');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      setError(
        error.response?.data?.msg === 'Password has changed, please log in again.'
          ? 'Your password has been changed. Please log in with your new password.'
          : 'Invalid credentials'
      );
    }

    setLoading(false);
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-email">
              Email
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`w-full px-4 py-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />
            {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className={`w-full px-4 py-2 border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`}
              placeholder="********"
              required
              autoComplete="current-password"
            />
            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
          </div>

          {error && <p className="text-red-500 text-center text-sm mb-6">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
              isFormValid ? 'hover:bg-indigo-600 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormValid || loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            className="text-sm text-indigo-500 hover:underline transition duration-300"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
