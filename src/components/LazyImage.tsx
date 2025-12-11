import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  rootMargin?: string; // Kept for compatibility but not used
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  placeholderColor = "bg-gray-200",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Stop loading state
  };

  return (
    <div 
      className={`relative overflow-hidden w-full ${!isLoaded ? 'min-h-[200px]' : ''}`}
    >
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center ${placeholderColor} animate-pulse`}>
          {!hasError && <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 text-center">
          <ImageOff size={24} className="mb-2" />
          <span className="text-xs">加载失败</span>
        </div>
      )}

      {/* Actual Image - Always rendered but hidden until loaded */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default LazyImage;