import React from 'react';
import { assets } from './../assets/assets';

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-5 px-[4%] justify-between'>
      <div
        style={{ fontFamily: 'FZYaoTi', fontWeight: 'bold' }}
        className='text-2xl sm:text-3xl text-black'
      >
        Technical Round
      </div>
      <button
        onClick={() => setToken('')}
        className='px-5 py-2 text-xs text-white transition-all bg-gray-900 rounded-full hover:bg-gray-700 sm:px-7 sm:py-2 sm:text-sm'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
