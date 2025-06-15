import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'

import Avatar from '../../components/avatar/Avatar'
import EditUser from './EditUser'
import UserDesc from './UserDesc'
import { sendFriendRequest, sharePoints } from '../../action/users'
import socket from '../../socket'

const UserDetail = () => {
  const [editForm, setEditForm] = useState(false)
  const userList = useSelector(state => state.usersReducer)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userProfile = userList.find(user => user._id === id)
  const currentUser = useSelector(state => state.currentUserReducer)

  const friendRequest = async () => {
    if (!currentUser) return navigate('/login');
    try {
      await dispatch(sendFriendRequest(currentUser?.result?._id, id));
      alert("Friend request sent!");
      socket.emit("sendNotification", {
        recipientId: id,
        message: `${ currentUser?.result?.name } sent you a friend request!`
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const [amount, setAmount] = useState('');
  const handleSharePoints = async () => {
    if (!currentUser) return navigate('/login');
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return alert("Enter a valid amount");
    try {
      await dispatch(sharePoints(id, numericAmount));
      socket.emit("sendNotification", {
        recipientId: id,
        message: `${ currentUser?.result?.name } shared ${amount} points with you!`
      })
      setAmount('');
      alert("Points shared successfully!");
    } catch (error) {
      alert(error.message);
      setAmount('');
    }
  };

  return (
    userProfile && <div className='p-2 flex-auto'>
      <div className='flex gap-2 justify-between items-start flex-col md:flex-row'>
        <div className="flex-auto flex gap-4 items-start">
          <Avatar character={userProfile?.name.charAt(0).toUpperCase()} bgColor="bg-purple-700" color="text-purple-200" px="px-10" py="py-6" borderRadius="rounded-no" fontSize={"text-6xl"} />
          <div>
            <h1 className="md:text-2xl text-xl font-semibold">{userProfile?.name}</h1>
            <p className='text-sm md:text-base'>{userProfile?.about}</p>
            <p className='text-sm text-gray-600 mt-4'>Joined {moment(userProfile?.joinedOn).fromNow()}</p>
            {currentUser && currentUser?.result?._id !== id && 
              <div className='flex flex-col items-start'>
                <button type="button" className='text-purple-700 cursor-pointer' onClick={friendRequest}>Send Friend Request</button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-purple-700 cursor-pointer"
                    onClick={handleSharePoints}
                    disabled={amount <= 0}
                  >
                    Share Points
                  </button>
                  <input
                    type="number"
                    placeholder="10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-gray-400 rounded px-2 w-20"
                    min="1"
                  />
                </div>
              </div>
            }
          </div>
        </div>
        {currentUser?.result?._id === id && <button type="button" className='bg-blue-500 text-white hover:bg-blue-700 p-2 rounded' onClick={() => setEditForm(!editForm)}>Edit Profile</button>}
      </div>
      <div className="mt-4">
        {editForm ? 
          <EditUser setEditForm={setEditForm} user={userProfile} />
        : 
          <UserDesc userProfile={userProfile} currentUser={currentUser} id={id} />
        }
      </div>
    </div>
  )
}

export default UserDetail