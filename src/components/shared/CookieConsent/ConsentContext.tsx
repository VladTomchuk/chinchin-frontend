'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type ConsentStatus = 'unset' | 'granted' | 'denied';

const STORAGE_KEY = 'chinchin-analytics-consent';

type ConsentContextValue = {
  status: ConsentStatus;
  grant: () => void;
  deny: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/**
 * Єдине джерело правди про згоду на аналітичні cookies (Google Analytics,
 * Google Ads) для всього сайту: CookieBanner читає/пише через неї, GoogleTags
 * рендерить скрипти лише коли status === 'granted'. Стан стартує з 'unset' і
 * на сервері, і до гідратації — банер зʼявляється тільки після того, як
 * useEffect прочитає localStorage, інакше він блимнув би для відвідувачів,
 * які вже відповіли раніше.
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>('unset');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'granted' || stored === 'denied') setStatus(stored);
    } catch {
      // Приватний режим / заблоковане сховище — банер просто питатиме щоразу.
    }
  }, []);

  function persist(next: ConsentStatus) {
    setStatus(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Вибір не запамʼятається між сесіями, але на цю сесію все одно застосується.
    }
  }

  return (
    <ConsentContext.Provider
      value={{ status, grant: () => persist('granted'), deny: () => persist('denied') }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
