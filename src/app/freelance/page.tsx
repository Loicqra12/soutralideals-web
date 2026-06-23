"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SmartSearchBar } from "@/components/shared/SmartSearchBar";
import { useFreelances } from "@/lib/hooks/useFreelances";
import { useServicesByGroupe } from "@/lib/hooks/useServices";
import { FreelanceCard } from "@/components/freelance/FreelanceCard";
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

const PAGE_SIZE = 12;
const NIVEAUX = ["Débutant", "Intermédiaire", "Expert"];

type FreelanceItem = {
  name?: string;
  nom?: string;
  prenom?: string;
  utilisateur?: { nom?: string; prenom?: string } | string;
  job?: string;
  service?: string | { nomservice?: string };
  category?: string;
  categorie?: string;
  location?: string;
  ville?: string;
};

function getSearchText(f: FreelanceItem) {
  const parts = [
    f.name,
    getUtilisateurDisplayName(f.nom, f.prenom, f.utilisateur, ""),
    f.job,
    getServiceLabel(f.service),
    f.category,
    f.categorie,
    getCategoryLabel(f.categorie, f.service),
    f.location,
    f.ville,
  ];
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function FreelanceContent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("service");
  const serviceName = searchParams.get("serviceName") ?? "";
  const q = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(q || serviceName);
  const [niveauFilter, setNiveauFilter] = useState("");
  const [dispFilter, setDispFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data: services, isLoading: loadingServices } = useServicesByGroupe(
    POLE_GROUPE_NAMES.freelance,
  );
  const { data, isLoading, error } = useFreelances();

  const filtered = useMemo(() => {
    return (data ?? []).filter((f) => {
      if (serviceId || serviceName) {
        const matchesService = matchesServiceFilter(f.service, serviceId, serviceName);
        const matchesText =
          serviceName && getSearchText(f).includes(serviceName.toLowerCase());
        if (!matchesService && !matchesText) return false;
      }
      if (niveauFilter && f.experienceLevel !== niveauFilter) return false;
      if (dispFilter && f.availabilityStatus !== dispFilter) return false;
      if (!search.trim()) return true;
      return getSearchText(f).includes(search.toLowerCase());
    });
  }, [data, search, serviceId, serviceName, niveauFilter, dispFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilterCount = [niveauFilter, dispFilter].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Trouver un freelance
          </h1>
          <p className="mt-2 text-neutral-500">
            Développeurs, designers, consultants — des talents disponibles pour vos projets.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 max-w-lg">
              <SmartSearchBar
                placeholder="Développeur, designer, SEO…"
                className="w-full"
              />
            </div>
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

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Expérience
                </p>
                <div className="flex flex-wrap gap-2">
                  {NIVEAUX.map((n) => (
                    <button
                      key={n}
                      onClick={() => { setNiveauFilter(niveauFilter === n ? "" : n); setPage(1); }}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        niveauFilter === n
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Disponibilité
                </p>
                <div className="flex gap-2">
                  {["Disponible", "Occupé"].map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDispFilter(dispFilter === d ? "" : d); setPage(1); }}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        dispFilter === d
                          ? "bg-neutral-900 text-white"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setNiveauFilter(""); setDispFilter(""); setPage(1); }}
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
          <ServiceScroll pole="freelance" isLoading={loadingServices} services={services} />
        </div>

        {!isLoading && !error && filtered.length > 0 && (
          <p className="mb-5 text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">{filtered.length}</span>{" "}
            freelance{filtered.length > 1 ? "s" : ""} — page {page}/{totalPages || 1}
          </p>
        )}

        {isLoading && <CardSkeletonGrid count={PAGE_SIZE} />}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
            <p className="text-neutral-500">Impossible de charger les freelances.</p>
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
              {paginated.map((f) => (
                <AnimatedItem key={f._id}>
                  <FreelanceCard freelance={f} />
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

export default function FreelancePage() {
  return (
    <Suspense>
      <FreelanceContent />
    </Suspense>
  );
}
