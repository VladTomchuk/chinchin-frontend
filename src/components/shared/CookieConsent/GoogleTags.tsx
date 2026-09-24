'use client';

import Script from 'next/script';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gtagEvent } from '@/lib/gtag';
import { useConsent } from './ConsentContext';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
// gtag.js обслуговує GA4 і Google Ads одним підключенням — не важливо, з
// якого саме id вантажити сам скрипт, аби хоч один був заданий.
const TAG_ID = GA_ID || ADS_ID;

/**
 * GA4 + Google Ads — рендериться лише після explicit-згоди в CookieBanner
 * (useConsent): до цього моменту жоден non-essential cookie не вантажиться,
 * як того вимагає GDPR. Без жодного з двох id в env (кампанія ще не
 * налаштована) не рендерить нічого.
 */
export default function GoogleTags() {
  const { status } = useConsent();

  if (status !== 'granted' || !TAG_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}', { send_page_view: false });` : ''}
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
        `}
      </Script>
      {/* useSearchParams вимагає Suspense-межу над собою в App Router. */}
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}

/**
 * App Router не робить full reload між сторінками, тож без ручного
 * page_view на кожну зміну шляху GA4 бачив би лише перший захід на сайт.
 * send_page_view: false вище прибирає автоматичний виклик з gtag('config',
 * ...), щоб перший рендер не задвоївся з цим ефектом.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const query = searchParams.toString();
    gtagEvent('page_view', { page_path: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);

  return null;
}
