'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

/**
 * Портовано з маркетплейс-компонента Framer "Driftloom"
 * (https://framer.com/m/Driftloom-IjU6VG.js). Оригінал написаний під рантайм
 * Framer (addPropertyControls/ControlType для панелі властивостей,
 * useIsStaticRenderer для статичного превью на канвасі) — тут лишена тільки
 * "жива" гілка (LiveRail в оригіналі), а конфіг задається пропами/дефолтами
 * нижче замість панелі Framer.
 */

type ImageShape = 'Portrait' | 'Landscape' | 'Square';

export interface DriftloomImage {
  src: string;
  alt?: string;
  title: string;
  shape: ImageShape;
  /** Множник висоти картки відносно layout.cardHeight (0.45–1.3). */
  scale?: number;
  /** Вертикальний зсув картки в ряду, -1..1. */
  offset?: number;
  /** Швидкість паралаксу зображення всередині картки, -2..2. */
  speed?: number;
}

interface LayoutConfig {
  cardHeight: number;
  mobileHeight: number;
  gap: number;
  overlap: number;
  stagger: number;
  padding: number;
  scale: number;
  radius: number;
  breakpoint: number;
}

interface MotionConfig {
  smoothness: number;
  parallax: number;
  depth: number;
  inertia: number;
  infinite: boolean;
}

interface InteractionConfig {
  drag: boolean;
  touch: boolean;
  wheel: boolean;
  wheelAxis: 'Both' | 'Horizontal';
  wheelSpeed: number;
  dragSpeed: number;
}

interface AutoplayConfig {
  enabled: boolean;
  speed: number;
  direction: 'Left' | 'Right';
  pauseHover: boolean;
  resumeDelay: number;
}

interface AppearanceConfig {
  background: string;
  grayscale: boolean;
  hoverScale: number;
  duration: number;
  edgeFade: number;
  captions: boolean;
  textColor: string;
}

type CornerPosition = 'Top Left' | 'Top Right' | 'Bottom Left' | 'Bottom Right';

interface GrayscaleButtonConfig {
  show: boolean;
  size: number;
  inset: number;
  position: CornerPosition;
  background: string;
  color: string;
  litColor: string;
}

interface PopupConfig {
  enabled: boolean;
  background: string;
  captions: boolean;
}

const LAYOUT: LayoutConfig = {
  cardHeight: 360,
  mobileHeight: 280,
  gap: 44,
  overlap: 16,
  stagger: 75,
  padding: 32,
  scale: 1,
  radius: 12,
  breakpoint: 700,
};

const MOTION: MotionConfig = {
  smoothness: 0.085,
  parallax: 55,
  depth: 0.12,
  inertia: 0.92,
  infinite: true,
};

const INTERACTION: InteractionConfig = {
  drag: true,
  touch: true,
  wheel: true,
  wheelAxis: 'Both',
  wheelSpeed: 1,
  dragSpeed: 1,
};

const AUTOPLAY: AutoplayConfig = {
  enabled: true,
  speed: 28,
  direction: 'Left',
  pauseHover: true,
  resumeDelay: 2,
};

// Кремовий фон і колір тексту взято з єдиної палітри сайту (components/shared/tokens.ts:
// c.surfaceAlt / c.text), щоб карусель не виглядала чужорідною вставкою.
const APPEARANCE: AppearanceConfig = {
  background: '#fbf2ec',
  grayscale: false,
  hoverScale: 1.035,
  duration: 0.55,
  edgeFade: 4,
  captions: true,
  textColor: '#3d3d3d',
};

const GRAYSCALE_BUTTON: GrayscaleButtonConfig = {
  show: true,
  size: 44,
  inset: 20,
  position: 'Top Left',
  background: 'rgba(255,255,255,0.86)',
  color: '#74777D',
  litColor: '#303741',
};

const POPUP: PopupConfig = { enabled: true, background: 'rgba(10,10,10,0.96)', captions: true };

