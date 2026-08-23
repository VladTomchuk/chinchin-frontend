'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import type { EventTypeSlug } from '@/data/eventTypes';
import { services } from '@/data/services';
import styles from './EventServicesSlider.module.css';

/** 'all' — окремий стан фільтра, а не тип події: показує весь каталог. */
type Filter = EventTypeSlug | 'all';

// Наскільки далеко треба протягнути доріжку, щоб відпускання перемкнуло слайд.
// Менше — випадковий рух пальця гортає карусель, більше — свайп «не спрацьовує».
const DRAG_THRESHOLD_PX = 60;

// З якого зсуву вважаємо, що це перетягування, а не тап.
const DRAG_CLICK_SUPPRESSION_PX = 8;

// Частину описів послуг ще не написано — у messages/{ua,en}.json на їх місці
// стоять заглушки виду "[COPY PENDING — … — Short Description]". У картці такий
// рядок читається як помилка, тож підставляємо рибу: одразу видно, що текст
// тимчасовий, і верстка тримає реальну довжину абзацу. Коли копірайт приїде,
// заглушки зникнуть із перекладів — і ця підстановка перестане спрацьовувати
// сама, без правок тут.
const COPY_PENDING_PREFIX = '[COPY PENDING';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dolor turpis, dictum a efficitur in, aliquam eget velit. Sed efficitur eget risus nec tristique.';

// Те саме правило для назви. Заглушка ("[COPY PENDING — Open Bar — UK — Card
// Name]") у кеглі 64px розкладається на чотири рядки й розсуває картку так, що
// про верстку по ній судити вже не можна — коротка риба тримає реальну довжину
// назви.
const LOREM_TITLE = 'Lorem ipsum';

/**
 * Карусель послуг під тип події — відтворення слайдера з першої секції
 * webflow-path-one.webflow.io. Композиція й тайминги зняті з самого референсу:
 * розміри й типографіка з його CSS, анімація — з визначення його
 * Webflow-інтеракцій (IX2, дії SLIDER_ACTIVE / SLIDER_INACTIVE). Розкладку
 * чисел див. у шапці CSS-модуля; коротко:
 *
 *   активна картка стоїть по центру в натуральний розмір, бічні — scale 0.7
 *   навколо власного центру (тому вони не лише дрібніші, а й нижчі);
 *   картка, що входить, росте 0.7 → 1 за 1800ms inOutCirc, фото всередині
 *   водночас від'їжджає 1.3 → 1;
 *   назва, опис і кнопка виїжджають знизу з-під маски з розпрямленням нахилу
 *   (skewY 5° → 0) по черзі — на 700, 800 і 900 мілісекунді;
 *   картка, що виходить, робить те саме назад, але за 600ms і іншою кривою.
 *
 * Уся анімація — CSS-переходи між двома станами (є клас .slideActive чи
 * немає), тож асиметрію «вхід повільний, вихід швидкий» дає просто різний
 * transition у базовому правилі та в .slideActive. JS тут рахує лише індекс.
 *
 * Центрування зроблено в CSS без жодного вимірювання в JS: доріжка має лівий
 * відступ на півекрана мінус півслайда, а React дає їй тільки номер активного
 * слайда (--ess-index) — усе інше рахує сам браузер (див. .track у CSS-модулі).
 * Тому ресайз вікна нічого не ламає й не потребує ані ResizeObserver, ані
 * перерахунку.
 *
 * Фільтр за типом події лишився в даних без власного UI: чипи, які його
 * перемикали, прибрано разом з рештою тимчасово закоментованого коду (нижче
 * `filter` тому й не деструктурує сеттер із useState — писати в нього поки
 * нема звідки). Звʼязок many-to-many все ще береться з services[].eventTypes
 * (єдине джерело правди, див. data/relations.ts) — досить повернути UI, який
 * зможе його змінювати, і фільтрація одразу запрацює знову.
 *
 * Кожен слайд — повноцінне посилання на сторінку послуги, і активний, і бічні:
 * так усі девʼять адрес лишаються в розмітці для читалок і пошуковика без
 * дубльованого прихованого списку. Клік по бічному слайду не веде за
 * посиланням, а підводить його в центр (перший клік — вибір, другий — перехід).
 * Тип елемента при цьому не міняється, тому фокус нікуди не зникає — а от
 * підміна <button> на <a> при зміні активного слайда фокус би губила.
 */
