"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Wrench, Laptop, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoriesByGroupe } from "@/lib/hooks/useCategories";
import { useServicesByGroupe } from "@/lib/hooks/useServices";
import { getCategoryIconConfig } from "@/lib/utils/categoryIcons";
import {
  PRO_INSCRIPTION_OPTIONS,
  resolveProHref,
  type ProRole,
} from "@/lib/utils/proCta";
import { useAuthStore } from "@/stores";
import type { Categorie, Service } from "@/types";

/* ─── Config des 3 pôles ──────────────────────────────────────── */
const POLES = [
  {
    key: "metiers",
    label: "Métiers",
    href: "/prestataires",
    groupe: "Métiers",
    icon: Wrench,
    accentBg: "bg-primary-500",
    accentText: "text-primary-600",
    gradient: "from-primary-500 to-primary-700",
    desc: "Trouvez des professionnels qualifiés près de chez vous",
    cta: { label: "Voir tous les prestataires", href: "/prestataires" },
    role: "PRESTATAIRE" as ProRole,
  },
  {
    key: "freelance",
    label: "Freelance",
    href: "/freelance",
    groupe: "Freelance",
    icon: Laptop,
    accentBg: "bg-blue-600",
    accentText: "text-blue-600",
    gradient: "from-blue-500 to-blue-700",
    desc: "Des talents disponibles pour vos projets",
    cta: { label: "Voir tous les freelances", href: "/freelance" },
    role: "FREELANCE" as ProRole,
  },
  {
    key: "emarche",
    label: "E-marché",
    href: "/emarche",
    groupe: "E-marché",
    icon: ShoppingBag,
    accentBg: "bg-purple-600",
    accentText: "text-purple-600",
    gradient: "from-purple-500 to-purple-700",
    desc: "Produits locaux auprès de vendeurs vérifiés",
    cta: { label: "Voir tous les produits", href: "/emarche" },
    role: "VENDEUR" as ProRole,
  },
] as const;

type PoleKey = (typeof POLES)[number]["key"];

/* ─── Carte catégorie style "Flow Ninja" ─────────────────────── */
function CategoryCard({
  categorie,
  href,
  services,
  accentText,
}: {
  categorie: Categorie;
  href: string;
  services: Service[];
  accentText: string;
}) {
  const { icon: Icon } = getCategoryIconConfig(categorie.nomcategorie);

  const catServices = services.filter((s) => {
    const cat = typeof s.categorie === "object" ? s.categorie : null;
    return cat?._id === categorie._id;
  });

  return (
    <Link
      href={`${href}?categorie=${encodeURIComponent(categorie.nomcategorie)}`}
      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-50"
    >
      {/* Icône neutre — pas de fond coloré */}
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-colors group-hover:border-neutral-300 group-hover:text-neutral-700">
        <Icon className="h-4 w-4" />
      </div>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold text-neutral-900 transition-colors group-hover:text-current", `group-hover:${accentText}`)}>
          {categorie.nomcategorie}
        </p>
        {catServices.length > 0 ? (
          <p className="mt-0.5 truncate text-xs text-neutral-400">
            {catServices
              .slice(0, 3)
              .map((s) => s.nomservice)
              .join(", ")}
            {catServices.length > 3 && "…"}
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-neutral-400">Voir les offres</p>
        )}
      </div>
    </Link>
  );
}

/* ─── Panneau mega-menu pleine largeur ───────────────────────── */
function MegaMenuPanel({ pole }: { pole: (typeof POLES)[number] }) {
  const { data: categories, isLoading } = useCategoriesByGroupe(pole.groupe);
  const { data: services = [] } = useServicesByGroupe(pole.groupe);
  const hasRole = useAuthStore((s) => s.hasRole);
  const proOption = PRO_INSCRIPTION_OPTIONS.find((o) => o.role === pole.role)!;
  const secondaryCta = resolveProHref(proOption, hasRole);
  const Icon = pole.icon;

  return (
    <div className="flex w-full">
      {/* Panneau gauche — coloré + compact */}
      <div
        className={cn(
          "flex w-52 shrink-0 flex-col justify-between bg-gradient-to-br p-6 text-white",
          pole.gradient,
        )}
      >
        <div className="space-y-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">{pole.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/75">{pole.desc}</p>
          </div>
        </div>
        <div className="space-y-2 pt-6">
          <Link
            href={pole.cta.href}
            className="flex items-center gap-1 text-sm font-semibold text-white/90 transition-opacity hover:text-white"
          >
            {pole.cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="flex items-center gap-1 text-xs text-white/65 transition-opacity hover:text-white"
          >
            {secondaryCta.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Panneau droit — catégories pleine largeur */}
      <div className="flex-1 overflow-hidden bg-white p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Catégories
        </p>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : !categories?.length ? (
          <p className="text-sm text-neutral-400">Aucune catégorie disponible.</p>
        ) : (
          <div className="grid grid-cols-4 gap-1">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                categorie={cat}
                href={pole.href}
                services={services}
                accentText={pole.accentText}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!!categories?.length && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <Link
              href={pole.href}
              className={cn(
                "flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75",
                pole.accentText,
              )}
            >
              Voir les {categories.length} catégories
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Item nav ────────────────────────────────────────────────── */
function MegaNavItem({
  pole,
  isActive,
  pathname,
  onEnter,
  onLeave,
}: {
  pole: (typeof POLES)[number];
  isActive: boolean;
  pathname: string;
  onEnter: (key: PoleKey) => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={() => onEnter(pole.key)}
      onMouseLeave={onLeave}
    >
      <Link
        href={pole.href}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100",
          pathname.startsWith(pole.href) ? "text-primary-600" : "text-neutral-600",
          isActive && "bg-neutral-100",
        )}
      >
        {pole.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 opacity-60 transition-transform duration-200",
            isActive && "rotate-180",
          )}
        />
      </Link>
    </div>
  );
}

/* ─── Composant principal — géré depuis la Navbar ────────────── */
export function MegaNav({ pathname }: { pathname: string }) {
  const [activeKey, setActiveKey] = useState<PoleKey | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback((key: PoleKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveKey(key);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveKey(null), 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const activePole = POLES.find((p) => p.key === activeKey) ?? null;

  return (
    <>
      {/* Items de navigation */}
      <div className="flex items-center gap-1">
        {POLES.map((pole) => (
          <MegaNavItem
            key={pole.key}
            pole={pole}
            isActive={activeKey === pole.key}
            pathname={pathname}
            onEnter={handleEnter}
            onLeave={handleLeave}
          />
        ))}

        <Link
          href="/apropos"
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100",
            pathname === "/apropos" ? "text-primary-600" : "text-neutral-600",
          )}
        >
          À propos
        </Link>
      </div>

      {/* Panneau pleine largeur — porté par le parent Navbar */}
      {activePole && (
        <div
          className="absolute inset-x-0 top-full z-50 overflow-hidden border-b border-neutral-200 bg-white shadow-2xl"
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handleLeave}
        >
          {/* Centré avec max-w-7xl */}
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <MegaMenuPanel pole={activePole} />
          </div>
        </div>
      )}
    </>
  );
}
