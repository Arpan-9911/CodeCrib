import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { askQuestion } from '../../action/questions'

const AskQuestion = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.currentUserReducer)

  const [questionData, setQuestionData] = useState({ questionTitle: '', questionBody: '', tags: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!user) return navigate('/login')
    try{
      if(questionData.questionTitle && questionData.questionBody && questionData.tags) {
        const formattedTags = questionData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        await dispatch(askQuestion({ ...questionData, questionTags: formattedTags, userPosted: user.result.name }, navigate))
        setQuestionData({ questionTitle: '', questionBody: '', tags: '' })
      } else {
        alert("Please fill all the fields");
      }
    } catch(error) {
      alert(error.message);
      setQuestionData({ questionTitle: '', questionBody: '', tags: '' })
    }
  }

  return (
    <div className='p-2 flex-auto'>
      <h1 className="text-2xl font-semibold md:ps-10 ps-5">Ask a Public Question</h1>
      <form onSubmit={handleSubmit} className='md:p-10 p-5'>
        <div className='mb-2'>
          <label htmlFor="questionTitle" className='font-semibold text-xl'>Title</label>
          <p>Be specific and imagine you're asking a question to another person.</p>
          <input
            type="text"
            id='questionTitle'
            value={questionData.questionTitle}
            onChange={(e) => setQuestionData({ ...questionData, questionTitle: e.target.value })}
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
          />
        </div>
        <div className="mb-2">
          <label htmlFor="questionBody" className='font-semibold text-xl'>Body</label>
          <p>Include all the information someone would need to answer your question.</p>
          <textarea
            id='questionBody'
            cols="30"
            rows="8"
            value={questionData.questionBody}
            onChange={(e) => setQuestionData({ ...questionData, questionBody: e.target.value })}
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2'
          ></textarea>
        </div>
        <div className="mb-2">
          <label htmlFor="questionTags" className='font-semibold text-xl'>Tags</label>
          <p>Add up to 5 tags (comma seperated) to describe what your question is about.</p>
          <input
            type="text"
            id='questionTags'
            value={questionData.tags}
            onChange={(e) => setQuestionData({ ...questionData, tags: e.target.value })}
            className='w-full border border-gray-400 focus:outline-none rounded-md p-2' />
        </div>
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 p-2 rounded text-white mt-2'>Post Your Question</button>
      </form>
    </div>
  )
}

export default AskQuestion