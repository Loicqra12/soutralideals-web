"use client";

import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirebaseConfig } from "./config";

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

async function getOrCreateApp(): Promise<FirebaseApp | null> {
  const config = getFirebaseConfig();
  if (!config) return null;

  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  app = initializeApp(config);
  return app;
}

/** Initialise GA4 (Firebase Analytics) côté navigateur uniquement. */
export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) return null;

      const firebaseApp = await getOrCreateApp();
      if (!firebaseApp) return null;

      analytics = getAnalytics(firebaseApp);
      return analytics;
    } catch {
      return null;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export function getFirebaseAnalytics(): Analytics | null {
  return analytics;
}
