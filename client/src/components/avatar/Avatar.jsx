import React from 'react'

const Avatar = ({character, px, py, borderRadius, bgColor, color, fontSize}) => {
  return (
    <div className={`${px || 'px-2'} ${py || 'py-2'} ${borderRadius || 'rounded-full'} ${bgColor || 'bg-gray-200'} ${color || 'text-gray-600'} ${fontSize || 'text-sm'} flex items-center font-bold justify-center`}>{character}</div>
  )
}

export default Avatar