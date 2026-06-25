"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[SW] Enregistré", reg.scope))
        .catch((err) => console.error("[SW] Erreur", err));
    }
  }, []);

  return null;
}
