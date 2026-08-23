import type { IconType } from 'react-icons';
import {
  LuBeer,
  LuCoffee,
  LuGlassWater,
  LuHandPlatter,
  LuLeaf,
  LuMartini,
  LuSprout,
  LuUserRound,
  LuWine,
} from 'react-icons/lu';
import type { EventTypeSlug } from './eventTypes';

// Тексти (cardName, h1, описи, мета-теги, тіло сторінки) тут навмисно не
// лежать — вони в messages/{ua,en}.json під ключем ServiceItems.{slug}. Сайт
// двомовний, тож будь-який текст у цьому файлі був би одномовним. Див. коментар
// в eventTypes.ts.
//
// Відповідність полів із ТЗ ключам у перекладах (назви ключів історичні, їх не
// перейменовували, щоб ServiceItems і EventItems лишались однакової форми):
//   cardName        → ServiceItems.{slug}.name
//   pageTitle       → ServiceItems.{slug}.metaTitle
//   h1              → ServiceItems.{slug}.h1
//   metaDescription → ServiceItems.{slug}.metaDescription
//   shortDescription→ ServiceItems.{slug}.shortDescription
//   heroImage alt   → ServiceItems.{slug}.heroImageAlt
//   bodyContent     → ServiceItems.{slug}.body.*
// Три заголовки (name / metaTitle / h1) — три різні поля й три різні тексти:
// картка в сітці, сніпет у видачі та заголовок на сторінці читаються в різних
// контекстах, і зведення їх до одного рядка щоразу псує щонайменше два з трьох.

