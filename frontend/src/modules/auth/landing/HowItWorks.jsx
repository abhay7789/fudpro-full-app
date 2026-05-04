import React, { memo } from 'react';
import { Container, Box, Title, Text, SimpleGrid, Stack, Group, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Bike } from 'tabler-icons-react';

const HowItWorks = memo(() => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const steps = [
    {
      icon: <Search size={28} />,
      step: '01',
      title: 'Discover',
      desc: 'Browse hundreds of restaurants and cuisines near you. Filter by mood, time, or dietary preference.',
      color: '#FC8019',
    },
    {
      icon: <ShoppingCart size={28} />,
      step: '02',
      title: 'Order',
      desc: 'Add your favorites to cart. Choose your payment — UPI, card, or cash on delivery with just a tap.',
      color: '#00C853',
    },
    {
      icon: <Bike size={28} />,
      step: '03',
      title: 'Enjoy',
      desc: 'Track your order in real-time. Fresh food delivered to your door in under 30 minutes, guaranteed.',
      color: '#2979FF',
    },
  ];

  return (
    <Box py={{ base: 60, md: 120 }} style={{ background: isDark ? '#0E0E10' : '#F7F7F8' }}>
      <Container size="lg">
        <Stack align="center" mb={{ base: 40, md: 70 }} gap={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <Text fw={800} size="xs" c="orange" tt="uppercase" style={{ letterSpacing: 5, fontSize: '0.7rem' }}>
              Simple as 1-2-3
            </Text>
            <Title
              order={2}
              fw={900}
              mt="sm"
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
                letterSpacing: '-2px',
                lineHeight: 1.1,
                color: isDark ? '#FFF' : '#0A0A0B',
              }}
            >
              How fudPro works
            </Title>
          </motion.div>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 20, md: 30 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Box
                p={{ base: 28, md: 40 }}
                style={{
                  borderRadius: 24,
                  background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                {/* Step number watermark */}
                <Text
                  fw={900}
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    fontSize: '6rem',
                    lineHeight: 1,
                    color: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {step.step}
                </Text>

                <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
                  <ThemeIcon
                    size={64}
                    radius={20}
                    variant="light"
                    style={{
                      background: `${step.color}12`,
                      color: step.color,
                      border: `1px solid ${step.color}20`,
                    }}
                  >
                    {step.icon}
                  </ThemeIcon>

                  <Stack gap={6}>
                    <Text fw={800} size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 3 }}>
                      Step {step.step}
                    </Text>
                    <Title order={3} fw={900} style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', letterSpacing: '-0.5px', color: isDark ? '#FFF' : '#0A0A0B' }}>
                      {step.title}
                    </Title>
                  </Stack>

                  <Text size="sm" c="dimmed" lh={1.8} fw={500}>
                    {step.desc}
                  </Text>
                </Stack>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
});

HowItWorks.displayName = 'HowItWorks';
export default HowItWorks;
