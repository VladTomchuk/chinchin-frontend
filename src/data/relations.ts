import { eventTypeSlugs, eventTypes, type EventType, type EventTypeSlug } from './eventTypes';
import { serviceSlugs, services, type Service, type ServiceSlug } from './services';

/**
 * Послуги, доречні для типу події. Читає той самий масив services[].eventTypes,
 * що й зворотна функція — тому додати нову послугу достатньо в одному місці, і
 * вона сама зʼявиться на всіх відповідних сторінках подій.
 */
export function getServicesForEvent(eventSlug: EventTypeSlug): Service[] {
  return services.filter((service) => service.eventTypes.includes(eventSlug));
}

/** Типи подій, для яких доречна послуга. Виводиться фільтром, не дублюється. */
export function getEventTypesForService(serviceSlug: ServiceSlug): EventType[] {
  const service = services.find((item) => item.slug === serviceSlug);
  if (!service) return [];

  return eventTypes.filter((eventType) => service.eventTypes.includes(eventType.slug));
}

// Сторінки [slug] отримують slug рядком із URL — його треба звузити до
// відомого слага, інакше на невідомій адресі впаде переклад, а не 404.
export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}

export function isEventTypeSlug(value: string): value is EventTypeSlug {
  return (eventTypeSlugs as readonly string[]).includes(value);
}

/**
 * Споріднені послуги для блоку перелінковки внизу сторінки послуги. Беремо
 * ручний список із services[].related, вирізаємо саму сторінку (щоб вона не
 * посилалась на себе) і добираємо до мінімуму рештою каталогу — так блок ніколи
 * не буває порожнім чи з однією карткою, навіть якщо для нової послуги звʼязки
 * ще не проставили.
 */
const RELATED_MIN = 2;
const RELATED_MAX = 3;

export function getRelatedServices(serviceSlug: ServiceSlug): Service[] {
  const current = services.find((item) => item.slug === serviceSlug);

  const curated = (current?.related ?? [])
    .filter((slug) => slug !== serviceSlug)
    .map((slug) => services.find((item) => item.slug === slug))
    .filter((item): item is Service => item !== undefined);

  const picked = curated.slice(0, RELATED_MAX);
  if (picked.length >= RELATED_MIN) return picked;

  const fallback = services.filter(
    (item) => item.slug !== serviceSlug && !picked.some((chosen) => chosen.slug === item.slug),
  );

  return [...picked, ...fallback].slice(0, RELATED_MAX);
}
