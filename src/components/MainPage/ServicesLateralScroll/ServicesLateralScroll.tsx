'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Heading } from '@chakra-ui/react';
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import { services, type ServiceSlug } from '@/data/services';
import styles from './ServicesLateralScroll.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Panel = {
  key: string;
  name: string;
  description: string;
  /** Фото-фон картки формату. */
  photo: string;
  isPlaceholder: boolean;
  href?: { pathname: '/services/[slug]'; params: { slug: ServiceSlug } };
};

// Фото — декоративна атмосфера (виїзний бар), не привʼязана до конкретного
// формату послуги, тож alt="" (той самий підхід, що й у EventTypesScroll.tsx).
// Ротуються по індексу панелі.
const CARD_PHOTOS = [
  '/events/bar-service-01.jpg',
  '/events/bar-service-02.jpg',
  '/events/bar-service-03.jpg',
  '/events/bar-service-04.jpg',
  '/events/bar-service-05.jpg',
  '/events/bar-service-06.jpg',
];

// Велике фото зліва — статичний фон під текст-заглушку секції.
const LEFT_PHOTO = '/hero/betby_cocktail.jpg';

// ТИМЧАСОВО: заглушки, щоб піновану секцію було на чому перевірити — реальних
// форматів послуг поки лише два (див. data/services.ts). Той самий підхід, що
// й PLACEHOLDER_SLIDES у EventTypesScroll.tsx: прибрати цей масив, коли
// services.ts поповниться настільки, що заглушки стануть зайві. Позначка
// "Заглушка" в назві відрізняє їх від реального контенту.
const PLACEHOLDER_PANELS: Omit<Panel, 'href' | 'photo' | 'isPlaceholder'>[] = [
  {
    key: 'placeholder-coffee-bar',
    name: 'Заглушка: Кавовий бар',
    description: 'Тимчасова картка для перевірки піна — не реальний формат послуги.',
  },
  {
    key: 'placeholder-catering',
    name: 'Заглушка: Кейтеринг на подію',
    description: 'Тимчасова картка для перевірки піна — не реальний формат послуги.',
  },
  {
    key: 'placeholder-staff',
    name: 'Заглушка: Персонал та обслуговування',
    description: 'Тимчасова картка для перевірки піна — не реальний формат послуги.',
  },
];

// Скільки висоти екрана припадає на перегляд одного пункту, поки секція
// запінена (GSAP сам домножує це на кількість пунктів — див. `end` нижче).
// Менше — швидший скрол крізь пункти, більше — довше "затримується" кожен.
const VH_PER_ITEM = 0.7;

// Частка "юніта" таймлайну (один пункт = 1 юніт), яку займає сам перехід між
// пунктами. Решта юніта — час, поки пункт просто стоїть непорушно й читається.
const TRANSITION_FRACTION = 0.4;

/**
 * Пінована секція форматів бару (за мотивами GSAP ScrollTrigger "pin + scrub"):
 * зліва — велика фото-картка зі статичним заголовком секції (текст-заглушка
 * поверх фото), праворуч — одна фото-картка формату, що перехресно
 * проявляється (autoAlpha + невеликий зсув по Y) під кожен наступний формат.
 * Картка стилізована як на макеті: фото на весь розмір, назва внизу зліва,
 * кругла кнопка-стрілка у виріз-нотч внизу справа (посилання на сторінку
 * формату).
 *
 * autoAlpha (opacity + visibility) замість самого opacity — щоб невидимі
 * картки не лишались у фокус-порядку: кнопка-стрілка неактивної картки не
 * повинна ловити фокус клавіатурою, поки її не видно. Базові значення (перша
 * картка видима, решта — ні) продубльовані в CSS (.cardPanel та
 * .cardPanel:first-child), щоб не було спалаху "всі картки накладені одна на
 * одну", поки JS ще не встиг виставити стан.
 *
 * Один gsap.timeline() з єдиним scrollTrigger (pin+scrub) — кросфейд карток
 * керується одним прогресом скролу, без окремих шарів інерції (той самий
 * принцип, що й у EventTypesScroll.tsx, див. коментар там).
 */
