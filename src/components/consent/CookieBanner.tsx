"use client";

import Link from "next/link";
import { Cookie, Settings2 } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  COOKIE_BANNER_OPEN_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  hasConsentBeenSet,
  readStoredConsent,
  writeConsent,
  type CookieConsentPreferences,
} from "@/lib/cookieConsent";

const defaultOptional = (): Pick<
  CookieConsentPreferences,
  "functional" | "analytics" | "marketing"
> => ({
  functional: false,
  analytics: false,
  marketing: false,
});

export function CookieBanner() {
  const panelId = useId();
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState(defaultOptional);

  useEffect(() => {
    setVisible(!hasConsentBeenSet());
  }, []);

  const closeAll = useCallback(() => {
    setSettingsOpen(false);
    setVisible(false);
  }, []);

  const applyRefuse = useCallback(() => {
    writeConsent(defaultOptional());
    setPrefs(defaultOptional());
    closeAll();
  }, [closeAll]);

  const applyAcceptAll = useCallback(() => {
    writeConsent({ functional: true, analytics: true, marketing: true });
    setPrefs({ functional: true, analytics: true, marketing: true });
    closeAll();
  }, [closeAll]);

  const applyCustom = useCallback(() => {
    writeConsent(prefs);
    closeAll();
  }, [closeAll, prefs]);

  const hydrateFromStorage = useCallback(() => {
    const stored = readStoredConsent();
    if (stored) {
      setPrefs({
        functional: stored.preferences.functional,
        analytics: stored.preferences.analytics,
        marketing: stored.preferences.marketing,
      });
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_STORAGE_KEY) {
        setVisible(!hasConsentBeenSet());
        hydrateFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrateFromStorage]);

  useEffect(() => {
    const onOpen = () => {
      hydrateFromStorage();
      setVisible(true);
      setSettingsOpen(true);
    };
    window.addEventListener(COOKIE_BANNER_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(COOKIE_BANNER_OPEN_EVENT, onOpen);
  }, [hydrateFromStorage]);

  if (!visible) return null;

  const categories: {
    key: keyof Pick<
      CookieConsentPreferences,
      "functional" | "analytics" | "marketing"
    >;
    label: string;
    description: string;
  }[] = [
    {
      key: "functional",
      label: "Fonctionnalité",
      description: "Mémorisation de vos choix et confort de navigation.",
    },
    {
      key: "analytics",
      label: "Mesure d'audience",
      description: "Statistiques anonymisées pour améliorer le site.",
    },
    {
      key: "marketing",
      label: "Marketing",
      description: "Contenus et offres plus pertinents.",
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-6 pt-10">
      <div
        className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-labelledby="cookie-banner-title"
      >
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900" />
          <div className="flex-1">
            <h2 id="cookie-banner-title" className="font-semibold text-neutral-900">
              Respect de votre vie privée
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Nous utilisons des cookies essentiels et, avec votre accord, des
              cookies optionnels.{" "}
              <Link href="/cookies" className="font-medium text-neutral-900 underline">
                Politique de cookies
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyRefuse}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-expanded={settingsOpen}
            aria-controls={panelId}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            <Settings2 className="h-4 w-4" />
            Paramétrer
          </button>
          <button
            type="button"
            onClick={applyAcceptAll}
            className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Accepter tout
          </button>
        </div>

        {settingsOpen && (
          <div id={panelId} className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
            {categories.map(({ key, label, description }) => (
              <label
                key={key}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-neutral-100 p-3"
              >
                <span>
                  <span className="text-sm font-medium text-neutral-900">{label}</span>
                  <span className="mt-0.5 block text-xs text-neutral-500">
                    {description}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() =>
                    setPrefs((p) => ({ ...p, [key]: !p[key] }))
                  }
                  className="mt-1"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={applyCustom}
              className="w-full rounded-lg border border-neutral-900 bg-neutral-900 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Enregistrer mes choix
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
