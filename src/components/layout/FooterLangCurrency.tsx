"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type SiteLang = "fr" | "en";
type SiteCurrency = "XOF" | "EUR";

const LANG_KEY = "soutrali-site-lang";
const CURRENCY_KEY = "soutrali-site-currency";

const selectCls =
  "h-10 w-[min(100%,13.5rem)] cursor-pointer appearance-none rounded-full border border-white/12 bg-white/[0.06] py-2 pl-10 pr-9 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 outline-none transition hover:border-blue-400/40 hover:bg-white/[0.09] focus-visible:border-primary-400/45 focus-visible:ring-2 focus-visible:ring-blue-400/35";

export function FooterLangCurrency() {
  const [lang, setLang] = useState<SiteLang>("fr");
  const [currency, setCurrency] = useState<SiteCurrency>("XOF");

  useEffect(() => {
    const storedLang = localStorage.getItem(LANG_KEY);
    const storedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (storedLang === "en" || storedLang === "fr") setLang(storedLang);
    if (storedCurrency === "EUR" || storedCurrency === "XOF") {
      setCurrency(storedCurrency);
    }
  }, []);

  const onLangChange = (value: SiteLang) => {
    setLang(value);
    localStorage.setItem(LANG_KEY, value);
  };

  const onCurrencyChange = (value: SiteCurrency) => {
    setCurrency(value);
    localStorage.setItem(CURRENCY_KEY, value);
  };

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 sm:justify-end"
      role="group"
      aria-label="Préférences régionales"
    >
      <div className="relative inline-flex shrink-0">
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 z-[1] -translate-y-1/2 text-sm"
          aria-hidden
        >
          {lang === "fr" ? "🇫🇷" : "🇬🇧"}
        </span>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 z-[1] h-3.5 w-3.5 -translate-y-1/2 text-white/45"
          aria-hidden
        />
        <label htmlFor="footer-site-lang" className="sr-only">
          Langue du site
        </label>
        <select
          id="footer-site-lang"
          className={selectCls}
          value={lang}
          onChange={(e) => onLangChange(e.target.value === "en" ? "en" : "fr")}
        >
          <option value="fr">FR — Français</option>
          <option value="en">EN — English</option>
        </select>
      </div>

      <div className="relative inline-flex shrink-0">
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 z-[1] -translate-y-1/2 font-bold text-[10px] text-amber-400"
          aria-hidden
        >
          {currency === "EUR" ? "€" : "CFA"}
        </span>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 z-[1] h-3.5 w-3.5 -translate-y-1/2 text-white/45"
          aria-hidden
        />
        <label htmlFor="footer-site-currency" className="sr-only">
          Devise d&apos;affichage
        </label>
        <select
          id="footer-site-currency"
          className={selectCls}
          value={currency}
          onChange={(e) =>
            onCurrencyChange(e.target.value === "EUR" ? "EUR" : "XOF")
          }
        >
          <option value="XOF">XOF — CFA</option>
          <option value="EUR">EUR — Euro</option>
        </select>
      </div>
    </div>
  );
}