export default function EventServicesSlider() {
  const t = useTranslations('EventServicesSlider');
  const tItems = useTranslations('ServiceItems');
  const tCatalog = useTranslations('Catalog');

  const [filter] = useState<Filter>('all');
  const [index, setIndex] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Стан жесту живе в ref, а не в state, з двох причин: між кадрами pointermove
  // він не має викликати ререндер, і — головне — його читають обробники того
  // самого потоку подій (pointerdown → pointermove → pointerup). Оновлення
  // state до них не доїжджає: у замиканні лишалося б старе значення, і швидкий
  // свайп «не спрацьовував би». isDragging у state лишається тільки заради
  // класу .dragging у розмітці.
  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const dragging = useRef(false);

  const visibleServices = useMemo(
    () => (filter === 'all' ? services : services.filter((s) => s.eventTypes.includes(filter))),
    [filter],
  );

  const lastIndex = visibleServices.length - 1;

  const clamp = useCallback(
    (next: number) => Math.min(Math.max(next, 0), Math.max(lastIndex, 0)),
    [lastIndex],
  );

  const goTo = useCallback((next: number) => setIndex(() => clamp(next)), [clamp]);

  /** Крок від ПОПЕРЕДНЬОГО стану, а не від значення з поточного рендеру: два
      кліки в одному тіку (швидке подвійне натискання стрілки) інакше обидва
      порахували б index + 1 від того самого index і зсунули б карусель на один
      слайд замість двох. */
  const step = useCallback((delta: number) => setIndex((prev) => clamp(prev + delta)), [clamp]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Мишею доріжку не тягнуть: на десктопі слайди гортаються тільки стрілками
    // (і стрілками з клавіатури). Свайп лишається пальцем і стилусом, бо там
    // кнопки дрібні, а жест — основний спосіб гортати.
    if (e.pointerType === 'mouse') return;
    if (e.button !== 0) return;

    dragStartX.current = e.clientX;
    dragMoved.current = false;
    dragging.current = true;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;

    // Захоплення вмикаємо не на pointerdown, а щойно палець реально поїхав.
    // Захоплений вказівник перенацілює на контейнер і подальший click — тобто
    // на pointerdown ми б забрали в слайдів усі кліки, і жоден із них не
    // спрацював би ні як вибір картки, ні як перехід за посиланням.
    if (Math.abs(dx) > DRAG_CLICK_SUPPRESSION_PX && !dragMoved.current) {
      dragMoved.current = true;
      // Кидає NotFoundError, якщо вказівник до цього моменту вже відпущено.
      // Без перехоплення виняток обірвав би жест на середині: dragging.current
      // лишився б true, і слайдер реагував би на будь-який наступний рух
      // вказівника, ніби його досі тягнуть.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Захоплення — оптимізація (жест не губиться за межами контейнера),
        // а не умова роботи: без нього перетягування триває як є.
      }
    }

    setDragDx(dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;

    if (dx <= -DRAG_THRESHOLD_PX) step(1);
    else if (dx >= DRAG_THRESHOLD_PX) step(-1);

    dragging.current = false;
    setIsDragging(false);
    setDragDx(0);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  // Клік, яким завершився свайп, не має спрацьовувати як перехід за посиланням.
  const onSlideClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };

  // Перший клік по бічному слайду вибирає його, а не переходить на сторінку:
  // текст картки поки під завісою, тож переходити було б наосліп.
  const onSlideClick = (e: React.MouseEvent, i: number) => {
    if (i === index) return;
    e.preventDefault();
    goTo(i);
  };

  return (
    <section id="services-by-event" className={styles.section} aria-label={t('title')}>
      {visibleServices.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        <>
          <div
            className={`${styles.viewport} ${isDragging ? styles.dragging : ''}`}
            role="group"
            aria-roledescription={t('carousel')}
            aria-label={t('title')}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onSlideClickCapture}
          >
            <div
              className={styles.track}
              style={
                {
                  '--ess-index': index,
                  '--ess-drag': `${dragDx}px`,
                } as React.CSSProperties
              }
            >
              {visibleServices.map((service, i) => {
                const isActive = i === index;
                const rawName = tItems(`${service.slug}.name`);
                const rawDescription = tItems(`${service.slug}.shortDescription`);
                const name = rawName.startsWith(COPY_PENDING_PREFIX) ? LOREM_TITLE : rawName;
                const description = rawDescription.startsWith(COPY_PENDING_PREFIX)
                  ? LOREM
                  : rawDescription;

                return (
                  <Link
                    key={service.slug}
                    href={{ pathname: '/services/[slug]', params: { slug: service.slug } }}
                    aria-label={name}
                    aria-current={isActive ? 'true' : undefined}
                    className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                    onClick={(e) => onSlideClick(e, i)}
                    // Таб по слайдах підводить сфокусований у центр — інакше
                    // фокус ішов би в картку, яку майже не видно.
                    onFocus={() => goTo(i)}
                  >
                    <div className={styles.content}>
                      <div className={styles.photo}>
                        <Image
                          src={service.heroImage}
                          // Фото декоративне: назву послуги дає сусідній текст, а
                          // самі кадри поки не привʼязані до конкретної послуги
                          // (heroImageIsStandIn у data/services.ts) — той самий
                          // підхід, що й у EventTypesScroll.
                          alt=""
                          fill
                          // Слайд ≈30% ширини екрана на десктопі й ≈80% на
                          // мобільному — див. --ess-slide-w у CSS-модулі.
                          sizes="(max-width: 768px) 80vw, 30vw"
                          priority={i === 0}
                          className={styles.photoImg}
                        />
                        <span className={styles.photoFade} />
                      </div>

                      <div className={`${styles.name} ${styles.clip}`}>
                        <div className={styles.clipInner}>
                          <span className={styles.nameText}>{name}</span>
                        </div>
                      </div>

                      <div className={`${styles.description} ${styles.clip}`}>
                        <div className={styles.clipInner}>
                          <p className={styles.descriptionText}>{description}</p>
                        </div>
                      </div>

                      <div className={`${styles.ctaWrap} ${styles.clip}`}>
                        <div className={styles.clipInner}>
                          <span className={styles.cta}>{tCatalog('cta')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className={styles.controls}>
              {/* Видимого лічильника немає, але зміну слайда все одно треба
                озвучити: інакше натискання стрілки для читалки нічим не
                відрізняється від натискання в порожнечу. */}
              <span className={styles.srOnly} aria-live="polite">
                {t('counter', { current: index + 1, total: visibleServices.length })}
              </span>

              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label={t('prev')}
                  disabled={index === 0}
                  onClick={() => step(-1)}
                >
                  <LuArrowLeft size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label={t('next')}
                  disabled={index === lastIndex}
                  onClick={() => step(1)}
                >
                  <LuArrowRight size={20} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
