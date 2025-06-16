import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux'
import { deleteAnswer, voteAnswer } from '../../action/answers';

const Answer = ({answer}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.currentUserReducer)
  const { id } = useParams()

  const handleDelete = async () => {
    if(!user) return navigate('/login')
    if(window.confirm("Are you sure you want to delete this answer?")) {
      try{
        await dispatch(deleteAnswer(id, answer._id));
      } catch (error) {
        alert(error.message);
      }
    }
  }

  const handleVote = async (value) => {
    if(!user) return navigate('/login')
    try{
      await dispatch(voteAnswer(id, {answerId: answer._id, value}));
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className='border-t border-gray-300 p-2'>
      <div className='flex gap-8'>
        <div className="flex flex-col items-center">
          <div className='cursor-pointer'><FaCaretUp size={20} onClick={() => handleVote("upVote")} /></div>
          <div className='text-xl'>{answer.upVotes.length - answer.downVotes.length}</div>
          <div className='cursor-pointer'><FaCaretDown size={20} onClick={() => handleVote("downVote")} /></div>
        </div>
        <div>
          <p className='text-gray-700 text-sm flex-auto'>{answer.answerBody}</p>
          {answer.userId === user?.result?._id && <button type="button" onClick={handleDelete} className='mt-2 text-gray-700 cursor-pointer text-sm'>Delete</button>}
        </div>
      </div>
      <p className='text-xs text-end mt-1'>
        <Link to={`/users/${answer.userId}`} className='text-blue-500'>{answer.userAnswered}</Link>
        , answered {moment(answer.answeredOn).fromNow()}
      </p>
    </div>
  )
}

export default Answer