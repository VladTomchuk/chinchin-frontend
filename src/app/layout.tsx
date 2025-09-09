import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Provider } from '@/components/ui/provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHINCHIN',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme // ← дозволяє браузеру підлаштовувати нативні елементи
        >
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
