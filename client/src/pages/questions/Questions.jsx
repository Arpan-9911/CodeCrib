import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Question from './Question'

const Questions = () => {
  const qList = useSelector((state) => state.questionsReducer)

  return (
    <div className="flex-auto p-2">
      <div>
        <div className="flex justify-between">
          <h1 className='font-semibold text-2xl'>All Questions</h1>
          <Link to={'/questions/ask'} className='bg-blue-600 text-white rounded p-2'>Ask Question</Link>
        </div>
        {qList.data === null ? 'Loading...' : (
          <div>
            <h1 className='font-semibold my-4'>{qList && qList?.data?.length} Questions</h1>
            <div>
              {qList && qList?.data?.map((question, index) => (
                <Question question={question} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Questions