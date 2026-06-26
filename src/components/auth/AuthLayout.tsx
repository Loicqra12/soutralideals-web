"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const AUTH_CONFIG = {
  connexion: {
    image: "/connect/connexion.png",
    imageAlt: "Connexion à Soutrali Deals",
    headline: "Bienvenue sur Soutrali Deals",
    subline:
      "Retrouvez vos prestataires favoris, suivez vos commandes et échangez en direct avec les pros.",
    perks: [
      "Accès à vos favoris et messages",
      "Suivi de commandes en temps réel",
      "Espace pro prestataire & freelance",
    ],
    gradient: "from-primary-800 via-primary-700 to-emerald-800",
  },
  inscription: {
    image: "/connect/inscription.png",
    imageAlt: "Inscription sur Soutrali Deals",
    headline: "Rejoignez la marketplace ivoirienne",
    subline:
      "Trouvez un plombier, un développeur ou un produit local — tout en un seul endroit.",
    perks: [
      "Inscription gratuite en 2 minutes",
      "Prestataires vérifiés près de chez vous",
      "Paiement et livraison sécurisés",
    ],
    gradient: "from-emerald-800 via-primary-700 to-primary-900",
  },
} as const;

export function AuthLayout({
  variant,
  title,
  subtitle,
  children,
}: {
  variant: keyof typeof AUTH_CONFIG;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const config = AUTH_CONFIG[variant];

  return (
    <div className="min-h-[calc(100dvh-0px)] lg:min-h-screen">
      <div className="grid min-h-[inherit] lg:grid-cols-2">
        {/* Bandeau illustration mobile (en haut) */}
        <div
          className={`relative order-1 overflow-hidden bg-gradient-to-r ${config.gradient} lg:order-2 lg:hidden`}
        >
          <div className="flex items-center gap-4 px-4 py-5">
            <Image
              src={config.image}
              alt={config.imageAlt}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 object-contain"
              priority
            />
            <div>
              <p className="text-sm font-bold text-white">{config.headline}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-white/70">{config.subline}</p>
            </div>
          </div>
        </div>

        {/* Formulaire — gauche */}
        <div className="order-2 flex flex-col bg-white px-4 py-8 sm:px-8 lg:order-1 lg:px-12 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto w-full max-w-md flex-1 flex flex-col justify-center"
          >
            <Link href="/" className="mb-10 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  scale: { type: "spring", stiffness: 260, damping: 18 },
                  y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                }}
                whileHover={{ scale: 1.06, rotate: 2 }}
                whileTap={{ scale: 0.96 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary-500/25 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <Image
                  src="/brand/logo.png"
                  alt="Soutrali Deals"
                  width={150}
                  height={150}
                  className="relative h-[150px] w-[150px] rounded-2xl drop-shadow-md"
                  priority
                />
              </motion.div>
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-neutral-500">{subtitle}</p>
              )}
            </div>

            {children}
          </motion.div>

          <p className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-400">
            En continuant, vous acceptez nos{" "}
            <Link href="/cgu" className="underline hover:text-neutral-600">
              CGU
            </Link>{" "}
            et notre{" "}
            <Link href="/confidentialite" className="underline hover:text-neutral-600">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>

        {/* Illustration — droite (desktop) */}
        <div
          className={`relative order-3 hidden overflow-hidden bg-gradient-to-br ${config.gradient} lg:order-2 lg:flex lg:flex-col`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Côte d&apos;Ivoire
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight text-white xl:text-4xl">
              {config.headline}
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/75">
              {config.subline}
            </p>

            <ul className="mt-8 space-y-3">
              {config.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-white/85">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 flex items-end justify-center px-8 pb-0 pt-4"
          >
            <Image
              src={config.image}
              alt={config.imageAlt}
              width={520}
              height={520}
              className="max-h-[52vh] w-auto object-contain object-bottom drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
