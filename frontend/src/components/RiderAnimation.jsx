import React from 'react';

const RiderAnimation = () => (
  <div className="w-full h-40 overflow-hidden relative bg-gray-50/50 dark:bg-gray-800/30 rounded-[40px] border border-gray-100 dark:border-gray-700">
    {/* Scrolling Background */}
    <div 
      className="absolute inset-0 flex"
      style={{
        width: '400%',
        animation: 'scroll 30s linear infinite'
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 w-1/4 h-full flex items-end justify-around pb-4 opacity-20">
          <div className="w-12 h-24 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
          <div className="w-16 h-32 bg-gray-400 dark:bg-gray-500 rounded-t-lg"></div>
          <div className="w-20 h-40 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
          <div className="w-12 h-20 bg-gray-400 dark:bg-gray-500 rounded-t-lg"></div>
        </div>
      ))}
    </div>
    
    {/* Delivery Rider */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-10 bg-blue-600 rounded-full relative">
          {/* Helmet */}
          <div className="absolute -top-4 left-6 w-6 h-6 bg-cyan-400 rounded-full border-2 border-blue-600"></div>
          {/* Delivery Box */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-premium-orange rounded-md flex items-center justify-center shadow-md">
            <span className="text-[10px] text-white font-bold">fp</span>
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-2 left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400"></div>
          <div className="absolute -bottom-2 right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-400"></div>
        </div>
      </div>
    </div>
  </div>
);

export default RiderAnimation;
