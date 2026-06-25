"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FooterGoogleReviews } from "./FooterGoogleReviews";
import { FooterLangCurrency } from "./FooterLangCurrency";
import { SOCIAL_ICONS } from "./FooterSocialIcons";
import { cn } from "@/lib/utils";
import { requestCookieSettingsOpen } from "@/lib/cookieConsent";
import { useAuthStore } from "@/stores";
import {
  PRO_INSCRIPTION_OPTIONS,
  resolveProHref,
} from "@/lib/utils/proCta";

const MARKETING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL?.trim() || "https://www.soutralideals.com";

const columnTitle =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400/70";

const iconBtnClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition hover:border-blue-400/40 hover:text-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/p/SoutraliDeals-61556925353967/",
    icon: "Facebook" as const,
    label: "Facebook",
    hover: "hover:border-blue-400/40 hover:text-blue-400",
  },
  {
    href: "https://x.com/SoutraliDeals",
    icon: "Twitter" as const,
    label: "X (Twitter)",
    hover: "hover:border-white/30 hover:text-white",
  },
  {
    href: "https://www.instagram.com/soutrali_deals/",
    icon: "Instagram" as const,
    label: "Instagram",
    hover: "hover:border-amber-400/50 hover:text-amber-400",
  },
  {
    href: "https://ci.linkedin.com/company/soutrali-deals",
    icon: "Linkedin" as const,
    label: "LinkedIn",
    hover: "hover:border-blue-400/50 hover:text-blue-400",
  },
];

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "transition hover:text-white";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const hasRole = useAuthStore((s) => s.hasRole);

  const onNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/backend/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true); // Même en cas d'erreur réseau, on confirme
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#040814] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-80 w-80 rounded-full bg-primary-500/10 blur-[100px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 lg:px-8 lg:pt-20">
        <div className="mb-16 grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Marque */}
          <div className="space-y-6 lg:col-span-4">
            <Link href="/" className="group flex w-fit items-center gap-4">
              <div className="relative h-16 w-[200px] shrink-0 sm:h-[4.5rem] sm:w-[220px]">
                <Image
                  src="/brand/logo.png"
                  alt="Soutrali Deals"
                  fill
                  sizes="220px"
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.03]"
                  priority
                />
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              La marketplace ivoirienne pour trouver des artisans, freelances et
              produits locaux — tout au même endroit en Côte d&apos;Ivoire.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map(({ href, icon, label, hover }) => {
                const Icon = SOCIAL_ICONS[icon];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(iconBtnClass, hover)}
                    aria-label={`${label} (nouvel onglet)`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <FooterGoogleReviews />
          </div>

          {/* Liens */}
          <div className="lg:col-span-5">
            <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <h4 className={cn(columnTitle, "mb-5")}>Marketplace</h4>
                <ul className="space-y-3 text-sm text-white/55">
                  <li>
                    <FooterLink href="/prestataires">Prestataires & métiers</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/freelance">Freelance & missions</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/emarche">E-marché local</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/recherche">Recherche globale</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/prestataires" >
                      <span className="font-medium text-primary-400">
                        Explorer les catégories
                      </span>
                    </FooterLink>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={cn(columnTitle, "mb-5")}>Pour les pros</h4>
                <ul className="space-y-3 text-sm text-white/55">
                  {PRO_INSCRIPTION_OPTIONS.map((option) => {
                    const { href, label } = resolveProHref(option, hasRole);
                    return (
                      <li key={option.role}>
                        <FooterLink href={href}>{label}</FooterLink>
                      </li>
                    );
                  })}
                  {hasRole("PRESTATAIRE") && (
                    <li>
                      <FooterLink href="/prestataire/dashboard">
                        Mon espace prestataire
                      </FooterLink>
                    </li>
                  )}
                  {hasRole("FREELANCE") && (
                    <li>
                      <FooterLink href="/freelance/espace">
                        Mon espace freelance
                      </FooterLink>
                    </li>
                  )}
                  {hasRole("VENDEUR") && (
                    <li>
                      <FooterLink href="/emarche/espace">Ma boutique</FooterLink>
                    </li>
                  )}
                  <li>
                    <FooterLink href="/connexion">Connexion</FooterLink>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className={cn(columnTitle, "mb-5")}>Informations</h4>
                <ul className="space-y-3 text-sm text-white/55">
                  <li>
                    <FooterLink href="/apropos">À propos</FooterLink>
                  </li>
                  <li>
                    <FooterLink href={`${MARKETING_URL}/contact`} external>
                      Contact
                    </FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/informations-legales">
                      Informations légales
                    </FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/cgu">CGU</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/cgv">CGV</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/confidentialite">Confidentialité</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/cookies">Cookies</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/accessibilite">Accessibilité</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/plan-du-site">Plan du site</FooterLink>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={requestCookieSettingsOpen}
                      className="transition hover:text-white"
                    >
                      Gérer les cookies
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 via-[#0b1020] to-[#0a0f1c] p-6 shadow-xl shadow-black/20">
              <h4 className="mb-1 text-lg font-bold text-white">Restez informés</h4>
              <p className="mb-5 text-sm leading-relaxed text-white/50">
                Actualités marketplace, nouveaux prestataires et offres — une fois
                par mois, pas de spam.
              </p>
              <form className="space-y-3" onSubmit={onNewsletter} noValidate>
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Adresse e-mail pour la newsletter
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="votre@email.com"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/40"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading || submitted}
                  className="w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-white/90 disabled:opacity-60"
                >
                  {newsletterLoading ? "Inscription…" : submitted ? "✓ Inscrit !" : "S'abonner"}
                </button>
                <p className="text-[11px] text-white/40">
                  Désinscription possible à tout moment.
                </p>
                {submitted && (
                  <p className="text-sm font-medium text-emerald-400" role="status">
                    🎉 Merci ! Vérifiez votre boîte mail.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Logo géant */}
        <div className="relative mb-10 select-none overflow-hidden border-y border-white/15 py-10 md:py-12">
          <p
            className="pointer-events-none text-center text-[clamp(3.5rem,16vw,11rem)] font-extrabold leading-[0.9] tracking-tighter bg-gradient-to-r from-primary-400/80 via-blue-400/90 to-blue-500/80 bg-clip-text text-transparent drop-shadow-[0_0_48px_rgba(59,130,246,0.3)]"
            aria-hidden
          >
            soutralideals
          </p>
        </div>

        {/* Barre basse */}
        <div className="flex flex-col items-stretch gap-6 text-xs text-white/40 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center lg:text-left">
            © {new Date().getFullYear()} Soutrali Deals. Tous droits réservés.
          </p>
          <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-end lg:gap-8">
            <FooterLangCurrency />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 sm:border-t-0 sm:pt-0 lg:border-l lg:border-t-0 lg:pl-8">
              <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
              <FooterLink href="/cgu">CGU</FooterLink>
              <FooterLink href="/cgv">CGV</FooterLink>
              <FooterLink href="/confidentialite">Confidentialité</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
