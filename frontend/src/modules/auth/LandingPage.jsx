import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mantine/core';
import { useScroll, useTransform } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';
import Navbar from '../../components/Navbar';
import LoginModal from '../../components/LoginModal';
import Hero from './landing/Hero';
import Chapters from './landing/Chapters';
import CTA from './landing/CTA';

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [isLocating, setIsLocating] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const handleAction = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        setLocationCaptured(true);
        setTimeout(() => {
          navigate('/browse?lat=' + latitude + '&lng=' + longitude + '&radius=5');
        }, 1500);
      }, (error) => {
        setIsLocating(false);
        console.error("Error getting location:", error);
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const mealChapters = [
    { 
      name: 'Breakfast', 
      emoji: '🍳', 
      color: 'orange',
      time: '7:00 AM - 11:30 AM',
      desc: 'Start your day with freshly brewed coffee, healthy bowls, and classic Indian breakfast favorites.',
      dishes: 'Omelettes • Poha • Idli • Pancakes'
    },
    { 
      name: 'Lunch', 
      emoji: '🍱', 
      color: 'yellow',
      time: '12:00 PM - 4:00 PM',
      desc: 'Wholesome mid-day meals including executive thalis, gourmet salads, and fulfilling protein bowls.',
      dishes: 'Thalis • Salads • Biryani • Wraps'
    },
    { 
      name: 'Dinner', 
      emoji: '🍛', 
      color: 'blue',
      time: '7:00 PM - 12:00 AM',
      desc: 'Perfect end to your day with curated gourmet dinners, cozy comfort food, and late-night treats.',
      dishes: 'Pasta • Curries • Steaks • Desserts'
    },
  ];

  return (
    <Box bg="#fff" style={{ overflowX: 'hidden' }}>
      <Navbar openLogin={() => setIsLoginOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      <Hero 
        heroRef={heroRef}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        handleLocateMe={handleLocateMe}
        isLocating={isLocating}
        locationCaptured={locationCaptured}
        handleAction={handleAction}
      />

      <Chapters 
        mealChapters={mealChapters}
        handleAction={handleAction}
      />

      <CTA 
        handleAction={handleAction}
      />
    </Box>
  );
};

export default LandingPage;
