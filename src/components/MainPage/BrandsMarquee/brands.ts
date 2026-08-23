// Клієнти, чиї події ми обслуговували. Файли в public/brands обрізані по межах
// непрозорих пікселів і зведені до висоти 176px (4x від показуваних ~44px) —
// вихідні PNG були 2.5–4k завширшки з різними полями «повітря» навколо знака,
// через що при однаковій висоті лого мали різну оптичну вагу.
//
// `scale` — оптична поправка, а не помилка розмітки. Лого з горизонтальним
// написом читаються при однаковій висоті, а складені у два яруси (Fira: знак
// над словом) при тій самій висоті дають удвічі дрібніший текст, тож їм
// потрібен більший бокс.
export type Brand = {
  name: string;
  src: string;
  width: number;
  height: number;
  scale?: number;
};

export const BRANDS: Brand[] = [
  { name: 'Nova Post', src: '/brands/nova-post.png', width: 552, height: 176 },
  { name: 'Preply', src: '/brands/preply.png', width: 640, height: 176 },
  { name: 'Fira Barcelona', src: '/brands/fira-barcelona.png', width: 415, height: 176, scale: 1.4 },
  { name: 'Sage', src: '/brands/sage.png', width: 313, height: 176, scale: 0.9 },
  { name: 'TreasurySpring', src: '/brands/treasury-spring.png', width: 557, height: 176 },
  { name: 'G×BAR', src: '/brands/g-bar.png', width: 591, height: 176 },
];
