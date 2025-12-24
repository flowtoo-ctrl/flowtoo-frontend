import React from 'react';
import './Loading.css';

const Loading = ({ fullScreen = false, message = "Loading..." }) => {
  const containerClass = fullScreen ? "loading-container fullscreen" : "loading-container";
  
  return (
    <div className={containerClass}>
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export const LoadingSkeleton = ({ count = 1, height = "20px", className = "" }) => {
  return (
    <div className={`skeleton-container ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="skeleton" 
          style={{ height }}
        ></div>
      ))}
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-price"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
};

export default Loading;
