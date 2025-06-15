import React from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'

import Avatar from '../../components/avatar/Avatar'
import Answer from './Answer'
import PostAnswer from './PostAnswer'
import { deleteQuestion, voteQuestion } from '../../action/questions';
import socket from '../../socket'

const QuestionDetails = () => {
  const qList = useSelector((state) => state.questionsReducer)
  const {id} = useParams()
  const question = qList.data && qList.data.filter(q => q._id == id)[0]

  const user = useSelector(state => state.currentUserReducer)
  const baseURL = "http://localhost:5173";
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShare = async () => {
    const postURL = `${baseURL}${location.pathname}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${question.userPosted}'s question!`,
          text: question.questionTitle,
          url: postURL,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(postURL);
        alert("Post link copied to clipboard!");
      } catch (error) {
        alert(error.message || "Failed to copy link to clipboard");
      }
    }
  }

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this question?")) {
      try{
        await dispatch(deleteQuestion(id, navigate));
      } catch (error) {
        alert(error.message);
      }
    }
  }

  const handleVote = async (value) => {
    if(!user) return navigate('/login')
    try{
      await dispatch(voteQuestion(id, value));
      socket.emit("sendNotification", {
        recipientId: question.userId,
        message: `${ user.result.name } voted your question.`
      });
    } catch (error) {
      alert(error.message);
    }
  }
  
  return (
    <>
      {question && (
        <div className='p-2 flex-auto'>
          <h1 className='text-2xl font-semibold'>{question.questionTitle}</h1>
          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <div className='cursor-pointer'><FaCaretUp size={30} onClick={() => handleVote('upVote')} /></div>
              <div className='text-2xl'>{question.upVotes.length - question.downVotes.length}</div>
              <div className='cursor-pointer'><FaCaretDown size={30} onClick={() => handleVote('downVote')} /></div>
            </div>
            <div className="flex-auto">
              <p className='text-gray-700 whitespace-pre-wrap'>{question.questionBody}</p>
              <p className='flex flex-wrap gap-1 mt-2'>
                {question.questionTags.map((tag, index) => (
                  <span key={index} className='bg-gray-300 rounded py-1 px-2'>{tag}</span>
                ))}
              </p>
              <div className="flex gap-4 mt-4">
                <button type="button" onClick={handleShare} className='text-gray-700 cursor-pointer'>Share</button>
                {user?.result?._id === question?.userId && <button type="button" onClick={handleDelete} className='text-gray-700 cursor-pointer'>Delete</button>}
              </div>
              <div className='mt-2 flex items-center justify-end gap-2'>
                <div className='justify-end flex items-center gap-2'>
                  <Avatar character={question.userPosted.charAt(0).toUpperCase()} bgColor="bg-blue-500" px="px-3" py="py-1" color="text-white" />
                  <Link to={`/users/${question.userId}`} className='text-blue-500'>{question.userPosted}</Link>
                </div>
                <p className='text-end'>Asked {moment(question.askedOn).fromNow()}</p>
              </div>
            </div>
          </div>
          <h4 className='my-4 text-xl'>{question.noOfAnswers} Answers</h4>
          <div>
            {question?.answer?.map((ans, index) => (
              <Answer key={index} answer={ans} />
            ))}
          </div>
          {/* Post Answer */}
          <div className="mt-4 border-t border-gray-300">
            <PostAnswer qUserId={question.userId} />
          </div>
        </div>
      )}
    </>
  )
}

export default QuestionDetails