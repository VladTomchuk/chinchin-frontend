import localFont from 'next/font/local';

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
