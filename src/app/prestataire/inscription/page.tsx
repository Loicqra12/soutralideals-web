"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  LayoutDashboard,
  MessageSquareText,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrestataireGuard } from "@/lib/hooks/usePrestataireGuard";

const PERKS = [
  {
    icon: UserRoundCheck,
    title: "Profil professionnel",
    description: "Mettez en avant vos services, tarifs et zone d'intervention.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: MessageSquareText,
    title: "Demandes qualifiées",
    description: "Recevez des sollicitations de clients près de chez vous.",
    color: "bg-primary-100 text-primary-700",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard complet",
    description: "Suivez vos missions, messages et statistiques en un coup d'œil.",
    color: "bg-teal-100 text-teal-700",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

export default function PrestataireInscriptionPage() {
  const { ready, isAuthenticated, isLoading } = usePrestataireGuard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-neutral-100" />
            <div className="h-6 w-full animate-pulse rounded-lg bg-neutral-100" />
            <div className="mt-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (!ready) return null;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50/60 via-white to-white" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Contenu principal */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="order-2 lg:order-1"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Espace professionnel
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-5 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            >
              Devenez prestataire sur{" "}
              <span className="bg-gradient-to-r from-primary-700 to-emerald-600 bg-clip-text text-transparent">
                Soutrali Deals
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600"
            >
              Développez votre activité et touchez de nouveaux clients en Côte
              d&apos;Ivoire — plombiers, électriciens, artisans et bien plus.
            </motion.p>

            <motion.ul
              variants={stagger}
              className="mt-8 space-y-3"
            >
              {PERKS.map((perk) => (
                <motion.li
                  key={perk.title}
                  variants={fadeUp}
                  transition={{ duration: 0.4 }}
                  whileHover={{ x: 4 }}
                  className="group flex gap-4 rounded-2xl border border-neutral-100 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${perk.color} transition-transform group-hover:scale-105`}
                  >
                    <perk.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{perk.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                      {perk.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3 text-sm text-neutral-500"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1">
                <BadgeCheck className="h-4 w-4 text-primary-600" />
                Inscription gratuite
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1">
                <BadgeCheck className="h-4 w-4 text-primary-600" />
                Profils vérifiés
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1">
                <BadgeCheck className="h-4 w-4 text-primary-600" />
                Compatible app mobile
              </span>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
              <Card className="mt-8 overflow-hidden border-primary-100/80 shadow-lg shadow-primary-900/5">
                <CardContent className="relative p-6 sm:p-8">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-100/40 blur-2xl" />
                  {isAuthenticated ? (
                    <>
                      <p className="relative text-neutral-600">
                        Votre compte est connecté. Complétez votre inscription
                        prestataire en quelques étapes.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative mt-5"
                      >
                        <Button className="group w-full sm:w-auto" size="lg" asChild>
                          <Link href="/prestataire/registration">
                            Commencer l&apos;inscription
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <p className="relative text-neutral-600">
                        Connectez-vous avec le même compte que sur l&apos;application
                        mobile pour retrouver votre profil.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative mt-5"
                      >
                        <Button className="group w-full sm:w-auto" size="lg" asChild>
                          <Link href="/connexion?redirect=/prestataire/inscription">
                            Se connecter
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </motion.div>
                      <p className="relative mt-4 text-sm text-neutral-500">
                        Pas de compte ?{" "}
                        <Link
                          href="/inscription?redirect=/prestataire/inscription"
                          className="font-medium text-primary-600 underline-offset-4 hover:underline"
                        >
                          S&apos;inscrire gratuitement
                        </Link>
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-200/40 via-emerald-100/30 to-transparent blur-xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white via-primary-50/30 to-emerald-50/40 p-6 shadow-xl shadow-primary-900/10 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                >
                  <Image
                    src="/Devenir/presta.png"
                    alt="Prestataires professionnels — plomberie, ménage, mécanique"
                    width={640}
                    height={480}
                    className="mx-auto w-full object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="mt-6 rounded-2xl border border-primary-100/80 bg-white/90 p-4 backdrop-blur-sm"
                >
                  <p className="text-center text-sm font-medium text-neutral-700">
                    Rejoignez la marketplace qui connecte les pros ivoiriens aux
                    clients de confiance.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
