
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string }> = ({ size = 'w-8 h-8' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-blue-500`}></div>
  );
};

export default LoadingSpinner;
