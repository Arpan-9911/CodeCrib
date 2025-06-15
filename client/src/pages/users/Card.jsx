import React from 'react'
import { Link } from 'react-router-dom'

import Avatar from '../../components/avatar/Avatar'

const Card = ({user}) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <Link to={`/users/${user._id}`} className='flex items-center gap-2'>
        <Avatar character={user.name.charAt(0).toUpperCase()} px="px-3" py="py-2" />
        {user.name}
      </Link>
      <p className='text-sm text-gray-600 mt-2'>{user.about}</p>
    </div>
  )
}

export default Card