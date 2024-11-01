import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Api from '../../api/axiosInstance'; // Adjust the import path if necessary

const Preferences = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    oldPassword: '', // New field for old password
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Api.get('/profile'); // Adjust endpoint if necessary
        const userData = response.data;

        // Initialize form data based on the user role
        if (userData.role === 'student') {
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            password: '',
            oldPassword: '', // Initialize old password
          });
        } else {
          setFormData({
            name: userData.name || '',
            password: '',
          });
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to hold the updated profile data
    const updatedData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    // Only add the password field if it's provided
    if (formData.password) {
      updatedData.password = formData.password;
    }

    try {
      // Send the updated profile data to the server
      const response = await Api.put('/profile-update', updatedData);

      // Check response status and handle success
      if (response.status === 200) {
        setSuccess(true);
        alert('Profile updated successfully!');

        // Redirect to another page, e.g., the profile page
        navigate('/profile'); // Adjust the path as necessary
      }
    } catch (err) {
      // Handle server-side validation errors
      if (err.response) {
        // If there's a specific error message from the server
        setError(err.response.data.msg || 'Failed to update profile');
      } else {
        setError('Failed to update profile');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="oldPassword">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your old password"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
              New Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a new password"
            />
          </div>
         </div>
        <button
          type="submit"
          className="w-1/3 mx-auto bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Profile
        </button>
        {success && <div className="text-green-500 text-center mt-2">Profile updated successfully!</div>}
      </form>
    </div>
  );
};

export default Preferences;
