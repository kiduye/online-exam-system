// src/components/Auth/LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../slices/userSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from Redux
    dispatch(clearUser());

    // Remove user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email'); // If you store email in local storage

    // Redirect to the login page or home page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
