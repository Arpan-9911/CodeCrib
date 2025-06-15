import React from 'react'
import { useSelector } from 'react-redux'

import Card from './Card'

const Users = () => {
  const userList = useSelector((state) => state.usersReducer)
  return (
    <div className='p-2 flex-auto'>
      <h1 className="text-2xl font-semibold">All Users</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10'>
        {userList?.map((user) => (
          <Card key={user?._id} user={user} />
        ))}
      </div>
    </div>
  )
}

export default Users