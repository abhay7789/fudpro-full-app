import React from 'react';
import { Box, Group, Text } from '@mantine/core';
import { motion } from 'framer-motion';

export const BackgroundBlobs = () => (
  <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
    <motion.div
      animate={{ 
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: 'absolute', top: '10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(252, 128, 25, 0.05) 0%, rgba(255,255,255,0) 70%)' }}
    />
    <motion.div
      animate={{ 
        x: [0, -40, 0],
        y: [0, 60, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      style={{ position: 'absolute', top: '40%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 229, 255, 0.03) 0%, rgba(255,255,255,0) 70%)' }}
    />
  </Box>
);

export const WaveDivider = ({ color = "#fff", flip = false }) => (
  <Box style={{ 
    position: 'absolute', 
    bottom: flip ? 'auto' : -1, 
    top: flip ? -1 : 'auto',
    left: 0, 
    width: '100%', 
    overflow: 'hidden', 
    lineHeight: 0,
    transform: flip ? 'rotate(180deg)' : 'none',
    zIndex: 5
  }}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: 30 }}>
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C49.1,34.33,105.73,55.14,162.27,67.29,218.81,79.44,271.66,70.26,321.39,56.44Z" fill={color}></path>
    </svg>
  </Box>
);

export const Landmark = ({ type, style }) => {
  const landmarks = {
    indiaGate: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M20,95 L20,40 Q20,10 50,10 Q80,10 80,40 L80,95 M35,95 L35,70 Q35,55 50,55 Q65,55 65,70 L65,95" />
        <rect x="15" y="90" width="70" height="5" />
      </svg>
    ),
    charminar: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <rect x="25" y="40" width="50" height="50" />
        <path d="M25,40 L20,10 M75,40 L80,10 M40,40 L40,5 M60,40 L60,5" stroke="currentColor" strokeWidth="4" />
        <rect x="20" y="85" width="60" height="10" />
      </svg>
    ),
    howrahBridge: (
      <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M0,80 H200 M20,80 L20,20 Q100,60 180,20 L180,80 M20,20 L0,20 M180,20 L200,20" />
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={i} x1={30 + i * 15} y1={80} x2={30 + i * 15} y2={40 + Math.sin(i * 0.5) * 10} />
        ))}
      </svg>
    ),
    gateway: (
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M10,90 L10,30 H90 L90,90 M30,90 V50 Q30,40 50,40 Q70,40 70,50 V90" />
        <rect x="5" y="25" width="90" height="10" />
      </svg>
    )
  };
  return <Box style={{ width: 120, height: 120, opacity: 0.2, ...style }}>{landmarks[type]}</Box>;
};

