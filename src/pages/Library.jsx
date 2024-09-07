import React from 'react';
const Library = () => {
  return (
    <div className='container mx-auto relative p-6'>
      <h1 className='text-white text-2xl mb-4'>User Library</h1>
      <div className='flex'>
        <input
          type='text'
          placeholder='Search'
          className='w-[30%] p-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-700'
        />
      </div>
    </div>
  );
};

export default Library;
