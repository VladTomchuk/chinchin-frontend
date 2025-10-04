'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@chakra-ui/react';
import { CiBrightnessDown, CiDark } from 'react-icons/ci';

export function ColorModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Button
      variant="outline"
      color={isDark ? 'brand.lightPink' : 'brand.darkText'}
      size="md"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle color mode"
      title="Toggle color mode"
      mx={1}
    >
      {mounted ? isDark ? <CiDark /> : <CiBrightnessDown /> : <CiDark />}
    </Button>
  );
}
