import React, { memo } from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

/**
 * BackgroundBlobs — Pure CSS floating blobs, zero JS animation overhead
 * Uses CSS keyframes for infinite subtle movement
 */
export const BackgroundBlobs = memo(({ section = 'hero' }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const blobColors = {
    hero: isDark ? 'rgba(252, 128, 25, 0.03)' : 'rgba(252, 128, 25, 0.03)',
    chapters: isDark ? 'rgba(252, 128, 25, 0.02)' : 'rgba(252, 128, 25, 0.015)',
  };

  return null; // Blobs moved to CSS for instant rendering
});

BackgroundBlobs.displayName = 'BackgroundBlobs';

/**
 * WaveDivider — Theme-aware SVG wave
 */
export const WaveDivider = memo(({ flip = false }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const color = isDark ? '#1A1B1E' : '#fff';

  return (
    <Box style={{ transform: flip ? 'rotate(180deg)' : 'none', marginTop: -1, marginBottom: -1 }}>
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
        <path d="M0 60V20C120 40 240 10 360 20C480 30 600 50 720 40C840 30 960 10 1080 20C1200 30 1320 50 1440 40V60H0Z" fill={color} />
      </svg>
    </Box>
  );
});

WaveDivider.displayName = 'WaveDivider';
