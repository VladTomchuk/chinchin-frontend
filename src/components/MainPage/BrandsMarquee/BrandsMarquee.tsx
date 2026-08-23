import Image from 'next/image';
import { Box } from '@chakra-ui/react';
import { Section } from '@/components/shared/primitives';
import { BRANDS } from './brands';
import styles from './BrandsMarquee.module.css';

// Скільки разів повторити набір усередині однієї половини доріжки. Шість лого
// займають ~1400px; на широкому моніторі одна половина мусить перекривати весь
// екран, інакше в момент стику видно порожнечу. Два повтори дають ~2800px —
// вистачає до ultrawide.
const REPEAT = 2;

const HALF = Array.from({ length: REPEAT }, () => BRANDS).flat();

export default async function BrandsMarquee() {
  return (
    <Section>
      {/* Стрічка йде від краю до краю, а не по контентній сітці: інакше лого
          зникали б на невидимій межі всередині сторінки. Вирватися з
          max-width-контейнера дозволяє класичний прийом `50% - 50vw`; за
          горизонтальний скрол можна не хвилюватись — globals.css тримає на
          body `overflow-x: clip`. */}
      <Box w="100vw" ml="calc(50% - 50vw)">
        <div
          className={styles.viewport}
          style={
            {
              '--logo-height': 'clamp(1.75rem, 3.5vw, 2.75rem)',
            } as React.CSSProperties
          }
        >
          <div className={styles.track} style={{ animationDuration: '48s' }}>
            {/* Дві половини — обов'язкова умова безшовного циклу (див. -50% у
                CSS). Друга схована від скрінрідерів: це візуальний дубль, а не
                ще шість клієнтів. */}
            {[0, 1].map((half) =>
              HALF.map((brand, i) => (
                <div
                  className={styles.item}
                  key={`${half}-${brand.name}-${i}`}
                  // --logo-mask/--logo-aspect живлять кольоровий силует на
                  // ховері (::after у BrandsMarquee.module.css): та сама PNG
                  // як CSS-маска, залита суцільним фірмовим кольором теми.
                  // --logo-scale тепер тут (а не на <Image>), бо й .logo,
                  // й ::after мають від нього однаково залежати.
                  style={
                    {
                      '--logo-scale': brand.scale ?? 1,
                      '--logo-mask': `url(${brand.src})`,
                      '--logo-aspect': `${brand.width} / ${brand.height}`,
                    } as React.CSSProperties
                  }
                >
                  <Image
                    className={styles.logo}
                    src={brand.src}
                    width={brand.width}
                    height={brand.height}
                    // Без підказки Next бере ширину з пропа `width` і, множачи
                    // на DPR, генерує варіант на 1200px — тобто розтягує
                    // 552-піксельний вихідний файл. Показуємо ж не більше
                    // ~190px, тож просимо ~200: оптимізатор обирає 384px, чого
                    // з запасом вистачає і на retina.
                    sizes="200px"
                    alt={half === 0 ? brand.name : ''}
                    aria-hidden={half === 1 || undefined}
                  />
                </div>
              )),
            )}
          </div>
        </div>
      </Box>
    </Section>
  );
}
