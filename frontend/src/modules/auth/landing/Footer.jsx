import React, { memo } from 'react';
import { Container, Box, Text, Group, Stack, Divider, UnstyledButton, SimpleGrid, Title, useMantineColorScheme } from '@mantine/core';
import { BrandTwitter, BrandInstagram, BrandFacebook, BrandLinkedin, Mail, Phone, MapPin, Heart } from 'tabler-icons-react';

const Footer = memo(() => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Blog', 'Press Kit'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety', 'Partner with Us', 'FAQs'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
    },
  ];

  const socialLinks = [
    { icon: <BrandTwitter size={18} />, label: 'Twitter' },
    { icon: <BrandInstagram size={18} />, label: 'Instagram' },
    { icon: <BrandFacebook size={18} />, label: 'Facebook' },
    { icon: <BrandLinkedin size={18} />, label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      style={{
        background: isDark ? '#0A0A0B' : '#FAFAFA',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
      }}
    >
      {/* Main footer content */}
      <Container size="lg" py={{ base: 40, md: 70 }}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 32, md: 40 }}>
          {/* Brand column */}
          <Stack gap="lg">
            <Group gap={8}>
              <img src="/logo.jpg" alt="fudPro" style={{ height: 28, width: 'auto', borderRadius: 6 }} />
              <Title order={4} fw={900} style={{ letterSpacing: -1, color: isDark ? '#fff' : '#0A0A0B' }}>
                fud<Text span c="orange" inherit>Pro</Text>
              </Title>
            </Group>
            <Text size="sm" c="dimmed" lh={1.7} fw={500} maw={260}>
              India's fastest food delivery platform. Fresh meals from your favorite restaurants, delivered in 30 minutes.
            </Text>

            {/* Contact info */}
            <Stack gap={8}>
              <Group gap={8}>
                <Mail size={14} color="#FC8019" />
                <Text size="xs" fw={600} c="dimmed">support@fudpro.in</Text>
              </Group>
              <Group gap={8}>
                <Phone size={14} color="#FC8019" />
                <Text size="xs" fw={600} c="dimmed">1800-123-FOOD</Text>
              </Group>
              <Group gap={8}>
                <MapPin size={14} color="#FC8019" />
                <Text size="xs" fw={600} c="dimmed">Mumbai, India</Text>
              </Group>
            </Stack>
          </Stack>

          {/* Link columns */}
          {footerSections.map((section) => (
            <Stack key={section.title} gap="md">
              <Text fw={800} size="sm" tt="uppercase" style={{ letterSpacing: 2, color: isDark ? '#fff' : '#0A0A0B', fontSize: '0.7rem' }}>
                {section.title}
              </Text>
              <Stack gap={10}>
                {section.links.map((link) => (
                  <UnstyledButton key={link} component="a" href="#">
                    <Text
                      size="sm"
                      fw={500}
                      c={isDark ? 'gray.5' : 'gray.6'}
                      style={{
                        transition: 'color 0.2s ease',
                        fontSize: '0.88rem',
                      }}
                      className="footer-link"
                    >
                      {link}
                    </Text>
                  </UnstyledButton>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      {/* Bottom bar */}
      <Box style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)' }}>
        <Container size="lg" py={{ base: 16, md: 20 }}>
          <Group justify="space-between" style={{ flexWrap: 'wrap', gap: 16 }}>
            {/* Copyright */}
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500}>
                © {new Date().getFullYear()} fudPro. All rights reserved.
              </Text>
              <Group gap={4}>
                <Text size="xs" c="dimmed" fw={500}>
                  Crafted with
                </Text>
                <Heart size={12} color="#FC8019" fill="#FC8019" />
                <Text size="xs" c="dimmed" fw={500}>by</Text>
                <Text size="xs" fw={800} c="orange">Vabsol Digital Solutions</Text>
              </Group>
            </Stack>

            {/* Social links */}
            <Group gap={4}>
              {socialLinks.map((social) => (
                <UnstyledButton
                  key={social.label}
                  aria-label={social.label}
                  className="social-btn"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    color: isDark ? '#777' : '#999',
                    transition: 'all 0.3s ease',
                    border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
                  }}
                >
                  {social.icon}
                </UnstyledButton>
              ))}
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  );
});

Footer.displayName = 'Footer';
export default Footer;