// Дефолтний набір — фото подій Chin Chin, що вже лежать у /public (замінити
// пропом images за потреби). Shape/scale підібрані під реальні пропорції
// файлів (див. sips -g pixelWidth -g pixelHeight), offset/speed — вручну під
// той самий ритм чергування, що й у демо-наборі оригіналу.
const DEFAULT_IMAGES: DriftloomImage[] = [
  {
    src: '/events/bar-service-01.jpg',
    alt: 'Барна станція на заході Chin Chin',
    title: 'Барна станція',
    shape: 'Landscape',
    scale: 1,
    offset: -0.5,
    speed: 1,
  },
  {
    src: '/events/bar-service-03.jpg',
    alt: 'Бармен готує коктейль на публіку',
    title: 'Шоу за барною стійкою',
    shape: 'Portrait',
    scale: 0.85,
    offset: 0.9,
    speed: 1.4,
  },
  {
    src: '/hero/hero-03.jpg',
    alt: 'Подія під ключ від Chin Chin',
    title: 'Подія під ключ',
    shape: 'Landscape',
    scale: 1.05,
    offset: -0.25,
    speed: 0.7,
  },
  {
    src: '/events/bar-service-05.jpg',
    alt: 'Наливання напою гостю',
    title: 'Сервіс для гостей',
    shape: 'Portrait',
    scale: 0.8,
    offset: 0.8,
    speed: 1.6,
  },
  {
    src: '/hero/mobile-bar.jpg',
    alt: 'Мобільний бар Chin Chin',
    title: 'Мобільний бар',
    shape: 'Portrait',
    scale: 0.9,
    offset: -0.85,
    speed: 1.2,
  },
  {
    src: '/about_us/IMG_8979.jpeg',
    alt: 'Команда Chin Chin на заході',
    title: 'Команда Chin Chin',
    shape: 'Landscape',
    scale: 0.9,
    offset: 0.45,
    speed: 0.85,
  },
];

const CAPTION_BAND = 26;
const SPECTRUM = 'conic-gradient(from 150deg,#EBA96A,#E27FA6,#9A7DE0,#5FBEB4,#A9CC72,#EBA96A)';
const FALLBACK_OFFSETS = [-0.6, 0.7, -0.2, 0.85, -0.7];

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));
const mod = (n: number, length: number): number => ((n % length) + length) % length;
const ratioOf = (shape: ImageShape): number =>
  shape === 'Landscape' ? 1.45 : shape === 'Square' ? 1 : 0.72;
const usable = (list: DriftloomImage[] | undefined): DriftloomImage[] =>
  (list ?? DEFAULT_IMAGES).filter((entry) => entry?.src);

interface SwitchMetrics {
  height: number;
  width: number;
  pad: number;
  thumb: number;
  travel: number;
  label: number;
}

const switchMetrics = (size?: number): SwitchMetrics => {
  const height = Math.round(clamp(size ?? GRAYSCALE_BUTTON.size, 30, 96));
  const width = height * 2;
  const pad = Math.max(4, Math.round(height * 0.11));
  const thumb = height - pad * 2;
  return {
    height,
    width,
    pad,
    thumb,
    travel: width - thumb - pad * 2,
    label: Math.max(8, Math.round(height * 0.185)),
  };
};

const cornerAt = (position: CornerPosition, inset: number): CSSProperties => {
  if (position === 'Top Right') return { top: inset, right: inset };
  if (position === 'Bottom Left') return { bottom: inset, left: inset };
  if (position === 'Bottom Right') return { bottom: inset, right: inset };
  return { top: inset, left: inset };
};

// useLayoutEffect кидає попередження на сервері (Next SSR) — на клієнті
// потрібен саме він (виміри синхронно до фарбування), на сервері підміняємо
// на useEffect.
const useSafeLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Лічильник відкритих лайтбоксів (а не булевий прапорець): дві картки-галереї
// на сторінці могли б обидві спробувати повернути body scroll при закритті,
// якщо лічити просто true/false.
let openPopups = 0;
let previousOverflow = '';

function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
    >
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LightboxProps {
  items: DriftloomImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  background: string;
  captions: boolean;
  reduced: boolean;
  scope: string;
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  background,
  captions,
  reduced,
  scope,
}: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    if (!element) return;
    if (openPopups++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    element.showModal();
    closeButton.current?.focus();
    return () => {
      element.close();
      if (--openPopups === 0) document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const item = items[index];
  if (!item) return null;

  const button: CSSProperties = {
    width: 46,
    height: 46,
    border: '1px solid rgba(255,255,255,.25)',
    borderRadius: '50%',
    background: 'rgba(30,30,30,.65)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  };

  return createPortal(
    <dialog
      ref={dialog}
      aria-label="Перегляд зображення"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          onIndex(mod(index + 1, items.length));
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onIndex(mod(index - 1, items.length));
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        maxWidth: 'none',
        maxHeight: 'none',
        margin: 0,
        padding: '80px 24px',
        border: 0,
        boxSizing: 'border-box',
        background,
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <style>{`.${scope}-view{animation:${scope}-enter .25s ease both}@keyframes ${scope}-enter{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}`}</style>
      <button
        ref={closeButton}
        aria-label="Закрити перегляд"
        onClick={onClose}
        style={{ ...button, position: 'absolute', right: 20, top: 20, font: '300 28px Arial' }}
      >
        {'×'}
      </button>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onTouchStart={(e) => {
          if (e.touches.length === 1)
            touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          else touch.current = null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!start || !e.changedTouches.length) return;
          const dx = e.changedTouches[0].clientX - start.x;
          const dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5)
            onIndex(mod(index + (dx < 0 ? 1 : -1), items.length));
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- перегляд на
            весь екран: next/image тут вимагав би заздалегідь відомих
            width/height або fill у контейнері з фіксованим розміром, а
            картинка масштабується довільно під viewport (maxWidth/maxHeight
            100%, natural aspect ratio). */}
        <img
          key={index}
          className={reduced ? undefined : `${scope}-view`}
          src={item.src}
          alt={item.alt || item.title || `Зображення ${index + 1}`}
          draggable={false}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 18,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'space-between',
          font: '13px/1.5 Inter, sans-serif',
        }}
      >
        <div aria-live="polite" style={{ minWidth: 0 }}>
          <span style={{ opacity: 0.55 }}>
            {index + 1} / {items.length}
          </span>
          {captions && item.title && (
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </div>
          )}
        </div>
        {items.length > 1 && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              aria-label="Попереднє зображення"
              onClick={() => onIndex(mod(index - 1, items.length))}
              style={button}
            >
              <Arrow direction="left" />
            </button>
            <button
              aria-label="Наступне зображення"
              onClick={() => onIndex(mod(index + 1, items.length))}
              style={button}
            >
              <Arrow direction="right" />
            </button>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}

interface Card {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  index: number;
}

interface Geometry {
  slots: Card[];
  cycle: number;
  span: number;
  buffer: number;
  max: number;
}

interface Engine {
  current: number;
  target: number;
  velocity: number;
  pointer: number;
  x: number;
  y: number;
  lastX: number;
  lastTime: number;
  moved: boolean;
  hover: boolean;
  focus: boolean;
  keyboard: boolean;
  resumeAt: number;
  suppressUntil: number;
}

interface ConfigSnapshot {
  motion: MotionConfig;
  input: InteractionConfig;
  autoplay: AutoplayConfig;
  appearance: AppearanceConfig;
  geometry: Geometry;
  size: { width: number; height: number };
  reduced: boolean;
}

export interface DriftloomProps {
  images?: DriftloomImage[];
  layout?: Partial<LayoutConfig>;
  motion?: Partial<MotionConfig>;
  interaction?: Partial<InteractionConfig>;
  autoplay?: Partial<AutoplayConfig>;
  appearance?: Partial<AppearanceConfig>;
  grayscaleButton?: Partial<GrayscaleButtonConfig>;
  popup?: Partial<PopupConfig>;
  accessibilityLabel?: string;
  style?: CSSProperties;
  className?: string;
}

/**
 * Паралакс-стрічка фото з перетягуванням, автогортанням і лайтбоксом.
 * Потребує явної висоти від батька (сама бере height:"100%").
 */
export default function Driftloom(props: DriftloomProps) {
  const layout: LayoutConfig = { ...LAYOUT, ...props.layout };
  const motion: MotionConfig = { ...MOTION, ...props.motion };
  const input: InteractionConfig = { ...INTERACTION, ...props.interaction };
  const autoplay: AutoplayConfig = { ...AUTOPLAY, ...props.autoplay };
  const appearance: AppearanceConfig = { ...APPEARANCE, ...props.appearance };
  const popup: PopupConfig = { ...POPUP, ...props.popup };
  const grayscaleButton: GrayscaleButtonConfig = { ...GRAYSCALE_BUTTON, ...props.grayscaleButton };
  const gauge = switchMetrics(grayscaleButton.size);

  const [grayscale, setGrayscale] = useState(appearance.grayscale);
  useEffect(() => setGrayscale(appearance.grayscale), [appearance.grayscale]);

  const items = useMemo(() => usable(props.images), [props.images]);

  const root = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [size, setSize] = useState({ width: 1200, height: 600 });
  const [reduced, setReduced] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const scope = `dl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  // Заблоковано, доки IntersectionObserver не скаже інакше; відкрито з
  // самого початку тільки якщо API відсутній — інакше підтримуваний браузер
  // ніколи не отримав би кадр поза екраном.
  const [onScreen, setOnScreen] = useState(
    () => typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function',
  );
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  );

  const engine = useRef<Engine>({
    current: 0,
    target: 0,
    velocity: 0,
    pointer: -1,
    x: 0,
    y: 0,
    lastX: 0,
    lastTime: 0,
    moved: false,
    hover: false,
    focus: false,
    keyboard: false,
    resumeAt: 0,
    suppressUntil: 0,
  });

  const frame = useRef(0);
  const previousTime = useRef(0);
  const allowed = useRef(false);
  const mobile = size.width < layout.breakpoint;

  useSafeLayoutEffect(() => {
    if (!root.current || typeof ResizeObserver !== 'function') return undefined;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: Math.max(1, box.width), height: Math.max(1, box.height) });
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || typeof window.IntersectionObserver !== 'function') {
      setOnScreen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries[0]?.isIntersecting ?? false),
      {
        rootMargin: '120px',
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const change = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);

  useEffect(() => {
    if (lightbox !== null && (!popup.enabled || lightbox >= items.length)) setLightbox(null);
  }, [lightbox, popup.enabled, items.length]);

  const geometry: Geometry = useMemo(() => {
    const padding = Math.min(layout.padding, size.width * 0.12, size.height * 0.12);
    const available = Math.max(20, size.height - padding * 2);
    const stagger = Math.min(layout.stagger * (mobile ? 0.5 : 1), available * 0.3);
    const caption = appearance.captions ? CAPTION_BAND : 0;
    const desired = (mobile ? layout.mobileHeight : layout.cardHeight) * layout.scale;
    const baseHeight = Math.max(16, Math.min(desired, (available - stagger - caption) / 1.3));
    const left = mobile ? Math.min(padding, 20) : padding;
    let cursor = left;
    const cards: Card[] = items.map((item, i) => {
      const height = Math.max(
        16,
        Math.min(baseHeight * clamp(item.scale ?? 1, 0.45, 1.3), available - caption),
      );
      const width = height * ratioOf(item.shape);
      const offset = clamp(item.offset ?? FALLBACK_OFFSETS[i % 5], -1, 1);
      const y =
        padding +
        (available - height - caption) / 2 +
        offset * Math.min(stagger / 2, Math.max(0, (available - height - caption) / 2));
      const card: Card = {
        x: cursor,
        y,
        width,
        height,
        speed: clamp(item.speed ?? 1, -2, 2),
        index: i,
      };
      cursor += Math.max(width * 0.3, width + layout.gap - (width * layout.overlap) / 100);
      return card;
    });
    const cycle = Math.max(1, cursor - left);
    const maxWidth = Math.max(1, ...cards.map((c) => c.width));
    const buffer = maxWidth * 2 + size.width * 0.3;
    const repeats =
      motion.infinite && cards.length
        ? Math.max(1, Math.ceil((size.width + 2 * buffer) / cycle))
        : 1;
    const slots: Card[] = Array.from({ length: repeats }, (_, repeat) =>
      cards.map((c) => ({ ...c, x: c.x + repeat * cycle })),
    ).flat();
    const last = cards[cards.length - 1];
    return {
      slots,
      cycle,
      span: cycle * repeats,
      buffer,
      max: last ? Math.max(0, last.x + last.width + left - size.width) : 0,
    };
  }, [
    items,
    size.width,
    size.height,
    mobile,
    layout.cardHeight,
    layout.mobileHeight,
    layout.scale,
    layout.stagger,
    layout.padding,
    layout.gap,
    layout.overlap,
    motion.infinite,
    appearance.captions,
  ]);

  const config = useRef<ConfigSnapshot>({
    motion,
    input,
    autoplay,
    appearance,
    geometry,
    size,
    reduced,
  });
  config.current = { motion, input, autoplay, appearance, geometry, size, reduced };

  const constrain = useCallback(
    (n: number) => (config.current.motion.infinite ? n : clamp(n, 0, config.current.geometry.max)),
    [],
  );

  const draw = useCallback(
    (now: number) => {
      frame.current = 0;
      const c = config.current;
      const e = engine.current;
      // Дозвіл перевіряється щокадру, а не лише в момент пробудження.
      if (!allowed.current) {
        previousTime.current = 0;
        return;
      }
      const dt = previousTime.current ? Math.min(32, now - previousTime.current) : 16.667;
      previousTime.current = now;

      if (e.pointer === -1 && Math.abs(e.velocity) > 0.01 && !c.reduced) {
        e.target = constrain(e.target + e.velocity * dt);
        e.velocity *= Math.pow(c.motion.inertia, dt / 16.667);
        if (!c.motion.infinite && (e.target === 0 || e.target === c.geometry.max)) e.velocity = 0;
      }

      const drifting =
        c.autoplay.enabled &&
        !c.reduced &&
        e.pointer === -1 &&
        !e.focus &&
        !(c.autoplay.pauseHover && e.hover);
      if (drifting && now >= e.resumeAt) {
        e.target = constrain(
          e.target + (c.autoplay.direction === 'Left' ? 1 : -1) * c.autoplay.speed * (dt / 1000),
        );
      }
      e.target = constrain(e.target);

      const alpha = c.reduced
        ? 1
        : 1 - Math.pow(1 - clamp(c.motion.smoothness, 0.01, 1), dt / 16.667);
      e.current += (e.target - e.current) * alpha;
      if (Math.abs(e.current - e.target) < 0.01) e.current = e.target;

      if (c.motion.infinite && Math.abs(e.current) > c.geometry.span * 100) {
        const shift = Math.trunc(e.current / c.geometry.span) * c.geometry.span;
        e.current -= shift;
        e.target -= shift;
      }

      c.geometry.slots.forEach((card, i) => {
        const element = cardRefs.current[i];
        const image = imageRefs.current[i];
        if (!element) return;
        const raw = card.x - e.current;
        const x = c.motion.infinite
          ? mod(raw + c.geometry.buffer, c.geometry.span) - c.geometry.buffer
          : raw;
        const distance = clamp(
          (x + card.width / 2 - c.size.width / 2) / Math.max(1, (c.size.width + card.width) / 2),
          -1,
          1,
        );
        const depth = c.reduced ? 0 : -distance * card.width * c.motion.depth * card.speed;
        const visible = x + depth + card.width > -80 && x + depth < c.size.width + 80;
        element.style.visibility = visible ? 'visible' : 'hidden';
        element.tabIndex = visible ? 0 : -1;
        element.style.transform = `translate3d(${x + depth}px,${card.y}px,0)`;
        if (image && visible)
          image.style.transform = `translate3d(${c.reduced ? 0 : -distance * c.motion.parallax * card.speed}px,0,0)`;
      });

      // Самозасинання: наступний кадр планується, лише якщо щось рухається.
      const busy =
        e.pointer !== -1 ||
        Math.abs(e.velocity) > 0.01 ||
        Math.abs(e.target - e.current) > 0.01 ||
        drifting;
      if (busy) frame.current = requestAnimationFrame(draw);
      else previousTime.current = 0;
    },
    [constrain],
  );

  const wake = useCallback(() => {
    if (!allowed.current || frame.current) return;
    previousTime.current = 0;
    frame.current = requestAnimationFrame(draw);
  }, [draw]);

  const permitted = onScreen && tabVisible && lightbox === null;

  // Зупиняємо цикл одразу, як тільки втрачено дозвіл, і скидаємо стан
  // вказівника/інерції — інакше після повернення анімація могла б
  // продовжити політ, що почався ще до паузи.
  useEffect(() => {
    allowed.current = permitted;
    if (permitted) {
      wake();
      return;
    }
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    previousTime.current = 0;
    const e = engine.current;
    e.pointer = -1;
    e.velocity = 0;
    e.moved = false;
    e.hover = false;
    setDragging(false);
  }, [permitted, wake]);

  useSafeLayoutEffect(() => {
    wake();
  }, [geometry, reduced, motion.infinite, autoplay.enabled, wake]);

  useEffect(
    () => () => {
      allowed.current = false;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    },
    [],
  );

  const interact = () => {
    engine.current.resumeAt = performance.now() + config.current.autoplay.resumeDelay * 1000;
    wake();
  };

  const step = (direction: number) => {
    const e = engine.current;
    e.velocity = 0;
    e.target = constrain(e.target + direction * size.width * 0.65);
    interact();
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return undefined;
    const wheel = (event: WheelEvent) => {
      const c = config.current;
      if (event.target instanceof HTMLElement && event.target.closest('[data-rail-toggle]')) return;
      if (!c.input.wheel || !allowed.current || event.ctrlKey || event.metaKey) return;
      let delta =
        c.input.wheelAxis === 'Horizontal'
          ? event.deltaX
          : Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;
      if (c.input.wheelAxis === 'Horizontal' && Math.abs(event.deltaY) > Math.abs(event.deltaX))
        return;
      delta *=
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? c.size.width : 1) *
        c.input.wheelSpeed;
      if (!delta) return;
      const e = engine.current;
      const next = constrain(e.target + clamp(delta, -c.size.width, c.size.width));
      if (next === e.target && !c.motion.infinite) return;
      event.preventDefault();
      e.velocity = 0;
      e.target = next;
      interact();
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => element.removeEventListener('wheel', wheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const e = engine.current;
    if (!allowed.current || event.button !== 0 || !event.isPrimary || e.pointer !== -1) return;
    if (event.pointerType === 'touch' ? !input.touch : !input.drag) return;
    e.pointer = event.pointerId;
    e.x = e.lastX = event.clientX;
    e.y = event.clientY;
    e.lastTime = performance.now();
    e.velocity = 0;
    e.moved = false;
    interact();
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const e = engine.current;
    if (event.pointerId !== e.pointer) return;
    const dx = event.clientX - e.x;
    const dy = event.clientY - e.y;
    if (!e.moved) {
      if (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) {
        e.pointer = -1;
        return;
      }
      if (Math.abs(dx) < 6) return;
      e.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const now = performance.now();
    const delta = (e.lastX - event.clientX) * input.dragSpeed;
    e.target = constrain(e.target + delta);
    e.velocity = clamp(delta / Math.max(8, now - e.lastTime), -3, 3);
    e.lastX = event.clientX;
    e.lastTime = now;
    interact();
  };

  const pointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const e = engine.current;
    if (event.pointerId !== e.pointer) return;
    if (e.moved) e.suppressUntil = performance.now() + 300;
    if (event.type === 'pointercancel' || performance.now() - e.lastTime > 100 || reduced)
      e.velocity = 0;
    e.pointer = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    interact();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    engine.current.keyboard = true;
    engine.current.focus = true;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Home' && !motion.infinite) {
      event.preventDefault();
      engine.current.target = 0;
      engine.current.velocity = 0;
      interact();
    }
    if (event.key === 'End' && !motion.infinite) {
      event.preventDefault();
      engine.current.target = geometry.max;
      engine.current.velocity = 0;
      interact();
    }
  };

  const edge = clamp(appearance.edgeFade, 0, 30);
  const mask = edge
    ? `linear-gradient(to right,transparent,black ${edge}%,black ${100 - edge}%,transparent)`
    : undefined;

  return (
    <div
      ref={root}
      className={`${scope} ${props.className ?? ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={props.accessibilityLabel || 'Фотогалерея заходів Chin Chin'}
      tabIndex={0}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerEnd}
      onPointerCancel={pointerEnd}
      onLostPointerCapture={pointerEnd}
      onPointerLeave={(event) => {
        engine.current.hover = false;
        if (engine.current.pointer === event.pointerId && !engine.current.moved) pointerEnd(event);
        else wake();
      }}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') engine.current.hover = true;
      }}
      onPointerDownCapture={() => {
        // Клік — не клавіатурний візит, тож не має тримати автогортання.
        engine.current.keyboard = false;
      }}
      onFocusCapture={(event) => {
        const target = event.target as Element | null;
        let keyboardFocus = engine.current.keyboard;
        if (!keyboardFocus && typeof target?.matches === 'function') {
          try {
            keyboardFocus = target.matches(':focus-visible');
          } catch {
            keyboardFocus = false;
          }
        }
        engine.current.focus = keyboardFocus;
        if (!keyboardFocus) wake();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          engine.current.focus = false;
          wake();
        }
      }}
      onKeyDown={onKeyDown}
      style={{
        width: '100%',
        height: '100%',
        ...props.style,
        position: 'relative',
        overflow: 'hidden',
        background: appearance.background,
        touchAction: input.touch ? 'pan-y pinch-zoom' : 'auto',
        isolation: 'isolate',
        cursor: dragging ? 'grabbing' : input.drag ? 'grab' : 'auto',
      }}
    >
      <style>{`
        .${scope} .${scope}-card{appearance:none;border:0;padding:0;margin:0;background:transparent;color:inherit;text-align:left;font:inherit;position:absolute;top:0;left:0;will-change:transform;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:inherit}
        .${scope} .${scope}-photo{width:100%;height:100%;display:block;object-fit:cover;pointer-events:none;filter:grayscale(${grayscale ? 1 : 0});transform:scale(1);transition:filter ${reduced ? 0 : appearance.duration}s ease,transform ${reduced ? 0 : appearance.duration}s cubic-bezier(.2,.65,.3,1)}
        @media(hover:hover){.${scope} .${scope}-card:hover .${scope}-photo{filter:grayscale(0);transform:scale(${reduced ? 1 : appearance.hoverScale})}}
        .${scope} .${scope}-card:focus-visible .${scope}-photo{filter:grayscale(0)}
        .${scope} button:focus-visible,.${scope}:focus-visible{outline:2px solid ${appearance.textColor};outline-offset:-3px}
        .${scope} .${scope}-toggle{appearance:none;position:absolute;padding:0;border:1px solid rgba(20,20,20,.08);cursor:pointer;touch-action:manipulation;box-sizing:border-box;backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);transition:transform ${reduced ? 0 : 0.24}s cubic-bezier(.34,1.3,.5,1),box-shadow ${reduced ? 0 : 0.32}s ease,color ${reduced ? 0 : 0.3}s ease;box-shadow:0 2px 6px rgba(0,0,0,.05),0 10px 26px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,.9)}
        .${scope} .${scope}-toggle[data-color="true"]{box-shadow:0 2px 6px rgba(0,0,0,.05),0 10px 26px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,.9),0 0 0 1px rgba(126,142,190,.16),0 10px 30px rgba(126,96,204,.16)}
        @media(hover:hover){.${scope} .${scope}-toggle:hover{transform:translateY(${reduced ? 0 : -2}px)}}
        .${scope} .${scope}-toggle:active{transform:scale(${reduced ? 1 : 0.965})}
        .${scope} .${scope}-toggle:focus-visible{outline:2px solid currentColor;outline-offset:3px}
        .${scope} .${scope}-label{position:absolute;top:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;white-space:nowrap;font-family:Inter,sans-serif;font-weight:600;letter-spacing:.14em;transition:opacity ${reduced ? 0 : 0.26}s ease,transform ${reduced ? 0 : 0.3}s cubic-bezier(.3,1.2,.4,1)}
        .${scope} .${scope}-thumb{position:absolute;border-radius:50%;pointer-events:none;background:${SPECTRUM};box-shadow:0 1px 3px rgba(0,0,0,.22),inset 0 0 0 2px rgba(255,255,255,.92);transition:transform ${reduced ? 0 : 0.44}s cubic-bezier(.32,1.22,.4,1),filter ${reduced ? 0 : 0.4}s ease}
        @media(hover:hover){.${scope} .${scope}-toggle:hover .${scope}-thumb{box-shadow:0 2px 6px rgba(0,0,0,.24),inset 0 0 0 2px rgba(255,255,255,.98)}}
      `}</style>

      <div style={{ position: 'absolute', inset: 0, maskImage: mask, WebkitMaskImage: mask }}>
        {geometry.slots.map((card, slot) => {
          const item = items[card.index];
          const bleed = reduced ? 0 : Math.abs(motion.parallax * card.speed) + 2;
          return (
            <button
              key={`${card.index}-${slot}`}
              type="button"
              className={`${scope}-card`}
              ref={(el) => {
                cardRefs.current[slot] = el;
              }}
              aria-label={`${popup.enabled ? 'Відкрити ' : ''}${item.alt || item.title || `зображення ${card.index + 1}`}`}
              aria-haspopup={popup.enabled ? 'dialog' : undefined}
              onClick={(event) => {
                if (performance.now() < engine.current.suppressUntil) {
                  event.preventDefault();
                  return;
                }
                if (popup.enabled) {
                  engine.current.velocity = 0;
                  setLightbox(card.index);
                }
              }}
              onDragStart={(event) => event.preventDefault()}
              style={{
                width: card.width,
                height: card.height + (appearance.captions ? CAPTION_BAND : 0),
                transform: `translate3d(${card.x}px,${card.y}px,0)`,
                zIndex: (card.index % 3) + 1,
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: card.height,
                  overflow: 'hidden',
                  borderRadius: layout.radius,
                  position: 'relative',
                  background: '#D8D6D0',
                }}
              >
                <div
                  ref={(el) => {
                    imageRefs.current[slot] = el;
                  }}
                  style={{ position: 'absolute', inset: `0 ${-bleed}px`, willChange: 'transform' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      той самий кадр повторюється в кількох слотах доріжки
                      (нескінченна прокрутка дублює картки для безшовного
                      циклу), а ширина картки рахується в JS (геометрія
                      стрічки, draw()), не в CSS-брейкпоінтах — next/image
                      тут додав би лише зайвий шар без реальної оптимізації. */}
                  <img
                    className={`${scope}-photo`}
                    src={item.src}
                    sizes={`${Math.ceil(card.width + bleed * 2)}px`}
                    alt={item.alt || item.title || ''}
                    loading={slot < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              </div>
              {appearance.captions && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    paddingTop: 9,
                    font: '11px/1.3 Inter, sans-serif',
                    letterSpacing: '.02em',
                    color: appearance.textColor,
                  }}
                >
                  <span
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                  >
                    {item.title}
                  </span>
                  <span style={{ opacity: 0.45 }}>{String(card.index + 1).padStart(2, '0')}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!items.length && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            font: '14px Inter, sans-serif',
            color: appearance.textColor,
          }}
        >
          Додайте зображення в пропі images.
        </div>
      )}

      {grayscaleButton.show && (
        <button
          type="button"
          className={`${scope}-toggle`}
          data-rail-toggle
          data-color={!grayscale}
          aria-label="Чорно-біле зображення"
          aria-pressed={grayscale}
          title={grayscale ? 'Увімкнути колір' : 'Увімкнути чорно-біле'}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setGrayscale((value) => !value);
          }}
          style={{
            ...cornerAt(grayscaleButton.position, grayscaleButton.inset),
            zIndex: 20,
            width: gauge.width,
            height: gauge.height,
            borderRadius: gauge.height / 2,
            background: grayscaleButton.background,
            color: grayscale ? grayscaleButton.color : grayscaleButton.litColor,
          }}
        >
          <span
            className={`${scope}-label`}
            style={{
              left: gauge.pad,
              right: gauge.pad + gauge.thumb,
              fontSize: gauge.label,
              opacity: grayscale ? 0 : 1,
              transform: `translateX(${grayscale ? -5 : 0}px)`,
            }}
          >
            COLOR
          </span>
          <span
            className={`${scope}-label`}
            style={{
              left: gauge.pad + gauge.thumb,
              right: gauge.pad,
              fontSize: gauge.label,
              opacity: grayscale ? 1 : 0,
              transform: `translateX(${grayscale ? 0 : 5}px)`,
            }}
          >
            B / W
          </span>
          <span
            className={`${scope}-thumb`}
            style={{
              top: gauge.pad,
              left: gauge.pad,
              width: gauge.thumb,
              height: gauge.thumb,
              transform: `translateX(${grayscale ? 0 : gauge.travel}px) rotate(${grayscale ? 0 : 190}deg)`,
              filter: `grayscale(${grayscale ? 1 : 0}) saturate(${grayscale ? 1 : 1.06})`,
            }}
          />
        </button>
      )}

      {lightbox !== null && items[lightbox] && (
        <Lightbox
          items={items}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => {
            setLightbox(null);
            interact();
          }}
          background={popup.background}
          captions={popup.captions}
          reduced={reduced}
          scope={scope}
        />
      )}
    </div>
  );
}
