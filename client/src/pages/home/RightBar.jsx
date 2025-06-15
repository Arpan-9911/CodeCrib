import React from 'react'
import { FaPen, FaRegComment  } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RightBar = () => {
  const tags = ['javascript', 'python', 'java', 'html', 'css', 'c++', 'php', 'sql', 'nodejs', 'mongodb']
  return (
    <div className="flex flex-col gap-4 max-w-72">
      <div className='bg-orange-50 border border-orange-300 rounded'>
        <div className='p-4 border-b border-orange-300'>
          <h1 className='font-semibold'>The Overflow Blog</h1>
          <div className="mt-4 flex flex-col gap-4">
            <div className='flex gap-4'>
              <div><FaPen size={16} /></div>
              <p className='text-xs leading-tight'>Better vibes and vibe coding with Gemini 2.5</p>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <h1 className='font-semibold'>Featured On Meta</h1>
          <div className="mt-4 flex flex-col gap-4">
            <div className='flex gap-4'>
              <div><FaRegComment size={16} /></div>
              <p className='text-xs leading-tight'>How Can We Bring More Fun to the Stack Ecosystem? Community Ideas Welcome!</p>
            </div>
            <div className="flex gap-4">
              <div><FaRegComment size={16} /></div>
              <p className='text-xs leading-tight'>Thoughts on the future of Stack Exchange site customisation</p>
            </div>
            <div className="flex gap-4">
              <div><FaRegComment size={16} /></div>
              <p className='text-xs leading-tight'>How can I revert the style/layout changes to comments?</p>
            </div>
            <div className="flex gap-4">
              <div><FaRegComment size={16} /></div>
              <p className='text-xs leading-tight'>Policy: Generative AI (e.g., ChatGPT) is banned</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className='font-semibold'>Related Tags</h1>
        <div className="mt-4 flex flex-col gap-4 items-start">
          {tags.map((tag, index) => (
            <Link to={`/tags/${tag}`} key={index} className='rounded px-4 text-xs py-1 bg-gray-200'>{tag}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightBar