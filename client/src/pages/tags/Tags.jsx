import React from 'react'

import TagList from './TagList'
import Card from './Card'

const Tags = () => {
  return (
    <div className='p-2 flex-auto'>
      <h1 className="text-2xl font-semibold">Tags</h1>
      <p>A tag is a keyword or label that categorizes your question with other similar questions.</p>
      <p>Using the right tags makes it easier for others to find and answer your question.</p>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10'>
        {TagList.map((tag, index) => (
          <Card key={index} tag={tag} />
        ))}
      </div>
    </div>
  )
}

export default Tags