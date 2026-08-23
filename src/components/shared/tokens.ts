// Єдине джерело кольорів для сторінок сайту. Раніше кожна секція тримала власну
// копію цих значень; тепер Services/tokens.ts і HealthyBar/tokens.ts просто
// реекспортують звідси.
//
// Формат `{ base, _dark }` — той самий, що вже використовує
// components/ui/provider.tsx, тож його можна класти на props Chakra напряму.
//
// Основа — брендові кольори з theme/system.tsx. Акцент у кожної теми свій, і це
// навмисно: світла бере оливу, темна — брендовий рожевий (#f1d2d3, той самий,
// що в логотипі pink_chinchin_logo.svg і в ілюстраціях shaker-light-*.svg).
// Так тема лишається цілісною — колір кнопок збігається з кольором знака.
//
// Олива у світлій темі затемнена до #6b5f1c: брендовий золотий #af9c30 на
// #fff9f6 дає лише 2.6:1 і як текст не проходить WCAG; затемнений — 6.1:1.
// Рожевому в темній темі затемнення не потрібне — на #09090b він дає 14.1:1.
export const c = {
  page: { base: '#fff9f6', _dark: '#09090b' },
  surface: { base: '#ffffff', _dark: '#131316' },
  surfaceAlt: { base: '#fbf2ec', _dark: '#101013' },

  text: { base: '#3d3d3d', _dark: '#fff9f6' }, // 10.3:1 / 18.7:1
  textMuted: { base: '#5c5c5c', _dark: '#c9c3bf' }, // 6.3:1 / 11.3:1

  accent: { base: '#6b5f1c', _dark: '#f1d2d3' }, // 6.1:1 / 14.1:1
  accentSoft: { base: '#f1eddc', _dark: '#231516' }, // підкладка під акцентом
  accentContrast: { base: '#fff9f6', _dark: '#09090b' }, // текст на суцільному акценті

  line: { base: '#e7ded8', _dark: '#26262b' },
} as const;

// Тема проєкту не додає видимого кільця фокусу (у зібраному CSS немає жодного
// правила :focus-visible), тому задаємо його явно на інтерактивних елементах.
export const FOCUS_RING = {
  outline: '2px solid',
  outlineColor: c.accent,
  outlineOffset: '3px',
} as const;

// Шапка сайту зафіксована (position: fixed) і має висоту ~66px. Перший екран
// сторінки повинен починатися нижче, інакше заголовок ховається під нею.
export const NAVBAR_OFFSET = { base: '84px', md: '96px' };

export const CONTENT_MAX_WIDTH = '1120px';