export const DeliveryHero = () => (
  <Box style={{ position: 'relative', width: 140, height: 120 }}>
    <motion.div
      animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 140 120" fill="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="scooterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#283593" />
            <stop offset="100%" stopColor="#1A237E" />
          </linearGradient>
          <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFF00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFF00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d="M35,90 Q35,55 70,55 L95,55 Q115,55 120,90 Z" fill="url(#scooterGrad)" />
        <path d="M105,55 L120,25 Q125,20 130,30 L115,55" fill="#283593" />
        <circle cx="123" cy="35" r="8" fill="url(#lightGlow)" />
        <circle cx="123" cy="35" r="4" fill="#FFFFEE" />
        <rect x="95" y="38" width="25" height="4" rx="2" fill="#333" transform="rotate(-15, 100, 40)" />
        <circle cx="100" cy="42" r="3" fill="#111" />
        <g>
          <circle cx="45" cy="95" r="18" fill="#111" />
          <circle cx="45" cy="95" r="14" stroke="#444" strokeWidth="1" fill="none" />
          <line x1="45" y1="81" x2="45" y2="109" stroke="#333" strokeWidth="2" />
          <line x1="31" y1="95" x2="59" y2="95" stroke="#333" strokeWidth="2" />
        </g>
        <g>
          <circle cx="110" cy="95" r="18" fill="#111" />
          <circle cx="110" cy="95" r="14" stroke="#444" strokeWidth="1" fill="none" />
          <line x1="110" y1="81" x2="110" y2="109" stroke="#333" strokeWidth="2" />
          <line x1="96" y1="95" x2="124" y2="95" stroke="#333" strokeWidth="2" />
        </g>
        <g>
          <path d="M65,35 Q65,65 80,65 L90,35 Z" fill="#283593" />
          <path d="M85,45 Q100,45 105,42" stroke="#283593" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="106" cy="42" r="3" fill="#FFCCBC" />
          <circle cx="82" cy="25" r="14" fill="#00E5FF" />
          <path d="M82,11 A14,14 0 0,1 96,25 L82,25 Z" fill="#00B8D4" />
          <path d="M85,18 H94 Q98,18 98,28 H82 Z" fill="#1A1A1A" />
          <circle cx="88" cy="30" r="6" fill="#FFCCBC" />
        </g>
        <rect x="30" y="35" width="38" height="42" rx="6" fill="#FC8019" />
        <circle cx="49" cy="56" r="11" fill="white" />
        <text x="49" y="59" fontSize="11" fontWeight="900" textAnchor="middle" fill="#FC8019" style={{ fontFamily: 'Arial, sans-serif' }}>fp</text>
      </svg>
    </motion.div>
    <motion.div
      animate={{ scaleX: [1, 1.1, 1], opacity: [0.4, 0.2, 0.4] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      style={{ 
        position: 'absolute', bottom: 10, left: '20%', width: '60%', height: 6, 
        background: 'rgba(0,0,0,0.2)', borderRadius: '50%', filter: 'blur(3px)' 
      }}
    />
  </Box>
);

export const CitySkyline = () => (
  <Box style={{ position: 'absolute', bottom: 60, width: '100%', height: 180, zIndex: 1 }}>
    {[0, 1].map((i) => (
      <motion.div
        key={`skyline-${i}`}
        initial={{ x: i * 100 + '%' }}
        animate={{ x: (i - 1) * 100 + '%' }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', width: '100%', display: 'flex', alignItems: 'flex-end', gap: 0 }}
      >
        {[...Array(12)].map((_, j) => {
          const h = 80 + (j % 3) * 40;
          const w = 60 + (j % 2) * 20;
          const styleType = j % 3;
          
          return (
            <Box key={j} style={{ 
              width: w, height: h, 
              background: '#E0E4E8',
              borderRight: '2px solid #D1D9E0',
              position: 'relative', flexShrink: 0 
            }}>
              {styleType === 1 && (
                <Box style={{ 
                  position: 'absolute', top: -20, left: 0, width: '100%', height: 20, 
                  background: '#CFD8DC', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' 
                }} />
              )}
              {styleType === 2 && (
                <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 10, background: '#B0BEC5' }} />
              )}
              <Box style={{ 
                position: 'absolute', top: 20, left: '15%', right: '15%', bottom: 10,
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8
              }}>
                {[...Array(6)].map((_, k) => (
                  <Box key={k} style={{ 
                    width: '100%', height: 8, 
                    background: (j + k) % 4 === 0 ? '#FFEB3B' : '#FFFFFF',
                    borderRadius: 1,
                    opacity: 0.9
                  }} />
                ))}
              </Box>
              {styleType === 2 && [...Array(3)].map((_, k) => (
                <Box key={`balcony-${k}`} style={{ 
                  position: 'absolute', bottom: 20 + k * 30, left: -5, width: 10, height: 4, 
                  background: '#90A4AE', borderRadius: 2 
                }} />
              ))}
            </Box>
          );
        })}
      </motion.div>
    ))}
  </Box>
);

export const DeliveryJourney = () => {
  return (
    <Box style={{ 
      height: 350, 
      width: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 100%)',
      borderTop: '1px solid #f0f0f0'
    }}>
      {[0, 1].map((i) => (
        <motion.div
          key={`cloud-loop-${i}`}
          initial={{ x: i * 100 + '%' }}
          animate={{ x: (i - 1) * 100 + '%' }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: 40, width: '100%', display: 'flex', justifyContent: 'space-around', zIndex: 1 }}
        >
          <Group gap={150}>
            {[...Array(3)].map((_, j) => (
              <Box key={j} style={{ opacity: 0.3 }}>
                <svg width="120" height="50" viewBox="0 0 100 40">
                  <path d="M10,30 Q10,10 30,10 Q40,10 50,20 Q60,5 80,10 Q95,15 90,30 Z" fill="#e0e0e0" />
                </svg>
              </Box>
            ))}
          </Group>
        </motion.div>
      ))}
      <CitySkyline />
      {[0, 1].map((i) => (
        <motion.div
          key={`landmarks-loop-${i}`}
          initial={{ x: i * 100 + '%' }}
          animate={{ x: (i - 1) * 100 + '%' }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: 80, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', zIndex: 2, opacity: 0.4 }}
        >
          <Landmark type="indiaGate" />
          <Landmark type="charminar" style={{ transform: 'scale(0.8)' }} />
          <Landmark type="howrahBridge" style={{ width: 180 }} />
          <Landmark type="gateway" style={{ transform: 'scale(0.9)' }} />
        </motion.div>
      ))}
      <Box style={{ position: 'absolute', bottom: 0, width: '100%', height: 80, background: '#f8f9fa', zIndex: 3, borderTop: '4px solid #eee' }}>
        {[0, 1].map((i) => (
          <motion.div
            key={`road-loop-${i}`}
            initial={{ x: i * 100 + '%' }}
            animate={{ x: (i - 1) * 100 + '%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: 35, width: '100%', display: 'flex', justifyContent: 'space-around' }}
          >
            {[...Array(12)].map((_, j) => (
              <Box key={j} w={50} h={6} bg="orange.1" style={{ borderRadius: 3, opacity: 0.6 }} />
            ))}
          </motion.div>
        ))}
      </Box>
      <Box style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
        <DeliveryHero />
      </Box>
      <Box style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 5, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Text size="xs" fw={900} c="orange" tt="uppercase" style={{ letterSpacing: 6, opacity: 0.8 }}>
            Delivering Speed Across Bharat
          </Text>
        </motion.div>
      </Box>
    </Box>
  );
};
