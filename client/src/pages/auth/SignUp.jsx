import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import favicon from '../../assets/favicon.ico'
import { googleLogin, signUp } from '../../action/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(authData.name && authData.email && authData.password) {
      try{
        await dispatch(signUp(authData, navigate));
        alert("Signup successful!");
      } catch(error) {
        alert(error.message);;
      }
    }else{
      alert("Please fill all the fields");
    }
  };

  return (
    <div className='p-2 flex-auto flex flex-col justify-center items-center'>
      <div className='flex items-center gap-2'>
        <img src={favicon} alt="Logo" className='w-8' />
        <h1 className='font-bold text-2xl'>CodeCrib</h1>
      </div>
      <form onSubmit={handleSubmit} className='bg-gray-200 p-4 mt-4 rounded'>
        <h1 className='text-xl font-semibold mb-4 text-center'>Sign Up</h1>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id='name'
            value={authData.name}
            onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
            className='w-full bg-white border border-gray-400 focus:outline-none rounded-md p-2'
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id='email'
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            className='w-full bg-white border border-gray-400 focus:outline-none rounded-md p-2'
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id='password'
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            className='w-full bg-white border border-gray-400 focus:outline-none rounded-md p-2'
          />
        </div>
        <div className='flex gap-4 mt-4'>
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Sign Up</button>
        </div>
      </form>
      <p className='my-4'>Already have an account? <Link to={'/login'} className='text-blue-500'>Login</Link></p>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const decoded = jwtDecode(credentialResponse.credential);
          dispatch(googleLogin(decoded, navigate))
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  )
}

export default SignUp