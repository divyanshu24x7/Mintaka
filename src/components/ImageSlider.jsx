import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = ({ imageUrls, interval = 3000 }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const sliderRef = useRef(null);

  const images = [...imageUrls, imageUrls[0]];

  useEffect(() => {
    const handleTransitionEnd = () => {
      if (imageIndex === images.length - 1) {
        sliderRef.current.style.transition = 'none';
        setImageIndex(0);
        sliderRef.current.getBoundingClientRect();
        setTimeout(() => {
          sliderRef.current.style.transition = 'transform 0.9s ease'; // Slightly faster transition
        }, 50);
      }
    };

    sliderRef.current.addEventListener('transitionend', handleTransitionEnd);

    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => {
        if (prevIndex === images.length - 1) {
          return 0; // Reset immediately when reaching the duplicated image
        } else {
          return prevIndex + 1;
        }
      });
    }, interval * (imageIndex === images.length - 1 ? 0.7 : 1)); // Reduce interval on reset

    return () => {
      sliderRef.current.removeEventListener('transitionend', handleTransitionEnd);
      clearInterval(intervalId);
    };
  }, [imageIndex, images.length, interval]);

  return (
    <div className='w-full h-full relative overflow-hidden'>
      <div
        ref={sliderRef}
        className='w-full h-full flex transition-transform duration-1000'
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
