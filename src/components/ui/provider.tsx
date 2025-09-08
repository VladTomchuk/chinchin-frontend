"use client";

import { ChakraProvider, Box } from "@chakra-ui/react";
import { system } from "@/theme/system";

export function Provider({ children }: { children: React.ReactNode }) {
  // У v3 ChakraProvider приймає `value`, а не `theme`
  return <ChakraProvider value={system}>
    <Box
      minH="100dvh"
        bg={{ base: "white", _dark: "gray.900" }}
        color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
        transition="background-color 150ms ease, color 150ms ease"
      >
          {children}
        </Box>
      </ChakraProvider>;
}