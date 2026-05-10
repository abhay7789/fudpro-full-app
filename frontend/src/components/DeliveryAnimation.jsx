import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

const DeliveryAnimation = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box className="parallax-container" style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '35vh',
      minHeight: '260px',
      overflow: 'hidden',
      zIndex: 1, // behind the text to avoid completely blocking, but we will fix text overlap anyway
      pointerEvents: 'none'
    }}>
      {/* Background Cityscape 3D Layer */}
      <div 
        className={`parallax-layer cityscape-3d ${isDark ? 'dark' : 'light'}`} 
        style={{
          backgroundImage: 'url(/city_3d.png)',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
          height: '100%',
          width: '200%',
          opacity: isDark ? 0.4 : 0.8,
          filter: isDark ? 'brightness(0.6) saturate(0.8)' : 'none',
          animation: 'parallax-scroll 60s linear infinite',
        }}
      />
      
      {/* Foreground Road */}
      <div className={`parallax-layer road ${isDark ? 'dark' : 'light'}`} />
      
      {/* The Animated Rider */}
      <div className="rider-container-enhanced">
        <div className="rider-bounce">
          {/* Dynamic Shadow that scales when bouncing */}
          <div className="rider-shadow" style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '12px',
            background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            filter: 'blur(8px)',
          }} />

          {/* Premium Vector Delivery Rider */}
          <div className="rider-bounce-3d">
            <img 
              src="/scooter_transparent.png" 
              alt="Delivery Rider" 
              style={{ 
                width: '260px', 
                height: 'auto', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))',
                transform: 'translateY(10px)'
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Overlay gradient to blend with the bottom smoothly */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: '40px',
        background: isDark 
          ? 'linear-gradient(to top, #0A0A0B, transparent)' 
          : 'linear-gradient(to top, #FEFCFA, transparent)',
        zIndex: 10
      }} />
    </Box>
  );
};

export default DeliveryAnimation;

