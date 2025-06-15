import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaQuestionCircle, FaTags, FaUserFriends, FaUsers } from 'react-icons/fa';

const Sidebar = ({ mobileScreen, setSidebarOpen }) => {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 p-1 rounded ${
    isActive ? 'bg-gray-300' : 'hover:bg-gray-200'
    }`;
  return (
    <div className={`flex flex-col gap-8 p-2 bg-white border-r border-gray-300 ${mobileScreen && 'fixed h-screen'}`}>
      <div className='flex flex-col gap-1'>
        <NavLink to="/" className={navLinkStyle} onClick={() => setSidebarOpen(false)}>
          <FaHome size={20} /> Home
        </NavLink>
        <NavLink to="/questions" className={navLinkStyle} onClick={() => setSidebarOpen(false)}>
          <FaQuestionCircle size={20} /> Questions
        </NavLink>
        <NavLink to="/tags" className={navLinkStyle} onClick={() => setSidebarOpen(false)}>
          <FaTags size={20} /> Tags
        </NavLink>
      </div>
      <div className='flex flex-col gap-1'>
        <NavLink to="/users" className={navLinkStyle} onClick={() => setSidebarOpen(false)}>
          <FaUsers size={20} /> Users
        </NavLink>
        <NavLink to="/social" className={navLinkStyle} onClick={() => setSidebarOpen(false)}>
          <FaUserFriends size={20} /> Social
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar