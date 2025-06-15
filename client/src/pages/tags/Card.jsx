import React from 'react'

const Card = ({tag}) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <p className='text-blue-600 bg-blue-100 w-fit font-semibold px-3 py-1 rounded'>{tag.name}</p>
      <p className='text-sm text-gray-600 mt-2'>{tag.desc}</p>
    </div>
  )
}

export default Card