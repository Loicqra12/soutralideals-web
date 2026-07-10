"use client";
import { useEffect } from "react";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | undefined;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Vérifier périodiquement les mises à jour du service worker (toutes les heures)
        intervalId = setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Détecter si une nouvelle version est disponible et installée
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Une mise à jour a été installée avec succès. Afficher un toast.
              import("sonner").then(({ toast }) => {
                toast.info("Une mise à jour de Soutrali Deals est disponible.", {
                  action: {
                    label: "Actualiser",
                    onClick: () => {
                      window.location.reload();
                    },
                  },
                  duration: 10000,
                });
              });
            }
          });
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[PWA] Erreur lors de l'enregistrement du Service Worker:", error);
        }
      });

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, []);

  return null;
}
