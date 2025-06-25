import React from 'react'
import { useDispatch } from 'react-redux'

import { acceptFriendRequest, rejectFriendRequest, removeFriend, toggleNotification } from '../../action/users'
import SubscriptionCards from './SubscriptionCards'
import { Link } from 'react-router-dom'

const UserDesc = ({userProfile, currentUser, id}) => {
  const dispatch = useDispatch()

  const acceptFriend = async (friendId) => {
    try {
      await dispatch(acceptFriendRequest(currentUser?.result?._id, friendId));
      alert("Friend request accepted!");
    } catch (error) {
      alert(error.message);
    }
  }

  const rejectFriend = async (friendId) => {
    try {
      await dispatch(rejectFriendRequest(currentUser?.result?._id, friendId));
      alert("Friend request rejected!");
    } catch (error) {
      alert(error.message);
    }
  }

  const removeExistingFriend = async (friendId) => {
    try {
      await dispatch(removeFriend(currentUser?.result?._id, friendId));
      alert("Friend removed!");
    } catch (error) {
      alert(error.message);
    }
  }

  const handleNotification = async () => {
    try {
      await dispatch(toggleNotification(currentUser?.result?._id));
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {currentUser?.result?._id === id && (
        <div>
          <div>
            <label className="text-lg font-medium flex gap-2 items-center">
              <input
                type="checkbox"
                checked={userProfile?.notificationEnabled}
                onChange={handleNotification}
                className='w-5 h-5'
              />
              Notifications {userProfile?.notificationEnabled ? 'On' : 'Off'}
            </label>
          </div>
          <div className='flex flex-col gap-1'>
            <h1 className='text-xl font-semibold'>Friends</h1>
            {userProfile?.friends?.length > 0 ? (
              userProfile?.friends?.map((friend, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Link to={`/users/${friend?.userId}`} className='text-purple-700'>{friend?.name}</Link>
                <button
                  type="button"
                  className='bg-red-500 text-white p-1 rounded'
                  onClick={() => removeExistingFriend(friend?.userId)}
                >Remove</button>
              </div>
            ))) : (
              <p>No friends Yet</p>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <h1 className='text-xl font-semibold'>Sent Friend Requests</h1>
            {userProfile?.sentRequests?.length > 0 ? (
              userProfile?.sentRequests?.map((friend, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Link to={`/users/${friend?.userId}`} className='text-purple-700'>{friend?.name}</Link>
              </div>
            ))) : (
              <p>No Sent Friend Requests</p>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <h1 className='text-xl font-semibold'>Received Friend Requests</h1>
            {userProfile?.friendRequests?.length > 0 ? (
              userProfile?.friendRequests?.map((friend, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Link to={`/users/${friend?.userId}`} className='text-purple-700'>{friend?.name}</Link>
                <button
                  type="button"
                  onClick={() => acceptFriend(friend?.userId)}
                  className='bg-blue-500 text-white p-1 rounded'
                >Accept</button>
                <button
                  type="button"
                  onClick={() => rejectFriend(friend?.userId)}
                  className='bg-red-500 text-white p-1 rounded'
                >Reject</button>
              </div>
            ))) : (
              <p>No Received Friend Requests</p>
            )}
          </div>
        </div>
      )}
      <div className='flex gap-2 flex-col'>
        <div>
          <h1 className='text-xl font-semibold'>Points Earned: {userProfile?.points}</h1>
        </div>
        <div>
          <h1 className='text-xl font-semibold'>Watched Tags</h1>
          <p>
            {userProfile?.tags?.length > 0 ? (
              userProfile?.tags?.map((tag, index) => (
                <span key={index}>#{tag}, </span>
              ))
            ) : (
              <p>No Watched Tags</p>
            )}
          </p>
        </div>
        {currentUser?.result?._id === id && (
          <div>
            <SubscriptionCards currentUser={userProfile} />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDesc