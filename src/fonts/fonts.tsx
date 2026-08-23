import localFont from 'next/font/local';
import { Monoton } from 'next/font/google';

export const brandFont = localFont({
  src: [
    {
      path: './Manrope/static/Manrope-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
  ],
  variable: '--font-brand',
});

// Той самий Manrope, але з робочими нарисами. brandFont навмисне лишається
// одним ExtraLight — це вигляд заголовків бренду, і чіпати його не можна.
// Дрібний текст та кнопки тонким нарисом читаються погано (тонка літера
// втрачає контраст), тому для них — окреме сімейство.
export const uiFont = localFont({
  src: [
    { path: './Manrope/static/Manrope-Regular.ttf', weight: '400', style: 'normal' },
    { path: './Manrope/static/Manrope-Medium.ttf', weight: '500', style: 'normal' },
    { path: './Manrope/static/Manrope-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './Manrope/static/Manrope-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-brand-ui',
  display: 'swap',
});

// Декоративний Google Font для слогану на головному хіро (IntroBanner) —
// Monoton має лише один нарис (400) і тільки латиницю/капс, тому годиться
// суто для короткого акцентного напису, не для звичайних заголовків.
export const monotonFont = Monoton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-monoton',
  display: 'swap',
});
