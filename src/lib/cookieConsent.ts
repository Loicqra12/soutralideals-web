export const COOKIE_CONSENT_STORAGE_KEY = "sd-cookie-consent-v1";
export const COOKIE_CONSENT_EVENT = "sd-cookie-consent-updated";
export const COOKIE_BANNER_OPEN_EVENT = "sd-cookie-banner-open";

export function requestCookieSettingsOpen(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_BANNER_OPEN_EVENT));
}

export type CookieConsentPreferences = {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export type StoredCookieConsent = {
  version: 1;
  status: "pending" | "set";
  preferences: CookieConsentPreferences;
};

export function dispatchConsentUpdate(detail: StoredCookieConsent) {
  window.dispatchEvent(
    new CustomEvent<StoredCookieConsent>(COOKIE_CONSENT_EVENT, { detail }),
  );
}

export function readStoredConsent(): StoredCookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCookieConsent;
    if (parsed?.version !== 1 || parsed?.status !== "set") return null;
    if (!parsed.preferences || parsed.preferences.essential !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(
  preferences: Omit<CookieConsentPreferences, "essential" | "updatedAt">,
) {
  const payload: StoredCookieConsent = {
    version: 1,
    status: "set",
    preferences: {
      essential: true,
      functional: preferences.functional,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      updatedAt: new Date().toISOString(),
    },
  };
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(payload));
  dispatchConsentUpdate(payload);
  return payload;
}

export function hasConsentBeenSet(): boolean {
  return readStoredConsent() !== null;
}
