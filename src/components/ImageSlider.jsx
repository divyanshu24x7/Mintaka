import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = ({ imageUrls, interval = 3000 }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  const images = [...imageUrls, imageUrls[0]];

  useEffect(() => {
    const transitionInterval = setInterval(() => {
      if (imageIndex === images.length - 1) {
        // Temporarily disable the transition for the blink effect
        setIsTransitioning(false);
        setImageIndex(0);
      } else {
        setImageIndex((prevIndex) => prevIndex + 1);
      }
    }, interval);

    // Cleanup the interval on component unmount
    return () => clearInterval(transitionInterval);
  }, [imageIndex, images.length, interval]);

  useEffect(() => {
    if (!isTransitioning) {
      // Reset the transition and re-enable it after a short delay
      const resetTransition = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);

      return () => clearTimeout(resetTransition);
    }
  }, [isTransitioning]);

  return (
    <div className='w-full h-full relative overflow-hidden'>
      <div
        ref={sliderRef}
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
