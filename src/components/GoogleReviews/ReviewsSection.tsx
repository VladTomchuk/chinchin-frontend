import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import GoogleReviews from './GoogleReviews';
import GoogleReviewsSkeleton from './GoogleReviewsSkeleton';

/**
 * Точка підключення блоку відгуків на сторінку. Раніше стояла в
 * [locale]/layout.tsx і рендерилась на всіх ~34 сторінках — саме це й тримало
 * весь сайт на ISR (Route Cache перегенеровувався за вікном відгуків, 24 год,
 * а не лишався статикою назавжди).
 *
 * Тепер підключена вручну на кожній сторінці, де вона доречна: головна,
 * "Про нас", контакти, індекси й шаблонні сторінки /services і /events.
 * Це свідомо повертає ті сторінки на ISR (Route Cache перегенеровується
 * за вікном REVIEWS_REVALIDATE_SECONDS, 24 год) заради соціального доказу
 * на кожній сторінці — той самий компроміс, що раніше йшов через layout,
 * тільки явний і per-page, а не прихований в одному спільному файлі.
 *
 * Обгортка (а не голий <GoogleReviews /> на кожній сторінці) лишає Suspense й
 * скелетон в одному місці: підключення на новій сторінці — один рядок, а не
 * копія розмітки заглушки.
 */
export default async function ReviewsSection() {
  const t = await getTranslations('Reviews');

  return (
    <Suspense fallback={<GoogleReviewsSkeleton label={t('loading')} />}>
      <GoogleReviews />
    </Suspense>
  );
}
