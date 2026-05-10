import React, { memo, useRef } from 'react';
import { Container, Box, Title, Text, Button, Group, Stack, Badge, UnstyledButton, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, ArrowRight, ChevronDown } from 'tabler-icons-react';
import DeliveryAnimation from '../../../components/DeliveryAnimation';
const Hero = memo(({ heroRef, heroOpacity, heroScale, handleLocateMe, isLocating, locationCaptured, handleAction }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useMantineTheme();

  return (
    <Box
      ref={heroRef}
      className="hero-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isDark 
          ? '#0A0A0B'
          : '#FEFCFA',
      }}
    >
      {/* Animated gradient mesh background */}
      <div className="hero-mesh" />
      <div className="hero-glow" />
      <div className="hero-grid-pattern" />

      {/* Infinite Parallax Delivery Animation */}
      <DeliveryAnimation />

      <Container size="lg" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <Stack align="center" gap={{ base: 24, md: 36 }} style={{ textAlign: 'center' }} py={{ base: 80, md: 0 }} mb={{ base: 180, md: 240 }}>
            
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge 
                size="xl" 
                radius="xl" 
                px="xl"
                py="sm"
                variant="outline"
                color="orange"
                style={{ 
                  borderWidth: 1.5,
                  background: isDark ? 'rgba(252, 128, 25, 0.06)' : 'rgba(252, 128, 25, 0.04)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: 0.3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                🚀 Delivering happiness in 30 minutes
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Title
                order={1}
                style={{
                  fontSize: 'clamp(2.4rem, 8vw, 5.5rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-2.5px',
                  fontWeight: 900,
                  color: isDark ? '#FFFFFF' : '#0A0A0B',
                }}
              >
                Food that
                <br />
                <Text
                  span
                  inherit
                  style={{
                    background: 'linear-gradient(135deg, #FC8019 0%, #FF6B00 30%, #FF9F4D 60%, #FC8019 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  moves you.
                </Text>
              </Title>
            </motion.div>

            {/* Subline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Text 
                size="xl" 
                c="dimmed" 
                fw={500} 
                maw={520} 
                mx="auto" 
                lh={1.7}
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
              >
                From your favorite local kitchens to your doorstep. 
                Curated meals, blazing-fast delivery, zero compromises.
              </Text>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', maxWidth: 680, zIndex: 100 }}
            >
              <Box className="hero-search-bar" style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
                padding: 8,
                borderRadius: '100px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: isDark 
                  ? '0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)' 
                  : '0 24px 60px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: 'center',
                backdropFilter: 'blur(20px)',
              }}>
                <Group gap="md" px="lg" className="hero-search-input" style={{ flex: 1, minWidth: 180 }}>
                  <Search size={20} color="#FC8019" strokeWidth={2.5} />
                  <Text size="md" fw={500} c={isDark ? 'gray.5' : 'gray.4'}>
                    What are you craving today?
                  </Text>
                </Group>

                <Group gap={6} className="hero-search-actions">
                  <UnstyledButton
                    onClick={handleLocateMe}
                    className="hero-locate-btn"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0 18px', height: 48, borderRadius: '50px',
                      background: isDark ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
                      color: isDark ? '#ddd' : '#555',
                      fontWeight: 700, fontSize: '0.85rem',
                      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <MapPin size={16} />
                    <Text size="sm" fw={700} visibleFrom="xs">
                      {isLocating ? 'Locating...' : locationCaptured ? '📍 Found!' : 'Locate'}
                    </Text>
                  </UnstyledButton>

                  <Button
                    size="lg"
                    radius="xl"
                    onClick={() => handleAction('/user/dashboard')}
                    className="hero-find-btn"
                    style={{
                      height: 48,
                      padding: '0 32px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      background: 'linear-gradient(135deg, #FC8019 0%, #FF6B00 100%)',
                      boxShadow: '0 8px 24px rgba(252, 128, 25, 0.3)',
                      border: 'none',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    rightSection={<ArrowRight size={18} />}
                  >
                    Find Food
                  </Button>
                </Group>
              </Box>
            </motion.div>


          </Stack>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4, y: [0, 8, 0] }}
        transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 30, zIndex: 10 }}
      >
        <ChevronDown size={28} color={isDark ? '#fff' : '#333'} />
      </motion.div>
    </Box>
  );
});

Hero.displayName = 'Hero';
export default Hero;
