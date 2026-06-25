import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Taux d'échantillonnage des erreurs (1.0 = 100%)
  tracesSampleRate: 0.2,

  // Désactiver en développement
  enabled: process.env.NODE_ENV === "production",

  // Ignorer les erreurs non critiques
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Network request failed",
    "ChunkLoadError",
    /^Non-Error exception captured/,
  ],

  beforeSend(event) {
    // Ne pas envoyer les erreurs de navigation normale
    if (event.exception?.values?.[0]?.type === "NavigationCancel") {
      return null;
    }
    return event;
  },
});
