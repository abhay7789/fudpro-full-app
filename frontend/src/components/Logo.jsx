import React from 'react';

const Logo = ({ className }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <div className="w-10 h-10 bg-premium-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none">
      <span className="text-white text-2xl font-black">f</span>
    </div>
    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">fudPro</span>
  </div>
);

export default Logo;
