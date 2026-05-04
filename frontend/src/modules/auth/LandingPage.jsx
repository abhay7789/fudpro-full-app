import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Box, useMantineColorScheme, Loader, Center } from '@mantine/core';
import { useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import LoginModal from '../../components/LoginModal';
import Navbar from '../../components/Navbar';
import Hero from './landing/Hero';
import useAuthStore from '../../store/useAuthStore';
import { getDashboardRoute } from '../../utils/routeUtils';

// Lazy load below-the-fold content for instant hero render
const Chapters = lazy(() => import('./landing/Chapters'));
const HowItWorks = lazy(() => import('./landing/HowItWorks'));
const CTA = lazy(() => import('./landing/CTA'));
const Footer = lazy(() => import('./landing/Footer'));

const LandingPage = () => {
  const [authOpened, setAuthOpened] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const [locationCaptured, setLocationCaptured] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'fudPro — Happiness Delivered Fast';
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        () => { setLocationCaptured(true); setIsLocating(false); },
        () => { setIsLocating(false); }
      );
    }
  };

  const handleAction = (path) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user?.role) {
      navigate(getDashboardRoute(user.role));
    } else {
      setAuthMode('register');
      setAuthOpened(true);
    }
  };

  const mealChapters = [
    { 
      name: 'Breakfast', emoji: '🌅', time: '7 — 11 AM', color: 'yellow',
      desc: 'Kickstart your mornings with fresh parathas, smoothie bowls, masala dosas, and aromatic filter coffee.',
      dishes: 'Poha, Masala Dosa, Paratha, Smoothie Bowl'
    },
    { 
      name: 'Lunch', emoji: '☀️', time: '12 — 3 PM', color: 'orange',
      desc: 'Wholesome mid-day thalis, protein bowls, and gourmet salads that keep you powered through the day.',
      dishes: 'Thali, Biryani, Rajma Chawal, Caesar Salad'
    },
    { 
      name: 'Dinner', emoji: '🌙', time: '7 — 11 PM', color: 'indigo',
      desc: 'End your day with curated gourmet dinners, comfort food classics, and irresistible late-night cravings.',
      dishes: 'Butter Chicken, Paneer Tikka, Pasta, Dal Makhani'
    },
  ];

  return (
    <Box style={{ overflowX: 'hidden' }}>
      <Navbar 
        isLanding 
        openLogin={() => { setAuthMode('login'); setAuthOpened(true); }} 
        openRegister={() => { setAuthMode('register'); setAuthOpened(true); }} 
      />

      <Hero 
        heroRef={heroRef} 
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        handleLocateMe={handleLocateMe}
        isLocating={isLocating}
        locationCaptured={locationCaptured}
        handleAction={handleAction}
      />

      <Suspense fallback={<Center py={80}><Loader color="orange" type="bars" /></Center>}>
        <Chapters mealChapters={mealChapters} handleAction={handleAction} />
        <HowItWorks />
        <CTA handleAction={handleAction} />
        <Footer />
      </Suspense>

      <LoginModal
        opened={authOpened}
        onClose={() => setAuthOpened(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </Box>
  );
};

export default LandingPage;
