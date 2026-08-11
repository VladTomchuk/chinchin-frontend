/**
 * Фотографії з подій для галереї на сторінках подій.
 *
 * Імена поки нейтральні (bar-service-NN), бо прив'язки кадрів до конкретних
 * заходів ще немає. Коли буде відомо, який знімок з якого заходу, файли
 * переїдуть у public/events/{event}-{city}/ і перейменуються за схемою
 * {event}-{city}-{nn}.jpg — правити треба буде тільки цей файл, бо всі
 * посилання йдуть звідси.
 *
 * Вихідні кадри лежать у ~/Downloads/Photos-1-001; сюди потрапили стиснуті
 * копії (довша сторона 1600px, JPEG q80).
 *
 * altKey вказує на CorporateEvents.gallery.alt.{altKey} — alt теж перекладається.
 * Опис має відповідати тому, що справді видно на кадрі: назву заходу без
 * підтвердження туди писати не можна.
 */

export type EventPhoto = {
  /** Шлях від public/. */
  src: string;
  altKey: string;
  width: number;
  height: number;
};

export const eventPhotos: EventPhoto[] = [
  { src: '/events/bar-service-01.jpg', altKey: 'straining', width: 1600, height: 1068 },
  { src: '/events/bar-service-02.jpg', altKey: 'glassware', width: 1600, height: 1068 },
  { src: '/events/bar-service-03.jpg', altKey: 'themedBar', width: 1066, height: 1600 },
  { src: '/events/bar-service-04.jpg', altKey: 'shaking', width: 1066, height: 1600 },
  { src: '/events/bar-service-05.jpg', altKey: 'brandedFoam', width: 1064, height: 1600 },
  { src: '/events/bar-service-06.jpg', altKey: 'guest', width: 1200, height: 1600 },
];
