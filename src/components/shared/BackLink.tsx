import { LuArrowLeft } from 'react-icons/lu';
import { Link } from '@/i18n/navigation';
import SoonBadge from './SoonBadge';
import styles from './BackLink.module.css';

type Props = {
  /**
   * Куди веде. Значення мусить бути оголошене в pathnames (i18n/routing.ts) —
   * типізований Link із next-intl інших не приймає. Він же підставляє поточну
   * локаль, тож з української сторінки перехід лишається українським.
   */
  href: '/services' | '/events' | '/';
  /** Назва сторінки, на яку повертаємось. Береться з перекладів, не з href. */
  label: string;
  /** onPhoto — коли посилання лежить поверх затемненого фото. */
  tone?: 'onPhoto' | 'onPage';
  /**
   * true — ціль тимчасово прибрана з показу (ABOUT_HIDDEN /
   * SERVICES_CATALOG_HIDDEN у config/navigation.ts): замість Link — span без
   * переходу, з позначкою "Soon" (soonLabel) поруч. Той самий принцип, що
   * isSoon-картки в CatalogGrid.tsx.
   */
  disabled?: boolean;
  /** Текст позначки "Soon" — обовʼязковий, коли disabled. Catalog.soon у
   * виклику. */
  soonLabel?: string;
};

/**
 * Повернення на батьківську сторінку каталогу: стрілка вліво плюс назва
 * сторінки.
 *
 * Це посилання, а не history.back(). Кнопка «назад» у браузері не знає, як
 * називається попередня сторінка, тож підписати її було б нічим; до того ж вона
 * нічого не робить у того, хто зайшов на сторінку прямо з пошуку — а це для
 * сторінки послуги основний сценарій. Посилання ж працює завжди, показує
 * конкретну назву й додає перелінковку вгору по структурі сайту.
 */
export default function BackLink({ href, label, tone = 'onPage', disabled = false, soonLabel }: Props) {
  const content = (
    <>
      <span className={styles.arrow} aria-hidden>
        <LuArrowLeft size={14} />
      </span>
      {label}
    </>
  );

  if (disabled) {
    return (
      <span className={`${styles.link} ${styles[tone]} ${styles.disabled}`} aria-disabled="true">
        {content}
        {soonLabel && <SoonBadge label={soonLabel} />}
      </span>
    );
  }

  return (
    <Link href={href} className={`${styles.link} ${styles[tone]}`}>
      {content}
    </Link>
  );
}
