import type { Metadata } from 'next';
import { Provider } from '@/components/ui/provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHINCHIN',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
