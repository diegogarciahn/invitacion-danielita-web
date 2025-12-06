'use client';

import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

interface PhotoSliderProps {
  images: (string | StaticImageData)[];
  autoplaySpeed?: number;
}

export function PhotoSlider({ images, autoplaySpeed = 4000 }: PhotoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [images.length, autoplaySpeed]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Imágenes */}
      <div className="relative overflow-hidden rounded-lg shadow-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full relative aspect-4/5">
              <Image 
                src={image} 
                alt={`Slide ${index + 1}`} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots de navegación */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-orange-400 w-6' 
                : 'bg-orange-400/30 hover:bg-orange-400/50'
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
