import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
      <div className='flex flex-col gap-4 pt-6 pl-[10%] text-[15px]'>

          <NavLink className='flex items-center gap-3 px-3 py-2 border border-r-0 border-gray-300 rounded-l' to="/add">
               <img className='w-5 h-5' src={assets.add_icon} alt="" />
               <p className='hidden md:block'>Add Items</p>
          </NavLink>

          <NavLink className='flex items-center gap-3 px-3 py-2 border border-r-0 border-gray-300 rounded-l' to="/list">
               <img className='w-5 h-5' src={assets.list_icon} alt="" />
               <p className='hidden md:block'>List Items</p>
          </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
