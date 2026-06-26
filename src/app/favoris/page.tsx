"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Briefcase, User, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/useFavorites";
import type { FavoriteType } from "@/lib/api/favorites";
import { Button } from "@/components/ui/button";
import { AnimatedGrid } from "@/components/shared/AnimatedGrid";
import { formatPriceFCFA } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const TYPE_FILTERS: {
  value: FavoriteType | "";
  label: string;
  icon: typeof Heart;
}[] = [
  { value: "", label: "Tous", icon: Heart },
  { value: "PRESTATAIRE", label: "Prestataires", icon: User },
  { value: "FREELANCE", label: "Freelances", icon: Briefcase },
  { value: "ARTICLE", label: "Produits", icon: ShoppingBag },
];

const TYPE_HREF: Record<FavoriteType, (id: string) => string> = {
  PRESTATAIRE: (id) => `/prestataires/${id}`,
  FREELANCE: (id) => `/freelance/${id}`,
  ARTICLE: (id) => `/emarche/${id}`,
  VENDEUR: (id) => `/emarche`,
};

const TYPE_LABELS: Record<FavoriteType, string> = {
  PRESTATAIRE: "Prestataire",
  FREELANCE: "Freelance",
  ARTICLE: "Produit",
  VENDEUR: "Vendeur",
};

export default function FavorisPage() {
  const [typeFilter, setTypeFilter] = useState<FavoriteType | "">("");
  const { data: allFavorites, isLoading: loadingAll } = useFavorites();
  const { data: filteredFavorites, isLoading: loadingFiltered } = useFavorites(
    typeFilter || undefined,
  );
  const { mutate: toggle } = useToggleFavorite();

  const counts = useMemo(() => {
    const list = allFavorites ?? [];
    return {
      total: list.length,
      PRESTATAIRE: list.filter((f) => f.objetType === "PRESTATAIRE").length,
      FREELANCE: list.filter((f) => f.objetType === "FREELANCE").length,
      ARTICLE: list.filter((f) => f.objetType === "ARTICLE").length,
      VENDEUR: list.filter((f) => f.objetType === "VENDEUR").length,
    };
  }, [allFavorites]);

  const list = typeFilter ? (filteredFavorites ?? []) : (allFavorites ?? []);
  const isLoading = typeFilter ? loadingFiltered : loadingAll;

  const getCount = (value: FavoriteType | "") => {
    if (!value) return counts.total;
    return counts[value] ?? 0;
  };

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
          {counts.total} favori{counts.total > 1 ? "s" : ""} sauvegardé{counts.total > 1 ? "s" : ""}
        </p>

        {/* Summary counters */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TYPE_FILTERS.filter((f) => f.value !== "").map((f) => {
            const Icon = f.icon;
            const count = getCount(f.value);
            return (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  typeFilter === f.value
                    ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    typeFilter === f.value ? "text-white" : "text-neutral-400",
                  )}
                />
                <p className="mt-2 text-2xl font-bold">{count}</p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    typeFilter === f.value ? "text-white/70" : "text-neutral-500",
                  )}
                >
                  {f.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Tab filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => {
            const count = getCount(f.value);
            return (
              <button
                key={f.value || "all"}
                onClick={() => setTypeFilter(f.value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  typeFilter === f.value
                    ? "bg-neutral-900 text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    typeFilter === f.value
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
                {typeFilter ? ` dans cette catégorie` : ""}
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
                            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-primary-600">
                              {TYPE_LABELS[fav.objetType] ?? fav.objetType}
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
