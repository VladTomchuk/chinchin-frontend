"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu"

export function ColorModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color mode"
      title="Toggle color mode"
    >
      {/* До маунту показуємо стабільний плейсхолдер, щоб не ламати гідрацію */}
      {mounted ? (isDark ? <LuMoon/> : <LuSun/>) : <LuMoon/>}
    </Button>
  );
}