// Порядок — той, у якому послуги йдуть у сітці каталогу.
export const serviceSlugs = [
  'mobile-cocktail-bar',
  'bartender-for-events',
  'open-bar',
  'self-service-bar',
  'draught-beer-bar',
  'coffee-corner',
  'matcha-bar',
  'healthy-bar',
  'dry-bar',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/**
 * Слаг однаковий в обох локалях: /en/services/mobile-cocktail-bar і
 * /ua/services/mobile-cocktail-bar. Локалізовані слаги next-intl підтримує (об'єкт
 * замість рядка в routing.pathnames), але тут вони лише додали б по два
 * значення на послугу без користі — англомовний слаг однаково читабельний в
 * обох мовах, а спільний слаг тримає canonical/hreflang-пару очевидною.
 */
export type Service = {
  slug: ServiceSlug;
  /** Іконка картки. Не текст, тому лишається в даних, а не в перекладах. */
  Icon: IconType;
  /**
   * Шлях від public/. Спільний для обох локалей — перекладається тільки alt
   * (ServiceItems.{slug}.heroImageAlt).
   */
  heroImage: string;
  /**
   * true — у public/ немає кадру, який справді показує цю послугу, і стоїть
   * найближчий тематично. Такі послуги виводяться в підсумку як ті, що чекають
   * на реальне фото; сам прапорець на верстку не впливає.
   */
  heroImageIsStandIn?: true;
  /**
   * Типи подій, для яких послуга доречна. Звʼязок many-to-many описаний тільки
   * тут, в один бік. Зворотний ("які послуги радити для цієї події") не
   * дублюємо — його виводить фільтр у relations.ts, інакше два списки рано чи
   * пізно розійшлися б.
   */
  eventTypes: EventTypeSlug[];
  /**
   * Перелінковка «вам може сподобатися» — 2-3 сусідні послуги. Список ручний, а
   * не виведений із eventTypes: споріднені формати часто ходять на ті самі
   * події (усі вісім — на корпоратив), тож автоматичний вивід дав би на кожній
   * сторінці однакову сімку. Порожній список добере getRelatedServices().
   */
  related: ServiceSlug[];
  /**
   * true — послуга має власну сторінку з ручною версткою в
   * app/[locale]/services/{slug}/. Такі слаги виключаються з
   * generateStaticParams шаблонної сторінки [slug]: статичний маршрут у Next.js
   * і так перемагає динамічний, а генерувати обидва немає сенсу.
   */
  customPage?: true;
};

export const services: Service[] = [
  {
    slug: 'mobile-cocktail-bar',
    Icon: LuMartini,
    // Кадр обрала власниця. Келих трохи нижче центру, ліва частина столу
    // порожня — тому в повноекранному герої текст стоїть знизу зліва, а
    // objectPosition зміщений вниз, щоб келих не зрізало на вузьких екранах.
    // УВАГА: оригінал 6016×4016 і 9.3 МБ. next/image стисне його на льоту, але
    // перший незакешований запит буде повільним — варто покласти поряд
    // зменшену копію (довша сторона ~2400px).
    heroImage: '/hero/betby_cocktail.jpg',
    eventTypes: ['corporate-business-events', 'weddings'],
    related: ['open-bar', 'dry-bar', 'self-service-bar'],
  },
  {
    slug: 'bartender-for-events',
    Icon: LuUserRound,
    // Гість-бармен за роботою на терасі. Кадр не привʼязаний до цього формату
    // конкретно (той самий, що й hero-04 деінде на сайті) — послуга про
    // персонал, а не про конкретний бар, тож підійде будь-яке фото бармена.
    heroImage: '/hero/hero-04.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events', 'weddings'],
    related: ['mobile-cocktail-bar', 'open-bar', 'self-service-bar'],
  },
  {
    slug: 'open-bar',
    Icon: LuWine,
    // Бармен проціджує в довгий ряд готових келихів — потокова видача.
    heroImage: '/hero/hero-06.jpg',
    eventTypes: ['corporate-business-events', 'weddings'],
    related: ['mobile-cocktail-bar', 'draught-beer-bar', 'self-service-bar'],
  },
  {
    slug: 'self-service-bar',
    Icon: LuHandPlatter,
    // Барна станція з виставленим посудом. Станція на кадрі з барменами, а не
    // без них, — реального self-service-кадру в public/ немає.
    heroImage: '/about_us/IMG_8979.jpeg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events', 'weddings'],
    related: ['open-bar', 'draught-beer-bar', 'coffee-corner'],
  },
  {
    slug: 'draught-beer-bar',
    Icon: LuBeer,
    // Гість із келихом на події просто неба. Пива, кранів і кег у public/ немає
    // жодного кадру — це найближчий за настроєм, але не за напоєм.
    heroImage: '/hero/hero-02.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events'],
    related: ['open-bar', 'self-service-bar', 'mobile-cocktail-bar'],
  },
  {
    slug: 'coffee-corner',
    Icon: LuCoffee,
    // Трафарет над пінкою в темному стакані — найближче до кавової станції.
    heroImage: '/hero/hero-08.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events'],
    related: ['matcha-bar', 'healthy-bar', 'self-service-bar'],
  },
  {
    slug: 'matcha-bar',
    Icon: LuSprout,
    // Напій із густою пінкою й листком у руках. Матчі, вінчика та зеленого чаю
    // в public/ немає взагалі — кадр стоїть за формою, не за вмістом.
    heroImage: '/events/bar-service-06.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events'],
    related: ['coffee-corner', 'healthy-bar', 'dry-bar'],
  },
  {
    slug: 'healthy-bar',
    Icon: LuLeaf,
    // Кадр уже стоїть у HealthyBar/Hero.tsx — лишаємо той самий, щоб сторінка й
    // її картка в каталозі показували одне фото.
    heroImage: '/hero/hero-03.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events'],
    related: ['matcha-bar', 'dry-bar', 'coffee-corner'],
    customPage: true,
  },
  {
    slug: 'dry-bar',
    Icon: LuGlassWater,
    // Одинокий келих із пінкою на нейтральному тлі: у кадрі немає ні пляшок, ні
    // барної стійки, тож він не суперечить безалкогольному формату.
    heroImage: '/hero/hero-01.jpg',
    heroImageIsStandIn: true,
    eventTypes: ['corporate-business-events', 'weddings'],
    related: ['healthy-bar', 'matcha-bar', 'mobile-cocktail-bar'],
  },
];
