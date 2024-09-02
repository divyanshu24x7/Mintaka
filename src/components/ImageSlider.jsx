import React, { useState, useEffect } from 'react';

const ImageSlider = ({ imageUrls, interval = 3000 }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length === 0) return; // No images to slide

    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      let temp = imageUrls[2];
    }, interval);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [imageUrls.length, interval]);

  return (
    <div className='w-full h-full relative overflow-hidden'>
      <div
        className='w-full h-full flex transition-transform duration-1000'
        style={{
          transform: `translateX(${-100 * imageIndex}%)` // Adjust for duplicated images

        }}
      >
        {imageUrls.map((url) => (
          <img
            key={url}
            src={url}
            className='img-slider-img'
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
