import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createSocialPost } from '../../action/socialPost'

const NewPost = () => {
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUserReducer?.result)

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files)
    setMediaFiles(prev => [...prev, ...files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Login required')
      return navigate('/login')
    }

    if (!content && mediaFiles.length === 0) {
      return alert('Post must contain text or media.')
    }

    const formData = new FormData()
    formData.append('name', user.name)
    formData.append('content', content)
    mediaFiles.forEach((file) => {
      formData.append('media', file)
    })

    try{
      await dispatch(createSocialPost(formData, navigate))
      alert('Post created successfully')
      setContent('')
      setMediaFiles([])
    } catch(error) {
      alert(error.message)
      setContent('')
      setMediaFiles([])
    }
  }

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <textarea
          className="w-full border border-gray-400 rounded p-2"
          rows="4"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaChange}
          className="block border border-gray-400 p-2 rounded"
        />

        {/* Preview Section */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {mediaFiles.map((file, index) => {
              const url = URL.createObjectURL(file)
              return file.type.startsWith('image') ? (
                <img key={index} src={url} alt="preview" className="h-20 w-full object-contain rounded" />
              ) : (
                <video key={index} src={url} controls className="w-full h-20 rounded" />
              )
            })}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default NewPost