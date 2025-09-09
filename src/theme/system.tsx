// theme/system.ts
import { createSystem, defaultConfig } from '@chakra-ui/react';

export const system = createSystem(defaultConfig, {
  // тут за бажанням додаєш токени/semanticTokens
  // theme: { tokens: { colors: { ... }}, semanticTokens: { ... } }
});
