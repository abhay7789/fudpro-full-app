import React, { memo } from 'react';
import { Container, Box, Title, Text, SimpleGrid, Stack, Button, Group, Badge, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'tabler-icons-react';

const Chapters = memo(({ mealChapters, handleAction }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box py={{ base: 60, md: 120 }} style={{ position: 'relative', background: isDark ? '#0A0A0B' : '#fff' }}>
      {/* Section divider accent */}
      <Box style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 60, height: 4, borderRadius: 2, background: '#FC8019' }} />
      
      <Container size="lg">
        <Stack align="center" mb={{ base: 40, md: 80 }} gap={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <Badge 
              variant="light" 
              color="orange" 
              size="lg" 
              radius="xl" 
              mb="lg"
              style={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }}
            >
              🍽️ Daily Menu
            </Badge>
            <Title
              order={2}
              fw={900}
              style={{
                fontSize: 'clamp(2rem, 6vw, 3.8rem)',
                letterSpacing: '-2.5px',
                lineHeight: 1.05,
                color: isDark ? '#FFF' : '#0A0A0B',
              }}
            >
              Every meal,<br />
              <Text span inherit c="dimmed">perfectly timed.</Text>
            </Title>
            <Text size="lg" c="dimmed" maw={480} mx="auto" mt="xl" fw={500} lh={1.7} style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              We curate the best dishes for every part of your day — breakfast to midnight cravings.
            </Text>
          </motion.div>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 16, md: 24 }}>
          {mealChapters.map((meal, i) => (
            <motion.div
              key={meal.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleAction?.('/user/dashboard')}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleAction?.('/user/dashboard')}
            >
              <Box
                className="meal-card"
                p={{ base: 24, md: 36 }}
                style={{
                  borderRadius: 28,
                  background: isDark 
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' 
                    : '#FAFAFA',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                  height: '100%',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient accent on hover */}
                <Box className="meal-card-glow" style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, transparent, #FC8019, transparent)`,
                  opacity: 0, transition: 'opacity 0.4s ease',
                }} />

                <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
                  {/* Emoji + Time badge */}
                  <Group justify="space-between" align="flex-start">
                    <Box
                      style={{
                        width: 72, height: 72, borderRadius: 22,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDark ? 'rgba(252, 128, 25, 0.08)' : 'rgba(252, 128, 25, 0.06)',
                        fontSize: '2.4rem',
                      }}
                    >
                      {meal.emoji}
                    </Box>
                    <Badge
                      variant="light"
                      color="gray"
                      size="sm"
                      radius="xl"
                      leftSection={<Clock size={12} />}
                      style={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      {meal.time}
                    </Badge>
                  </Group>

                  {/* Content */}
                  <Stack gap={8}>
                    <Title order={3} fw={900} style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', letterSpacing: '-0.5px', color: isDark ? '#FFF' : '#0A0A0B' }}>
                      {meal.name}
                    </Title>
                    <Text size="sm" c="dimmed" lh={1.7} fw={500} style={{ fontSize: 'clamp(0.82rem, 1.5vw, 0.92rem)' }}>
                      {meal.desc}
                    </Text>
                  </Stack>

                  {/* Popular dishes */}
                  <Group gap={6} style={{ flexWrap: 'wrap' }}>
                    {meal.dishes.split(', ').map((dish) => (
                      <Badge
                        key={dish}
                        variant={isDark ? 'outline' : 'light'}
                        color={isDark ? 'gray' : 'orange'}
                        size="sm"
                        radius="xl"
                        style={{ textTransform: 'none', fontWeight: 600, borderColor: isDark ? 'rgba(255,255,255,0.1)' : undefined }}
                      >
                        {dish}
                      </Badge>
                    ))}
                  </Group>

                  {/* CTA */}
                  <Group>
                    <Text
                      size="sm"
                      fw={800}
                      c="orange"
                      style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      Explore Menu <ArrowRight size={16} style={{ transition: 'transform 0.3s' }} className="meal-card-arrow" />
                    </Text>
                  </Group>
                </Stack>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
});

Chapters.displayName = 'Chapters';
export default Chapters;
