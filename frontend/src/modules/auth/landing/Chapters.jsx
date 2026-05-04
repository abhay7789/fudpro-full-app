import React from 'react';
import { Container, Box, Title, Text, SimpleGrid, Stack, UnstyledButton, Button } from '@mantine/core';
import { motion } from 'framer-motion';
import { ArrowRight } from 'tabler-icons-react';

const Chapters = ({ mealChapters, handleAction }) => {
  return (
    <Box py={40} bg="#fff" style={{ position: 'relative' }}>
      <Container size="xl">
        <Stack align="center" mb={40} gap={10}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <Text c="orange" fw={900} tt="uppercase" size="sm" style={{ letterSpacing: 6 }}>Curated Chapters</Text>
            <Title order={2} size="3.5rem" fw={900} style={{ letterSpacing: '-2px', color: '#1A1A1A' }}>Your Daily Food Rhythm</Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto" mt="md" fw={500}>
              Perfectly timed menus for every stage of your day.
            </Text>
          </motion.div>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={40}>
          {mealChapters.map((meal, i) => (
            <motion.div
              key={meal.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -15 }}
            >
              <UnstyledButton 
                component="div"
                onClick={() => handleAction('/browse')}
                style={{ width: '100%' }}
              >
                <Box 
                  p={40}
                  style={{ 
                    borderRadius: '40px',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.03)',
                    height: '100%',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Stack gap="xl" style={{ position: 'relative', zIndex: 1 }}>
                    <Box 
                      style={{ 
                        width: 100, height: 100, borderRadius: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `var(--mantine-color-${meal.color}-1)`,
                        fontSize: '3.5rem',
                        boxShadow: `0 20px 40px var(--mantine-color-${meal.color}-0)`,
                      }}
                    >
                      {meal.emoji}
                    </Box>
                    
                    <Stack gap={8}>
                      <Text fw={900} size="sm" c="orange" tt="uppercase" style={{ letterSpacing: 2 }}>{meal.time}</Text>
                      <Title order={3} size="2.5rem" fw={900} style={{ letterSpacing: '-1px' }}>{meal.name}</Title>
                    </Stack>

                    <Text size="lg" c="dimmed" lh={1.6} fw={500}>{meal.desc}</Text>

                    <Box>
                      <Text size="sm" fw={900} c="gray.8" mb={5}>TOP FAVORITES:</Text>
                      <Text size="sm" c="dimmed" fw={600}>{meal.dishes}</Text>
                    </Box>

                    <Button 
                      variant="filled" 
                      color="orange" 
                      radius="xl"
                      size="md"
                      rightSection={<ArrowRight size={18} />}
                      style={{ alignSelf: 'flex-start', height: 48, padding: '0 30px' }}
                    >
                      Explore
                    </Button>
                  </Stack>
                </Box>
              </UnstyledButton>
            </motion.div>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Chapters;
