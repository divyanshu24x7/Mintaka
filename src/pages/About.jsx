import React from 'react';

const About = () => {
  return (
    <div>
      <div className='flex flex-col items-center max-w-[1200px] mx-auto p-6'>
        <h1 className='text-white text-4xl'>
          About mintaka
        </h1>
        <p className='text-mintakaText text-md py-2'>
          Quick answer to questions you may have
        </p>
        <div className='bg-transparent rounded-lg md:bg-menuGray md:max-w-[55%] w-full p-6'>
          <div className='w-full flex flex-col'>
            <h1 className='text-mintakaText text-2xl'>What is Lorem Ipsum?</h1>
            <p className='text-mintakaText text-md my-2'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
            </p>

            <h1 className='text-mintakaText text-2xl'>
              Why do we use it?
            </h1>
            <p className='text-mintakaText text-md my-2'>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
            </p>

            <h1 className='text-mintakaText text-2xl'>
              Why do we use it?
            </h1>
            <p className='text-mintakaText text-md my-2'>
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
