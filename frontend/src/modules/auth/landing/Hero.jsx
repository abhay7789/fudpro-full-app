import React from 'react';
import { Container, Box, Title, Text, Button, Group, Stack, Badge, UnstyledButton } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'tabler-icons-react';
import { BackgroundBlobs, DeliveryJourney, WaveDivider } from './Animations';

const Hero = ({ heroRef, heroOpacity, heroScale, handleLocateMe, isLocating, locationCaptured, handleAction }) => {
  return (
    <Box 
      ref={heroRef}
      style={{ 
        background: 'radial-gradient(circle at 50% 50%, #FFF9F5 0%, #FFFFFF 100%)',
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 80,
        paddingBottom: 0,
        overflow: 'hidden'
      }}
    >
      <BackgroundBlobs />
      
      <Container size="xl" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <Stack align="center" gap={30} style={{ textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge 
                variant="outline" 
                color="orange" 
                size="xl" 
                radius="xl" 
                px="xl"
                style={{ 
                  borderWidth: 2,
                  background: 'rgba(252, 128, 25, 0.05)',
                  textTransform: 'none',
                  fontWeight: 900,
                  letterSpacing: 1
                }}
              >
                ✨ Experience the New fudPro
              </Badge>
            </motion.div>

            <Title 
              order={1} 
              style={{ 
                fontSize: 'clamp(3rem, 10vw, 5.5rem)', 
                lineHeight: 0.95,
                letterSpacing: '-4px',
                fontWeight: 900,
                color: '#1A1A1A'
              }}
            >
              Happiness <br />
              <Text span inherit c="orange" style={{ position: 'relative' }}>
                Delivered
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                  style={{ position: 'absolute', bottom: 10, left: 0, height: 8, background: 'rgba(252, 128, 25, 0.2)', zIndex: -1 }}
                />
              </Text> Fast.
            </Title>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ width: '100%', maxWidth: 900, zIndex: 100 }}
            >
              <Box style={{ 
                background: '#fff',
                padding: '12px', 
                borderRadius: '100px', 
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Group gap="md" px="xl" style={{ flex: 1 }}>
                  <Search size={24} color="#FC8019" />
                  <Text size="lg" fw={600} c="gray.6">What are you craving today?</Text>
                </Group>
                
                <Group gap="xs">
                  <UnstyledButton 
                    onClick={handleLocateMe}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 10, 
                      padding: '0 25px', height: 56, borderRadius: '50px',
                      background: '#F8F9FA',
                      color: '#444', transition: 'all 0.3s ease',
                      fontWeight: 900
                    }}
                  >
                    <MapPin size={20} />
                    <Text size="sm">{isLocating ? 'Locating...' : 'Locate Me'}</Text>
                  </UnstyledButton>

                  <Button 
                    size="xl" 
                    radius="xl" 
                    color="orange"
                    onClick={() => handleAction('/browse')}
                    style={{ height: 56, padding: '0 50px', fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(252, 128, 25, 0.3)' }}
                  >
                    Find Food
                  </Button>
                </Group>
              </Box>

              <AnimatePresence>
                {locationCaptured && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ marginTop: 20 }}
                  >
                    <Badge size="lg" color="green" variant="light" py="md">
                      📍 5 KM RADIUS ACTIVATED
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Stack>
        </motion.div>
      </Container>

      <Box style={{ width: '100%', marginTop: 40, position: 'relative' }}>
        <DeliveryJourney />
        <WaveDivider />
      </Box>
    </Box>
  );
};

export default Hero;
