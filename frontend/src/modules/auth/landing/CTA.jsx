import React, { memo } from 'react';
import { Container, Box, Title, Text, Group, Stack, Button, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'tabler-icons-react';

const CTA = memo(({ handleAction }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box py={{ base: 40, md: 60 }} style={{ background: isDark ? '#0A0A0B' : '#fff' }}>
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Box
            className="cta-banner"
            style={{
              borderRadius: 32,
              padding: 'clamp(36px, 6vw, 72px) clamp(28px, 5vw, 64px)',
              position: 'relative',
              overflow: 'hidden',
              background: isDark
                ? 'linear-gradient(135deg, #1a0e06 0%, #2d1608 30%, #1a0e06 100%)'
                : 'linear-gradient(135deg, #FC8019 0%, #ff6b00 50%, #ff8f3d 100%)',
              border: isDark ? '1px solid rgba(252, 128, 25, 0.15)' : 'none',
            }}
          >
            {/* Decorative elements */}
            <Box style={{
              position: 'absolute', top: '-50%', right: '-10%',
              width: 500, height: 500, borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(252, 128, 25, 0.06) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <Box style={{
              position: 'absolute', bottom: '-40%', left: '-5%',
              width: 400, height: 400, borderRadius: '50%',
              background: isDark
                ? 'radial-gradient(circle, rgba(252, 128, 25, 0.04) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <Stack align="center" gap="xl" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                <Star size={40} color={isDark ? '#FC8019' : '#fff'} style={{ opacity: 0.8 }} />
              </motion.div>

              <Title
                order={2}
                fw={900}
                style={{
                  fontSize: 'clamp(1.6rem, 5vw, 3rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-1.5px',
                  color: isDark ? '#FC8019' : '#fff',
                  maxWidth: 600,
                }}
              >
                Ready to taste the difference?
              </Title>

              <Text
                size="lg"
                style={{
                  opacity: 0.85,
                  maxWidth: 460,
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.9)',
                  lineHeight: 1.7,
                }}
                fw={500}
              >
                Join 50,000+ foodies who trust fudPro for their daily meals. Your first delivery is on us.
              </Text>

              <Group gap="md" justify="center" style={{ flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="xl"
                    radius="xl"
                    onClick={() => handleAction('/user/dashboard')}
                    rightSection={<ArrowRight size={20} />}
                    style={{
                      height: 56,
                      padding: '0 40px',
                      fontWeight: 800,
                      fontSize: '1rem',
                      background: isDark ? '#FC8019' : '#fff',
                      color: isDark ? '#fff' : '#FC8019',
                      boxShadow: isDark
                        ? '0 8px 32px rgba(252, 128, 25, 0.3)'
                        : '0 8px 32px rgba(0,0,0,0.15)',
                      border: 'none',
                    }}
                  >
                    Start Ordering — It's Free
                  </Button>
                </motion.div>
              </Group>

              <Text size="xs" fw={600} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)' }}>
                No subscription required • Cancel anytime
              </Text>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
});

CTA.displayName = 'CTA';
export default CTA;
