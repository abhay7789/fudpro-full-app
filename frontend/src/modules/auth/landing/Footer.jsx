import React, { memo } from 'react';
import { Container, Box, Text, Group, UnstyledButton, Title, useMantineColorScheme } from '@mantine/core';

const Footer = memo(() => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const links = ['About', 'Contact', 'Privacy', 'Terms'];

  return (
    <Box
      component="footer"
      style={{
        background: isDark ? '#0A0A0B' : '#FEFCFA',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
        padding: '24px 0',
      }}
    >
      <Container size="lg">
        <Group justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: 16 }}>
          {/* Logo & Copyright */}
          <Group gap="sm">
            <Title order={5} fw={900} style={{ letterSpacing: -0.5, color: isDark ? '#fff' : '#0A0A0B', margin: 0 }}>
              fud<Text span c="orange" inherit>Pro</Text>
            </Title>
            <Text size="sm" c="dimmed" fw={500}>
              © {new Date().getFullYear()} • Powered by Vabsol Digital Solution
            </Text>
          </Group>

          {/* Minimal Links */}
          <Group gap={24}>
            {links.map((link) => (
              <UnstyledButton key={link} component="a" href="#">
                <Text
                  size="sm"
                  fw={500}
                  c={isDark ? 'gray.5' : 'gray.6'}
                  style={{
                    transition: 'color 0.2s ease',
                  }}
                  className="footer-link"
                >
                  {link}
                </Text>
              </UnstyledButton>
            ))}
          </Group>
        </Group>
      </Container>
    </Box>
  );
});

Footer.displayName = 'Footer';
export default Footer;
