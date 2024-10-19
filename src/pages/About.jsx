import React from 'react';

const About = () => {
  return (
    <div className='flex flex-col items-center max-w-[1200px] mx-auto p-6'>
      <h1 className='text-white text-4xl'>
        About Mintaka
      </h1>
      <p className='text-mintakaText text-md py-2'>
        Discover the concept behind Mintaka, our vision, and the minds behind it.
      </p>
      <div className='bg-transparent rounded-lg md:bg-menuGray md:max-w-[55%] w-full p-6'>
        <div className='w-full flex flex-col'>
          
          <h1 className='text-mintakaText text-2xl'>What is Mintaka?</h1>
          <p className='text-mintakaText text-md my-2'>
            Mintaka is an anime discovery platform designed to help users find others with similar tastes. It provides personalized anime recommendations by analyzing user preferences and comparing them to others in the community. Whether you're searching for your next favorite series or simply exploring new genres, Mintaka connects you to users with matching tastes, opening up a world of curated anime lists.
          </p>

          <h1 className='text-mintakaText text-2xl'>How does it work?</h1>
          <p className='text-mintakaText text-md my-2'>
            Mintaka analyzes user data, including watched anime, ratings, and genres, to create a similarity profile. By comparing profiles, it recommends users whose lists might align with your tastes. This allows you to explore anime recommendations that are tailored to your preferences based on real user data.
          </p>

          <h1 className='text-mintakaText text-2xl'>Our Vision</h1>
          <p className='text-mintakaText text-md my-2'>
            The vision behind Mintaka is to create a community-driven platform where anime fans can discover content they love by connecting with others who share their tastes. As the platform grows, we aim to refine our recommendation algorithms to provide deeper insights into user preferences and facilitate meaningful connections within the anime community.
          </p>

          <h1 className='text-mintakaText text-2xl'>Who created Mintaka?</h1>
          <p className='text-mintakaText text-md my-2'>
            Mintaka was developed by B.Tech sudents <a href='https://github.com/divyanshu24x7/' target="_blank"><u>Divyanshu Kumar</u></a> and <a href='https://github.com/iCaran' target="_blank"><u>Karan Pratap Shaw</u></a>, an anime enthusiast and tech enthusiast. Built with passion and a deep love for the anime community, Mintaka strives to become the go-to platform for discovering and discussing anime.
          </p>

          <p className='text-mintakaText text-md my-2'>
            Mintaka is an open source project, <a href='https://github.com/divyanshu24x7/Mintaka' target="_blank"><u>Click here to check out the code.</u></a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
