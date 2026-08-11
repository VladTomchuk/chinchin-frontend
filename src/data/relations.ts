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
