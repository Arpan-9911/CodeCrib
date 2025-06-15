import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { updateUser } from '../../action/users'

const EditUser = ({setEditForm, user}) => {
  const [name, setName] = useState(user.name)
  const [about, setAbout] = useState(user.about)
  const [tags, setTags] = useState(user.tags.join(', '))

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedUser = {
      name,
      about,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    }
    try{
      await dispatch(updateUser(updatedUser))
      setEditForm(false)
      alert("Profile updated successfully!");
    } catch(error) {
      alert(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className='text-xl font-semibold mb-4'>Edit Your Profile</h1>
        <div>
          <label htmlFor="name" className='block mb-1 font-medium'>Name</label>
          <input
            type="text"
            id='name'
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="about" className='block mb-1 font-medium'>About</label>
          <textarea
            id='about'
            cols="30"
            rows="5"
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="tags" className='block mb-1 font-medium'>Tags (comma-separated)</label>
          <input
            type="text"
            id='tags'
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div className='flex gap-4 mt-4'>
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Update</button>
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => setEditForm(false)}>Close</button>
        </div>
      </form>
    </div>
  )
}

export default EditUser