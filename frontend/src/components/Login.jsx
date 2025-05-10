import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {  // ✅ Fixed prop destructuring
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // ✅ Prevents default form submission behavior

    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });

      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Login successful!"); // ✅ Success message
      } else {
        toast.error(response.data.message || "Invalid credentials. Please try again.");
      }

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      ); // ✅ Improved error handling
    }
  };

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-gray-100'>
      <div className='w-full max-w-md px-8 py-6 bg-white rounded-lg shadow-md'>
        <h1 className='mb-4 text-2xl font-bold text-center'>Technical Round</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-4'>
            <p className='mb-2 text-sm font-medium text-gray-700'>Email Address</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              className='w-full px-4 py-2 transition-all border border-gray-400 rounded-md outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-300'
              type="email"
              placeholder='Enter Email'
              required
            />
          </div>
          <div className='mb-4'>
            <p className='mb-2 text-sm font-medium text-gray-700'>Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              className='w-full px-4 py-2 transition-all border border-gray-400 rounded-md outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-300'
              type="password"
              placeholder='Enter Password'
              required
            />
          </div>
          <button
            className='w-full py-2 text-white transition-all bg-gray-800 rounded-md hover:bg-gray-900'
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
