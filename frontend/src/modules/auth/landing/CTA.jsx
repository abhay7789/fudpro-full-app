import React from 'react';
import { Container, Box, Title, Text, Group, Stack, Button } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight } from 'tabler-icons-react';

const CTA = ({ handleAction }) => {
  return (
    <Container size="xl" py={10}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Box 
          style={{ 
            background: 'linear-gradient(135deg, #FC8019 0%, #ff9f4d 100%)',
            borderRadius: 32,
            padding: '50px 70px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(252, 128, 25, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {/* Background pattern */}
          <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
            <svg width="100%" height="100%">
              <pattern id="gridLarge" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridLarge)" />
            </svg>
          </Box>

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', top: '-50%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 1 }}
          />

          <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 2 }}>
            <Stack gap={5} maw={700}>
              <Title order={2} size="2.5rem" fw={900} style={{ lineHeight: 1.1, letterSpacing: '-1px' }}>
                Ready to experience the fudPro difference?
              </Title>
              <Text size="lg" style={{ opacity: 0.9 }}>
                Join thousands of foodies enjoying the fastest delivery in the city.
              </Text>
            </Stack>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="xl" 
                radius="xl" 
                bg="white"
                c="orange"
                onClick={() => handleAction('/browse')}
                style={{ height: 60, padding: '0 50px', fontSize: '1.1rem', fontWeight: 900 }}
                rightSection={<ArrowRight size={20} />}
              >
                Order Now
              </Button>
            </motion.div>
          </Group>
        </Box>
      </motion.div>
    </Container>
  );
};

export default CTA;
