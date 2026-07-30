"use client";

import { useEffect } from "react";
import {
  COOKIE_CONSENT_EVENT,
  readStoredConsent,
  type StoredCookieConsent,
} from "@/lib/cookieConsent";
import { initFirebaseAnalytics } from "@/lib/firebase/analytics";
import { isFirebaseConfigured } from "@/lib/firebase/config";

function syncAnalyticsFromConsent(allowAnalytics: boolean) {
  if (!allowAnalytics || !isFirebaseConfigured()) return;
  void initFirebaseAnalytics();
}

export function FirebaseAnalyticsProvider() {
  useEffect(() => {
    const stored = readStoredConsent();
    if (stored?.preferences.analytics) {
      syncAnalyticsFromConsent(true);
    }

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<StoredCookieConsent>).detail;
      syncAnalyticsFromConsent(Boolean(detail?.preferences.analytics));
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return null;
}
