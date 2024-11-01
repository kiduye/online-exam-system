import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store

const BoardMemberForm = ({ member, closeModal, fetchBoardMembers }) => {
  const [name, setName] = useState(member?.name || '');
  const [email, setEmail] = useState(member?.email || '');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState(member?.department?._id || '');
  const [departments, setDepartments] = useState([]);

// Safely access the token from the Redux store using optional chaining
  const token = useSelector((state) => state.auth?.token) || ''; 

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    if (token) { // Ensure token is present before making the API call
      fetchDepartments();
    }
  }, [token]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const memberData = { name, email, password, department };

    try {
      const url = member 
        ? `http://localhost:5000/api/departmentboards/${member._id}` 
        : 'http://localhost:5000/api/departmentboards';
      const method = member ? 'put' : 'post';

      await axios({
        method,
        url,
        data: memberData,
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchBoardMembers();
      closeModal();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {!member && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a Department</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          onClick={closeModal} 
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {member ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  );
};

export default BoardMemberForm;
