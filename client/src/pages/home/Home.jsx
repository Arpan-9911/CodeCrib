import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RightBar from './RightBar'
import Question from './Question'

const Home = () => {
  const qList = useSelector((state) => state.questionsReducer)

  return (
    <div className="flex flex-auto p-2 gap-4">
      <div className='flex-auto'>
        <div className="flex justify-between">
          <h1 className='font-semibold text-2xl'>Top Questions</h1>
          <Link to={'/questions/ask'} className='bg-blue-600 text-white rounded p-2'>Ask Question</Link>
        </div>
        {qList.data === null ? 'Loading...' : (
          <div>
            <h1 className='font-semibold my-4'>{qList?.data?.length} Questions</h1>
            <div>
              {qList?.data?.map((question, index) => (
                <Question question={question} key={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='md:block hidden'>
        <RightBar />
      </div>
    </div>
  )
}

export default Home