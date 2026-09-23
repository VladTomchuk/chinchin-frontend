import localFont from 'next/font/local';
import { Monoton, Yeseva_One } from 'next/font/google';

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

// Декоративний нарис для елементів, де сериф лишається навмисно (наприклад
// .cardIndex у HowWeWork.module.css — приглушені фонові цифри "01", "02"
// кроків). Заголовки секцій (PageTitle/SectionTitle і рівнозначні h1/h2 в
// About/Hero, HealthyBar/Hero, ServicesLateralScroll) з цього нарису
// перевели на var(--font-brand-ui) — той самий Manrope, що й у назвах карток
// послуг (EventServicesSlider тощо) — тож цю змінну тепер лишає лише
// декоративний випадок вище.
export const headingFont = Yeseva_One({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
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

// Той самий слоган на хіро, але для укр локалі: Monoton не має кирилічних
// нарисів, тому для 'ua' використовуємо Climate Crisis — підключений напряму
// з Google Fonts (<link> у app/[locale]/layout.tsx, вісь YEAR запінена на
// 1979). Раніше тут була спроба self-host через next/font/local із власним
// підсеченим інстансом, але той файл віддавав не той нарис — повернулись на
// офіційний CDN Google Fonts.
