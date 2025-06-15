import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { postAnswer } from '../../action/answers';
import socket from '../../socket'

const PostAnswer = ({qUserId}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.currentUserReducer)
  const { id } = useParams()
  const [answerBody, setAnswerBody] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!user) return navigate('/login')
    try{
      await dispatch(postAnswer(id, { answerBody, userAnswered: user.result.name}))
      socket.emit("sendNotification", {
        recipientId: qUserId,
        message: `${ user.result.name } answered your question.`
      });
      setAnswerBody('')
    } catch(error) {
      alert(error.message);
    }
  }

  return (
    <div><div className="mt-10 flex flex-wrap justify-between items-baseline">
      <h1 className='text-xl'>Post Your Answer</h1>
      <Link to={`/questions/ask`} className='bg-blue-500 text-white hover:bg-blue-700 p-2 rounded'>Ask Question</Link>
    </div>
      <form className='my-3' onSubmit={handleSubmit}>
        <textarea
          id='yourAnswer'
          cols="30"
          rows="10"
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
        ></textarea>
        <input type="submit" value="Post Your Answer" className='bg-blue-500 hover:bg-blue-700 p-2 rounded text-white mt-2' />
      </form>
    </div>
  )
}

export default PostAnswer