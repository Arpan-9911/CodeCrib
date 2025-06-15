import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Question = ({question}) => {
  return (
    <div className="flex gap-4 p-2 border-t border-gray-300">
      <div className='min-w-16 text-end text-xs'>
        <p>{question.upVotes.length - question.downVotes.length} votes</p>
        <p>{question.noOfAnswers} answers</p>
      </div>
      <div className='flex-auto'>
        <p className='text-blue-500'>
          <Link to={`/questions/${question._id}`}>{question.questionTitle}</Link>
        </p>
        <p className='text-gray-700 text-sm'>
          {question.questionBody.length > 120
          ? question.questionBody.slice(0, 120) + '...'
          : question.questionBody}
        </p>
        <p className='text-xs flex flex-wrap gap-1 mt-1'>
          {question.questionTags.map((tag, index) => (
            <span key={index} className='bg-gray-300 rounded p-1'>{tag}</span>
          ))}
        </p>
        <p className='text-xs text-end mt-1'>
          <Link to={`/users/${question.userId}`} className='text-blue-500'>{question.userPosted}</Link>
          , asked {moment(question.askedOn).fromNow()}
        </p>
      </div>
    </div>
  )
}

export default Question