export default function ServicesLateralScroll() {
  const t = useTranslations('ServicesLateralScroll');
  const tItems = useTranslations('ServiceItems');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardPanelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Перелік послуг у вступному тексті ліворуч — рядок, написаний як єдине
  // ціле в копірайті (усі назви через « · »), а не виведений із services[]:
  // порядок тут авторський (наприклад, "Bartender for Events" одразу після
  // коктейльного бару), а не порядок картки в каталозі, тож зведення двох
  // джерел правди лише заплутало б.
  const servicesListText = (t.raw('servicesList') as string[]).join(' · ');

  const panels: Panel[] = [
    ...services.map((service, i) => ({
      key: service.slug,
      name: tItems(`${service.slug}.name`),
      description: tItems(`${service.slug}.shortDescription`),
      photo: CARD_PHOTOS[i % CARD_PHOTOS.length],
      isPlaceholder: false,
      href: { pathname: '/services/[slug]' as const, params: { slug: service.slug } },
    })),
    ...PLACEHOLDER_PANELS.map((panel, i) => ({
      ...panel,
      photo: CARD_PHOTOS[(services.length + i) % CARD_PHOTOS.length],
      isPlaceholder: true,
    })),
  ];

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Фолбек — статичний стовпчик карток з @media у module.css (той самий
      // блок, що вмикається на вузьких екранах). Пін/кросфейд не будуємо.
      if (
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 900px)').matches
      ) {
        return;
      }

      const cardEls = cardPanelRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (cardEls.length < 2) return;

      gsap.set(cardEls[0], { autoAlpha: 1, y: 0 });
      gsap.set(cardEls.slice(1), { autoAlpha: 0, y: 24 });

      // Момент (у "юнітах" таймлайну), з якого пункт i+1 стає активним (той
      // самий розрахунок, що й у EventTypesScroll.tsx).
      const switchPoints = cardEls.slice(0, -1).map((_, i) => i + (1 - TRANSITION_FRACTION));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${cardEls.length * window.innerHeight * VH_PER_ITEM}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        const at = switchPoints[i];
        const next = cardEls[i + 1];

        tl.to(
          card,
          { autoAlpha: 0, y: -24, duration: TRANSITION_FRACTION, ease: 'power1.inOut' },
          at,
        ).to(next, { autoAlpha: 1, y: 0, duration: TRANSITION_FRACTION, ease: 'power1.inOut' }, at);
      });

      // Порожній "хвіст" в 1 юніт — щоб довжина таймлайну дорівнювала кількості
      // пунктів, а не (кількість − 1) (детальніше — у коментарі
      // EventTypesScroll.tsx).
      tl.to({}, { duration: 1 });
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inner}>
        {/* Ліва фото-картка — статична, з текстом-заглушкою поверх фото. */}
        <div className={styles.leftCard}>
          <Image
            src={LEFT_PHOTO}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            priority
            className={styles.leftPhoto}
          />
          <div className={styles.leftOverlay} />
          <div className={styles.leftContent}>
            <span className={styles.chip}>{t('eyebrow')}</span>
            <Heading
              as="h2"
              fontFamily="var(--font-brand)"
              fontWeight="200"
              lineHeight="1.05"
              fontSize={{ base: '1.75rem', md: '2.75rem' }}
              color="#fff9f6"
            >
              {t('title')}
            </Heading>
            <p className={styles.lead}>{t('lead')}</p>
            <p className={styles.servicesList}>{servicesListText}</p>
            <Link href="/services" className={styles.cta}>
              {t('cta')}
              <LuArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Права колонка — одна фото-картка формату. Стек панелей накладено
            одна на одну через position:absolute, кросфейд керує JS. */}
        <div className={styles.rightStage}>
          {panels.map((panel, i) => (
            <div
              key={panel.key}
              ref={(el) => {
                cardPanelRefs.current[i] = el;
              }}
              className={styles.cardPanel}
            >
              {/* Шар з нотчем (mask) — фото, затемнення й назва. Кнопка-стрілка
                  навмисно ЗОВНІ цього шару: mask вирізав би її частину над
                  нотчем. */}
              <div className={styles.cardMasked}>
                <Image
                  src={panel.photo}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  className={styles.cardPhoto}
                />
                <div className={styles.cardTint} />
                <div className={styles.cardName}>{panel.name}</div>
              </div>

              {panel.href ? (
                <Link href={panel.href} aria-label={panel.name} className={styles.arrowLink}>
                  <span className={styles.arrowBtn}>
                    <LuArrowUpRight size={20} aria-hidden />
                  </span>
                </Link>
              ) : (
                <div className={styles.arrowLink} aria-hidden="true">
                  <span className={styles.arrowBtn}>
                    <LuArrowUpRight size={20} aria-hidden />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Прихований, але доступний читалкам список — картка праворуч
          декоративна (кросфейд), тож перелік форматів дублюємо тут звичайним
          текстом. */}
      <ul className={styles.srOnly}>
        {panels.map((panel) => (
          <li key={panel.key}>
            {panel.href ? (
              <Link href={panel.href}>
                {panel.name} — {panel.description}
              </Link>
            ) : (
              `${panel.name} — ${panel.description}`
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
