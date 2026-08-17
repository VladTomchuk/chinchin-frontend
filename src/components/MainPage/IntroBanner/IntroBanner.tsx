import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './IntroBanner.module.css';

// Перша секція головної: повноекранне фото бар-сервісу перед хіро-галереєю.
// Навбар ховається, поки триває зум HeroBentoGallery (див. HeroSection/heroZoom.ts) —
// та логіка зав'язана лише на стан галереї, тому ця секція просто подовжує
// той самий безнавбарний вступ, а не ламає його.
export default async function IntroBanner() {
  const t = await getTranslations('HeroSection');

  return (
    <div className={styles.wrap}>
      <Image
        src="/events/bar-service-02.jpg"
        alt={t('introAlt')}
        fill
        priority
        sizes="100vw"
      />
    </div>
  );
}
