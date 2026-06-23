"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/useFavorites";
import type { FavoriteType } from "@/lib/api/favorites";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/animations";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";
import { formatPriceFCFA } from "@/lib/utils/format";

const TYPE_FILTERS: { value: FavoriteType | ""; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "PRESTATAIRE", label: "Prestataires" },
  { value: "FREELANCE", label: "Freelances" },
  { value: "ARTICLE", label: "Produits" },
];

const TYPE_HREF: Record<FavoriteType, (id: string) => string> = {
  PRESTATAIRE: (id) => `/prestataires/${id}`,
  FREELANCE: (id) => `/freelance/${id}`,
  ARTICLE: (id) => `/emarche/${id}`,
  VENDEUR: (id) => `/emarche`,
};

export default function FavorisPage() {
  const [typeFilter, setTypeFilter] = useState<FavoriteType | "">("");
  const { data: favorites, isLoading } = useFavorites(typeFilter || undefined);
  const { mutate: toggle } = useToggleFavorite();

  const list = favorites ?? [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Accueil
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-neutral-900">Mes favoris</h1>
        <p className="mt-1 text-neutral-500">
          {list.length} favori{list.length > 1 ? "s" : ""}
        </p>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200" />
              ))}
            </div>
          )}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
              <Heart className="h-14 w-14 text-neutral-200" />
              <p className="mt-4 text-lg font-semibold text-neutral-900">
                Aucun favori
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Cliquez sur ♡ sur une carte pour sauvegarder.
              </p>
            </div>
          )}

          {!isLoading && list.length > 0 && (
            <AnimatedGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {list.map((fav) => {
                  const href = TYPE_HREF[fav.objetType]?.(fav.objetId) ?? "/";
                  return (
                    <motion.div
                      key={fav._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Link href={href} className="block p-4">
                        <div className="flex items-start gap-3">
                          {fav.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={fav.image}
                              alt=""
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-2xl font-bold text-neutral-300">
                              {fav.titre.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-neutral-900">
                              {fav.titre}
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                              {fav.objetType.toLowerCase()}
                            </p>
                            {fav.prix != null && fav.prix > 0 && (
                              <p className="mt-1 text-sm font-bold text-primary-600">
                                {formatPriceFCFA(fav.prix)}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>

                      <button
                        onClick={() =>
                          toggle({
                            objetType: fav.objetType,
                            objetId: fav.objetId,
                            titre: fav.titre,
                          })
                        }
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:text-red-600"
                        aria-label="Retirer des favoris"
                      >
                        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </AnimatedGrid>
          )}
        </div>
      </div>
    </div>
  );
}
