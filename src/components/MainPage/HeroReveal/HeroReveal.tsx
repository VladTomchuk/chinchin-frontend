'use client';

import { useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@chakra-ui/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { c, FOCUS_RING } from '@/components/shared/tokens';
import { CONTACT_EMAIL } from '@/components/HealthyBar/tokens';
import styles from './HeroReveal.module.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Слово-за-словом розкриття тексту на скролі, за мотивами
// dev.bricksfly.com/brano/template/hero-banner: висока обгортка тримає
// секцію пришпиленою, поки opacity кожного слова доходить до 1, а в кінці
// проявляється кнопка контакту.
export default function HeroReveal() {
  const t = useTranslations('About.hero');
  const tHero = useTranslations('HeroSection');
  const tCta = useTranslations('About.cta');

  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(tCta('emailSubject'))}`;

  // Той самий слоган і вступ, що й на сторінці "Про нас" — тут вони просто
  // течуть одним абзацом замість заголовка з окремим лідом.
  const words = useMemo(() => `${t('subtitle')} ${t('intro')}`.split(' '), [t]);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const pin = pinRef.current;
      if (!wrap || !pin) return;

      const wordEls = pin.querySelectorAll(`.${styles.word}`);
      const button = pin.querySelector(`.${styles.button}`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          // 'bottom bottom' тут ненадійний: він рахує позицію низу .wrap
          // відносно висоти всього документа, а вона сама змінюється, поки
          // pin-спейсери інших секцій встановлюються на монтуванні — вихід
          // виходив то нульовим, то вдвічі довшим за очікуване. Пікселева
          // дистанція від .wrap власної висоти (260vh) прибирає цю циклічність.
          end: () => `+=${wrap.offsetHeight - window.innerHeight}`,
          scrub: true,
          pin,
        },
      });

      tl.to(wordEls, { opacity: 1, stagger: 1, ease: 'none' }, 0).to(
        button,
        { opacity: 1, y: 0, duration: 4, ease: 'none' },
        '>-2',
      );
    },
    { scope: wrapRef },
  );

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.pin} ref={pinRef}>
        <div className={styles.inner}>
          <p className={styles.paragraph}>
            {words.map((word, i) => (
              // Індекс як ключ — це чистий текстовий спліт, без переставлянь.
              <span className={styles.word} key={i}>
                {word}{' '}
              </span>
            ))}
          </p>

          <Button
            asChild
            size="lg"
            px={8}
            rounded="full"
            bg={c.accent}
            color={c.accentContrast}
            fontFamily="var(--font-brand-ui)"
            fontWeight="600"
            // GSAP анімує opacity/transform цієї кнопки при скролі й лишає їх
            // інлайном (inline стилі мають вищий пріоритет за CSS-класи), тому
            // hover тут працює через filter — властивість, якої GSAP не чіпає.
            transition="filter 200ms ease"
            className={styles.button}
            _hover={{ filter: 'brightness(0.92)', textDecoration: 'none' }}
            _focusVisible={FOCUS_RING}
          >
            <a href={mailto}>{tHero('contactButton')}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
