'use client';

import { useRef } from 'react';
import type { PointerEvent } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import styles from './TiltPhoto.module.css';

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

// Максимальний нахил у градусах і пружина — той самий рецепт, що в
// референсі (motion.dev/examples/react-tilt-card): позиція курсора 0..1
// всередині картки → useSpring згладжує ривки миші → useTransform мапить
// координату на кут повороту. 14° і зверху, і збоку — відчутно, але картка
// не "вилітає" з площини картки на 240px-квадраті.
const MAX_TILT_DEG = 14;
const SPRING = { stiffness: 300, damping: 30, mass: 0.5 };

// Тінь падає від картки, а не сидить статичним кільцем під нею: SHADOW_BASE_Y —
// базове зміщення вниз у стані спокою (без нього тінь просто "по контуру"
// не читається як відрив від поверхні), SHADOW_MAX_OFFSET — наскільки додатково
// зсувається за курсором в обидві сторони поверх бази.
const SHADOW_BASE_Y = 14;
const SHADOW_MAX_OFFSET = 22;
const SHADOW_BLUR = 32;

export default function TiltPhoto({ src, alt, sizes, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 0.5/0.5 — курсор у центрі картки, тобто нейтральний, без нахилу.
  // Це і стартове значення, і те, куди повертаємось на pointerLeave.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const springX = useSpring(pointerX, SPRING);
  const springY = useSpring(pointerY, SPRING);

  // Вертикальна позиція курсора нахиляє картку навколо ГОРИЗОНТАЛЬНОЇ осі
  // (rotateX), тож інвертована пара: y керує rotateX, x — rotateY.
  const rotateX = useTransform(springY, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const rotateY = useTransform(springX, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]);

  // Той самий springX/springY, що й нахил, — тінь і поворот керуються одним
  // жестом, тож не розходяться в часі. Напрямок навмисно ПОВТОРЮЄ зсув
  // курсора (а не дзеркалить його): край картки під курсором "провалюється"
  // назад (той самий rotateX/Y), тож тінь природно падає в той самий бік.
  //
  // Колір/прозорість — не тут, а в CSS (--tilt-shadow-rgb/-alpha,
  // TiltPhoto.module.css): чорна тінь на темному фоні непомітна, тож у
  // html.dark ці змінні перемикають її на світлу. var() у box-shadow
  // резолвиться браузером у момент малювання незалежно від того, що
  // значення прийшло через inline style — теми лишаються в одному місці.
  const boxShadow = useTransform([springX, springY], (latest) => {
    const [sx, sy] = latest as [number, number];
    const dx = (sx - 0.5) * 2 * SHADOW_MAX_OFFSET;
    const dy = SHADOW_BASE_Y + (sy - 0.5) * 2 * SHADOW_MAX_OFFSET;
    return `${dx}px ${dy}px ${SHADOW_BLUR}px rgb(var(--tilt-shadow-rgb) / var(--tilt-shadow-alpha))`;
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
  }

  // prefers-reduced-motion: замість вимикати ефект зовсім, лишаємо статичне
  // фото без обробників і без 3D-трансформу — так картка не смикається й не
  // повертається, але лейаут (той самий motion.div) не змінюється.
  if (reduceMotion) {
    return (
      <div className={styles.card}>
        <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: 'cover' }} priority={priority} />
      </div>
    );
  }

  // className дає скруглення/фон (TiltPhoto.module.css) — саме на цьому
  // елементі, а не на батьківському Box, бо rotateX/rotateY нижче нахиляють
  // у 3D рівно те, що обведене className. Якби рамка лишалась зовні,
  // нахилялось би тільки фото під статичною рамкою. overflow:hidden у
  // .card не зрізає boxShadow нижче — тінь малюється поза межами
  // клипованого вмісту, це властивість box-shadow, а не контенту.
  return (
    <motion.div
      ref={ref}
      className={styles.card}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={{ scale: 1.04 }}
      transition={{ scale: { type: 'spring', stiffness: 300, damping: 22 } }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        boxShadow,
      }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: 'cover' }} priority={priority} />
    </motion.div>
  );
}
