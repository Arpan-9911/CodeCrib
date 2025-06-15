import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch, FaBars } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux';

import faviconImage from '../../assets/favicon.ico'
import Avatar from '../avatar/Avatar'
import {setCurrentUser} from '../../action/currentUser'


const Navbar = ({ mobileScreen, setSidebarOpen, sidebarOpen }) => {
  const user = useSelector((state) => state.currentUserReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
    dispatch(setCurrentUser(null))
    setShowMenu(false)
  }

  useEffect(() => {
    const token = user?.token
    if (token) {
      const decodedToken = jwtDecode(token)
      if(decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout()
      }
    }
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('profile'))))
  }, [user?.token, dispatch])

  return (
    <div className='p-2 border-b border-b-gray-300 border-t-2 border-orange-600 sticky top-0 bg-white'>
      <div className="max-w-7xl flex items-center justify-between mx-auto gap-2">
        {
          mobileScreen && <FaBars size={24} className='md:hidden block mx-2' onClick={() => setSidebarOpen(!sidebarOpen)} />
        }
        <Link to={"/"} className='flex items-center gap-1 hover:bg-gray-200 p-2 rounded'>
          <img src={faviconImage} alt="Logo" className='w-8' />
          <h1 className='font-bold text-xl sm:block hidden'>CodeCrib</h1>
        </Link>
        <div className='flex items-center gap-2 flex-auto'>
          <Link to={"/about"} className='hover:bg-gray-200 p-2 rounded-full text-sm text-gray-600 md:block hidden'>About</Link>
          <Link to={"/products"} className='hover:bg-gray-200 p-2 rounded-full text-sm text-gray-600'>Products</Link>
          <Link to={"/overflowAI"} className='hover:bg-gray-200 p-2 rounded-full text-sm text-gray-600 md:block hidden'>OverflowAI</Link>
          <div className="flex-auto relative sm:block hidden">
            <input type="text" placeholder="Search" className='p-2 pl-10 rounded-full border border-gray-300 w-full' />
            <FaSearch className='absolute left-3 top-3 text-gray-400' size={20} />
          </div>
        </div>
        {user === null ? (
          <div className='flex items-center gap-2'>
            <Link to={"/login"} className='border border-blue-500 hover:bg-blue-200 p-2 rounded text-sm'>Login</Link>
            <Link to={"/register"} className='bg-blue-500 hover:bg-blue-700 p-2 rounded text-sm text-white'>SignUp</Link>
          </div>
        ) : (
          <div className="relative">
            <div onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
              <Avatar character={user.result.name.charAt(0).toUpperCase()} px="px-3" py="py-2" bgColor="bg-blue-500" color="text-white" />
            </div>
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white border shadow-md rounded w-40 z-50">
                <Link to={`/users/${user.result._id}`} className="block px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => setShowMenu(false)}>Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar