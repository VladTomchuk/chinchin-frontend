// Хіро-галерея піниться на весь екран, і поки триває зум, шапка над нею зайва:
// вона має плавно з'явитись рівно тоді, коли центральне фото повністю відкрите.
// Навбар рендериться в layout і про галерею нічого не знає, тому обмінюємось
// через цей крихітний стор замість того, щоб зв'язувати компоненти напряму.

export type HeroZoomState = {
  /** Позиція скролу, на якій зум завершується. Далі це «верх контенту». */
  end: number;
  /** true, коли центральне фото вже розгорнуте на весь екран. */
  complete: boolean;
};

type Listener = () => void;

let state: HeroZoomState | null = null;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

/** null означає, що на цій сторінці хіро-галереї немає. */
export function getHeroZoom(): HeroZoomState | null {
  return state;
}

/** На сервері галереї ще немає — навбар рендериться у звичайному режимі. */
export function getServerHeroZoom(): HeroZoomState | null {
  return null;
}

export function setHeroZoom(end: number, complete: boolean) {
  if (state && state.end === end && state.complete === complete) return;
  state = { end, complete };
  emit();
}

export function clearHeroZoom() {
  if (state === null) return;
  state = null;
  emit();
}

export function subscribeHeroZoom(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
