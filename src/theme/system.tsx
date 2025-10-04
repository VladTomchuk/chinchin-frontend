import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          lightBg: { value: '#fff9f6' },
          darkBg: { value: '#09090b' },
          lightText: { value: '#fff9f6' },
          darkText: { value: '#3d3d3d' },
          lightPink: { value: '#f1d2d3' },
          greenGreen: { value: '#af9c30' },
        },
      },
      fonts: {
        heading: {},
        body: { value: 'var(--font-brand), sans-serif' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
