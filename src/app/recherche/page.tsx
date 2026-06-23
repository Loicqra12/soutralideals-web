"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "@/lib/api/search";
import { MapPin, Search, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";
import { SmartSearchBar } from "@/components/shared/SmartSearchBar";
import { formatPriceFCFA } from "@/lib/utils/format";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

const TABS = [
  { key: "prestataires", label: "Prestataires" },
  { key: "freelances", label: "Freelances" },
  { key: "articles", label: "Produits" },
  { key: "vendeurs", label: "Boutiques" },
  { key: "services", label: "Services" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getItemName(item: Record<string, unknown>): string {
  return String(
    item.nom ?? item.nomArticle ?? item.name ?? item.shopName ?? item.nomservice ?? "Résultat",
  );
}

function getItemSubtitle(item: Record<string, unknown>): string | undefined {
  const parts: string[] = [];
  if (item.job) parts.push(String(item.job));
  if (item.ville ?? item.location) parts.push(String(item.ville ?? item.location));
  if (item.specialite && Array.isArray(item.specialite)) {
    parts.push(item.specialite.slice(0, 2).join(", "));
  }
  if (item.shopDescription) parts.push(String(item.shopDescription).slice(0, 60));
  return parts.join(" · ") || undefined;
}

function getItemPrice(item: Record<string, unknown>): number | undefined {
  const p =
    item.prixArticle ?? item.hourlyRate ?? item.tarif ?? item.prixprestataire;
  return typeof p === "number" ? p : undefined;
}

function getItemHref(tab: TabKey, item: Record<string, unknown>): string {
  const id = String(item._id ?? "");
  if (tab === "prestataires") return `/prestataires/${id}`;
  if (tab === "freelances") return `/freelance/${id}`;
  if (tab === "articles") return `/emarche/${id}`;
  if (tab === "vendeurs") return `/emarche`;
  return `/prestataires?q=${encodeURIComponent(getItemName(item))}`;
}

function ResultCard({ tab, item }: { tab: TabKey; item: Record<string, unknown> }) {
  const name = getItemName(item);
  const subtitle = getItemSubtitle(item);
  const price = getItemPrice(item);
  const href = getItemHref(tab, item);
  const id = String(item._id ?? "");

  return (
    <AnimatedItem>
      <Link href={href} className="group block">
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition-shadow group-hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-lg font-bold text-neutral-400">
              {tab === "articles" && item.photoArticle ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(item.photoArticle)} alt="" className="h-full w-full object-cover" />
              ) : tab === "vendeurs" ? (
                <ShoppingBag className="h-5 w-5" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-900">{name}</p>
              {subtitle && (
                <p className="mt-0.5 truncate text-xs text-neutral-500">{subtitle}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                {typeof item.note === "number" && item.note > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-neutral-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {(item.note as number).toFixed(1)}
                  </span>
                )}
                {!!(item.ville ?? item.location) && (
                  <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" />
                    {String(item.ville ?? item.location)}
                  </span>
                )}
                {price != null && (
                  <span className="text-xs font-bold text-primary-600">
                    {formatPriceFCFA(price)}
                    {tab === "freelances" ? "/h" : tab === "prestataires" ? "" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(tab === "prestataires" || tab === "freelances" || tab === "articles") && id && (
            <div className="absolute right-3 top-3">
              <FavoriteButton
                objetType={
                  tab === "prestataires" ? "PRESTATAIRE" : tab === "freelances" ? "FREELANCE" : "ARTICLE"
                }
                objetId={id}
                titre={name}
                prix={price}
                size="sm"
              />
            </div>
          )}
        </motion.div>
      </Link>
    </AnimatedItem>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [activeTab, setActiveTab] = useState<TabKey>("prestataires");

  const { data, isLoading, error } = useQuery({
    queryKey: ["global-search", initialQ],
    queryFn: () => globalSearch(initialQ),
    enabled: initialQ.length >= 2,
  });

  const tabsWithCount = TABS.map((tab) => ({
    ...tab,
    count: Array.isArray(data?.[tab.key]) ? (data[tab.key] as unknown[]).length : 0,
  }));

  const activeItems = (Array.isArray(data?.[activeTab])
    ? (data[activeTab] as Record<string, unknown>[])
    : []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search hero */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            {initialQ ? `Résultats pour "${initialQ}"` : "Rechercher"}
          </h1>
          <div className="mt-6">
            <SmartSearchBar
              size="large"
              placeholder="Prestataire, produit, freelance…"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        {!initialQ && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
            <Search className="h-14 w-14 text-neutral-200" />
            <p className="mt-4 text-lg font-semibold text-neutral-900">
              Que cherchez-vous ?
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Tapez un mot-clé pour trouver prestataires, freelances ou produits.
            </p>
          </div>
        )}

        {initialQ && (
          <>
            {/* Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {tabsWithCount.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                        activeTab === tab.key ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Skeleton */}
            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-neutral-500">
                Recherche indisponible pour le moment.
              </p>
            )}

            {/* Empty */}
            {!isLoading && !error && activeItems.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center">
                <p className="font-semibold text-neutral-900">Aucun résultat</p>
                <p className="mt-2 text-sm text-neutral-500">
                  Essayez un autre onglet ou modifiez votre recherche.
                </p>
              </div>
            )}

            {/* Results */}
            {!isLoading && !error && activeItems.length > 0 && (
              <AnimatePresence mode="wait">
                <AnimatedGrid
                  key={activeTab}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {activeItems.slice(0, 24).map((item, i) => (
                    <ResultCard key={String(item._id ?? i)} tab={activeTab} item={item} />
                  ))}
                </AnimatedGrid>
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
