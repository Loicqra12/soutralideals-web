"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Loader2, MapPin, Navigation, SlidersHorizontal, X } from "lucide-react";
import { LocalSearchInput } from "@/components/shared/LocalSearchInput";
import { usePrestataires } from "@/lib/hooks/usePrestataires";
import { useNearbyPrestataires } from "@/lib/hooks/useNearbyPrestataires";
import { formatDistance } from "@/lib/utils/haversine";
import { useServicesByGroupe } from "@/lib/hooks/useServices";
import { PrestataireCard } from "@/components/prestataires/PrestataireCard";
import { ServiceScroll } from "@/components/home/ServiceScroll";
import { CardSkeletonGrid } from "@/components/shared/CardSkeleton";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";
import { Pagination } from "@/components/shared/Pagination";
import { POLE_GROUPE_NAMES } from "@/lib/utils/filters";
import {
  getCategoryLabel,
  getServiceLabel,
  getUtilisateurDisplayName,
  matchesServiceFilter,
} from "@/lib/utils/listingDisplay";

const VILLES = ["Abidjan", "Bouaké", "Yamoussoukro", "San-Pédro", "Korhogo"];
const PAGE_SIZE = 12;

function PrestatairesContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const serviceId = searchParams.get("service");
  const serviceName = searchParams.get("serviceName") ?? "";
  const [search, setSearch] = useState(q || serviceName);
  const [villeFilter, setVilleFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [nearbyMode, setNearbyMode] = useState(false);

  const apiFilters = useMemo(
    () => ({ service: serviceId ?? undefined, limit: 200 }),
    [serviceId],
  );

  const { data: services, isLoading: loadingServices } = useServicesByGroupe(
    POLE_GROUPE_NAMES.metiers,
  );
  const { data, isLoading, error } = usePrestataires(apiFilters);
  const {
    nearby,
    requesting: locRequesting,
    locationError,
    requestLocation,
    hasLocation,
  } = useNearbyPrestataires(data ?? [], 25);

  const filtered = useMemo(() => {
    return (data ?? []).filter((p) => {
      if (
        (serviceId || serviceName) &&
        !matchesServiceFilter(p.service, serviceId, serviceName)
      ) return false;
      if (verifiedOnly && !p.verifier) return false;
      if (villeFilter) {
        const pVille = (p.ville ?? p.localisation ?? "").toLowerCase();
        if (!pVille.includes(villeFilter.toLowerCase())) return false;
      }
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      const name = getUtilisateurDisplayName(p.nom, p.prenom, p.utilisateur).toLowerCase();
      const service = (
        getServiceLabel(p.service) ??
        getCategoryLabel(p.categorie, p.service) ??
        ""
      ).toLowerCase();
      const ville = (p.ville ?? p.localisation ?? "").toLowerCase();
      return name.includes(term) || service.includes(term) || ville.includes(term);
    });
  }, [data, search, serviceId, serviceName, villeFilter, verifiedOnly]);

  const displayList = nearbyMode && hasLocation ? nearby : filtered;
  const totalPages = Math.ceil(displayList.length / PAGE_SIZE);
  const paginated = displayList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilterCount = [villeFilter, verifiedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Trouver un prestataire
          </h1>
          <p className="mt-2 text-neutral-500">
            Des artisans et techniciens vérifiés, près de chez vous en Côte d&apos;Ivoire.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Bouton "Près de moi" */}
            <button
              onClick={async () => {
                if (!hasLocation) await requestLocation();
                setNearbyMode((v) => !v);
                setPage(1);
              }}
              disabled={locRequesting}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                nearbyMode && hasLocation
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-400 hover:text-primary-600"
              } disabled:opacity-50`}
            >
              {locRequesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              Près de moi
            </button>
            <div className="flex-1 max-w-lg">
              <LocalSearchInput
                value={search}
                onChange={(v) => { setSearch(v); setPage(1); }}
                placeholder="Plombier, coiffeur, électricien…"
              />
            </div>
            {locationError && (
              <p className="text-xs text-red-500 sm:col-span-2">{locationError}</p>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-neutral-900">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Ville
                </p>
                <div className="flex flex-wrap gap-2">
                  {VILLES.map((v) => (
                    <button
                      key={v}
                      onClick={() => { setVilleFilter(villeFilter === v ? "" : v); setPage(1); }}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        villeFilter === v
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }}
                    className="h-4 w-4 rounded accent-neutral-900"
                  />
                  Profils vérifiés uniquement
                </label>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setVilleFilter(""); setVerifiedOnly(false); setPage(1); }}
                  className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900"
                >
                  <X className="h-3.5 w-3.5" /> Réinitialiser
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-8">
          <ServiceScroll pole="metiers" isLoading={loadingServices} services={services} />
        </div>

        {!isLoading && !error && filtered.length > 0 && (
          <p className="mb-5 text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">{filtered.length}</span>{" "}
            prestataire{filtered.length > 1 ? "s" : ""} —{" "}
            page {page}/{totalPages || 1}
          </p>
        )}

        {isLoading && <CardSkeletonGrid count={PAGE_SIZE} />}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
            <p className="text-neutral-500">
              Impossible de charger les prestataires. Vérifiez que le backend est démarré.
            </p>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-neutral-900">Aucun résultat</p>
            <p className="mt-2 text-sm text-neutral-500">Essayez d&apos;autres critères.</p>
          </div>
        )}

        {!isLoading && !error && paginated.length > 0 && (
          <>
            <AnimatedGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((p) => (
                <AnimatedItem key={p._id}>
                  <PrestataireCard
                    prestataire={p}
                    distanceKm={(p as { distanceKm?: number }).distanceKm}
                  />
                </AnimatedItem>
              ))}
            </AnimatedGrid>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="mt-10"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function PrestatairesPage() {
  return (
    <Suspense>
      <PrestatairesContent />
    </Suspense>
  );
}
