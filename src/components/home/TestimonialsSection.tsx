"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useInView } from "@/lib/hooks/useInView";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Adjoua Koffi",
    role: "Cliente — Abidjan, Cocody",
    avatar: "AK",
    avatarBg: "bg-amber-100 text-amber-700",
    rating: 5,
    text: "J'ai trouvé un excellent plombier en moins de 10 minutes. Profil vérifié, intervention rapide et prix correct. Je recommande Soutrali Deals à tous mes amis !",
    pole: "Prestataires",
  },
  {
    id: 2,
    name: "Kouamé Didier",
    role: "Développeur Freelance — Abidjan",
    avatar: "KD",
    avatarBg: "bg-blue-100 text-blue-700",
    rating: 5,
    text: "En tant que freelance, j'ai doublé mon nombre de clients en deux mois grâce à Soutrali. La visibilité est réelle et les demandes de devis arrivent régulièrement.",
    pole: "Freelance",
  },
  {
    id: 3,
    name: "Mariame Touré",
    role: "Vendeuse — E-marché, Treichville",
    avatar: "MT",
    avatarBg: "bg-primary-100 text-primary-700",
    rating: 5,
    text: "J'ai ouvert ma boutique en ligne en quelques clics. Mes produits artisanaux touchent maintenant des clients dans tout Abidjan. C'est une vraie révolution pour mon business !",
    pole: "E-marché",
  },
  {
    id: 4,
    name: "Yves Gnoan",
    role: "Client — Yamoussoukro",
    avatar: "YG",
    avatarBg: "bg-purple-100 text-purple-700",
    rating: 5,
    text: "La géolocalisation m'a permis de trouver un électricien à 2 km de chez moi. Service impeccable, le système d'avis m'a rassuré dès le départ.",
    pole: "Prestataires",
  },
];

const POLE_COLORS: Record<string, string> = {
  Prestataires: "bg-primary-50 text-primary-700 border-primary-100",
  Freelance: "bg-blue-50 text-blue-700 border-blue-100",
  "E-marché": "bg-amber-50 text-amber-700 border-amber-100",
};

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1 });

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section
      ref={ref}
      className="overflow-hidden bg-white py-16 md:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">
            Ils nous font confiance
          </p>
          <h2
            id="testimonials-heading"
            className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl"
          >
            Ce que disent nos utilisateurs
          </h2>
          <p className="mt-3 text-neutral-500">
            Clients, prestataires et vendeurs partagent leur expérience sur Soutrali Deals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          {/* Témoignage principal */}
          <div className="relative mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-3xl border border-neutral-100 bg-neutral-50 p-8 shadow-sm md:p-10"
              >
                {/* Quote icon */}
                <Quote className="mb-6 h-10 w-10 text-primary-200" />

                {/* Text */}
                <blockquote>
                  <p className="text-lg leading-relaxed text-neutral-800 md:text-xl">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${t.avatarBg}`}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900">{t.name}</p>
                    <p className="text-sm text-neutral-500">{t.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${POLE_COLORS[t.pole]}`}
                    >
                      {t.pole}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={prev}
                aria-label="Témoignage précédent"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Témoignage ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-neutral-900"
                        : "w-2 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Témoignage suivant"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Avatars secondaires décoration */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {TESTIMONIALS.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrent(i)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ring-2 ring-offset-2 transition-all ${
                  i === current
                    ? "ring-neutral-900 scale-110"
                    : "ring-transparent opacity-50 hover:opacity-80"
                } ${item.avatarBg}`}
                aria-label={item.name}
              >
                {item.avatar}
              </motion.button>
            ))}
            <span className="text-sm text-neutral-400">et des milliers d&apos;autres…</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
