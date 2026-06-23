"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PrestataireCard } from "@/components/prestataires/PrestataireCard";
import { FreelanceCard } from "@/components/freelance/FreelanceCard";
import { ArticleCard } from "@/components/emarche/ArticleCard";
import { ServiceScroll } from "@/components/home/ServiceScroll";
import { CategoryScroll } from "@/components/home/CategoryScroll";
import { useCategoriesByPole } from "@/lib/hooks/useCategories";
import { useServicesByGroupe } from "@/lib/hooks/useServices";
import { POLE_GROUPE_NAMES } from "@/lib/utils/filters";
import { usePrestataires } from "@/lib/hooks/usePrestataires";
import { useFreelances } from "@/lib/hooks/useFreelances";
import { useArticles } from "@/lib/hooks/useArticles";
import {
  POLE_LABELS,
  type PoleType,
} from "@/lib/utils/filters";

const POLES: PoleType[] = ["metiers", "freelance", "emarche"];

const LISTING_LABELS: Record<PoleType, string> = {
  metiers: "Prestataires populaires",
  freelance: "Freelances populaires",
  emarche: "Produits populaires",
};

function ListingsGrid({
  isLoading,
  children,
  emptyMessage,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-xl bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (!children) {
    return <p className="text-sm text-neutral-400">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}

function MetiersPanel() {
  const { data: services, isLoading: loadingServices } = useServicesByGroupe(
    POLE_GROUPE_NAMES.metiers,
  );
  const { data: prestataires, isLoading: loadingListings } = usePrestataires();
  const items = prestataires?.slice(0, 4) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Services
        </h3>
        <ServiceScroll
          pole="metiers"
          isLoading={loadingServices}
          services={services}
        />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            {LISTING_LABELS.metiers}
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prestataires">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ListingsGrid
          isLoading={loadingListings}
          emptyMessage="Aucun prestataire pour le moment."
        >
          {items.length > 0 &&
            items.map((p) => <PrestataireCard key={p._id} prestataire={p} />)}
        </ListingsGrid>
      </div>
    </div>
  );
}

function FreelancePanel() {
  const { data: services, isLoading: loadingServices } = useServicesByGroupe(
    POLE_GROUPE_NAMES.freelance,
  );
  const { data: freelances, isLoading: loadingListings } = useFreelances();
  const items = freelances?.slice(0, 4) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Services
        </h3>
        <ServiceScroll
          pole="freelance"
          isLoading={loadingServices}
          services={services}
        />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            {LISTING_LABELS.freelance}
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/freelance">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ListingsGrid
          isLoading={loadingListings}
          emptyMessage="Aucun freelance pour le moment."
        >
          {items.length > 0 &&
            items.map((f) => <FreelanceCard key={f._id} freelance={f} />)}
        </ListingsGrid>
      </div>
    </div>
  );
}

function EmarchePanel() {
  const { data: categories, isLoading: loadingCategories } =
    useCategoriesByPole("emarche");
  const { data: articles, isLoading: loadingListings } = useArticles();
  const items = articles?.slice(0, 4) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Catégories
        </h3>
        <CategoryScroll
          pole="emarche"
          isLoading={loadingCategories}
          categories={categories}
        />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            {LISTING_LABELS.emarche}
          </h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/emarche">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ListingsGrid
          isLoading={loadingListings}
          emptyMessage="Aucun produit pour le moment."
        >
          {items.length > 0 &&
            items.map((a) => (
              <ArticleCard
                key={a._id ?? a.nomArticle}
                article={a}
              />
            ))}
        </ListingsGrid>
      </div>
    </div>
  );
}

const PANELS: Record<PoleType, React.ReactNode> = {
  metiers: <MetiersPanel />,
  freelance: <FreelancePanel />,
  emarche: <EmarchePanel />,
};

export function ExploreSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-14 lg:px-8"
      aria-labelledby="explore-heading"
    >
      <div className="mb-8">
        <h2
          id="explore-heading"
          className="text-2xl font-bold text-neutral-900 sm:text-3xl"
        >
          Explorer Soutrali
        </h2>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Parcourez les services et catégories, puis découvrez les profils et
          produits les plus demandés en Côte d&apos;Ivoire.
        </p>
      </div>

      <Tabs defaultValue="metiers">
        <TabsList className="mb-6 h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl p-1.5 sm:w-auto">
          {POLES.map((pole) => (
            <TabsTrigger
              key={pole}
              value={pole}
              className="rounded-xl px-5 py-2.5 data-[state=active]:shadow-sm"
            >
              {POLE_LABELS[pole]}
            </TabsTrigger>
          ))}
        </TabsList>

        {POLES.map((pole) => (
          <TabsContent key={pole} value={pole} className="mt-0">
            {PANELS[pole]}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
