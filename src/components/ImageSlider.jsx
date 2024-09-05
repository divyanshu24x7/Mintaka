import React, { useState, useEffect } from 'react';

const ImageSlider = ({ imageUrls, interval = 3000 }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Clone the first image and place it at the end
  const images = [...imageUrls, imageUrls[0]];

  useEffect(() => {
    const transitionInterval = setInterval(() => {
      setImageIndex((prevIndex) => prevIndex + 1);
    }, interval);

    return () => clearInterval(transitionInterval);
  }, [interval]);

  useEffect(() => {
    if (imageIndex === images.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false); // Disable transition for instant jump
        setImageIndex(0); // Jump back to the first image
      }, 1000); // Adjust this timing if necessary

      setTimeout(() => {
        setIsTransitioning(true); // Re-enable the transition
      }, 1050); // Just after the instant jump
    }
  }, [imageIndex, images.length]);

  return (
    <div className='w-full max-w-[95%] h-full relative overflow-hidden mx-auto'>
      <div
        className={`w-full h-full flex ${isTransitioning ? 'transition-transform duration-1000' : ''}`}
        style={{
          transform: `translateX(${-100 * imageIndex}%)`,
        }}
      >
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            className='img-slider-img'
            alt={`Slide ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
