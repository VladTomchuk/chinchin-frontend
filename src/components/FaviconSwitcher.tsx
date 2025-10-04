'use client';

import { useEffect } from 'react';

export default function FaviconSystem() {
  useEffect(() => {
    const darkIcon = '/darkLogo.png';
    const lightIcon = '/green_favicon.png';

    const updateFavicon = (isDark: boolean) => {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      const href = isDark ? lightIcon : darkIcon;

      if (link) {
        link.href = href;
      } else {
        link = document.createElement('link');
        link.rel = 'icon';
        link.href = href;
        document.head.appendChild(link);
      }
    };

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateFavicon(prefersDark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => updateFavicon(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return null;
}
