import React, { useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { addComment } from '../../action/socialPost'

const CommentBox = ({post, name}) => {
  const [comment, setComment] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return alert("Comment Cannot Be Empty")
    
    try{
      await dispatch(addComment(post._id, {name, content: comment}))
      setComment("")
    }catch(error){
      alert(error.message)
      setComment("")
    }
  }

  return (
    <div className="mt-4">
      {/* List */}
      <div className="space-y-2 mt-4">
        {post.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <div>
            <h2 className='font-semibold p-2 text-xl'>All Comments</h2>
            {post.comments.map((comment, i) => (
              <div key={i} className="border-t border-gray-300 p-2">
                <p>{comment.content}</p>
                {/* <p className="text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-500">{moment(comment.createdAt).fromNow()}</p> */}
                <div className='text-gray-500 text-sm flex gap-2 justify-end'>
                  <Link to={`/users/${comment.userId}`} className='text-blue-500'>{comment.name}</Link>
                  <div>Commented {moment(comment.createdAt).fromNow()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-6">
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-400 p-2 rounded resize-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default CommentBox