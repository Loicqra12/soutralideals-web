"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchPrestataires } from "@/lib/api/prestataires";
import { PrestataireCard } from "@/components/prestataires/PrestataireCard";
import {
  getCategoryLabel,
  getEntityServiceId,
  getServiceLabel,
} from "@/lib/utils/listingDisplay";
import type { Prestataire } from "@/types";

interface SimilarPrestatairesProps {
  currentId: string;
  service?: Prestataire["service"];
  categorie?: Prestataire["categorie"];
  ville?: string | null;
}

function scoreSimilarity(
  current: SimilarPrestatairesProps,
  candidate: Prestataire,
): number {
  let score = 0;

  const currentServiceId = getEntityServiceId(current.service);
  const candidateServiceId = getEntityServiceId(candidate.service);
  if (currentServiceId && candidateServiceId === currentServiceId) {
    score += 3;
  }

  const currentServiceName = getServiceLabel(current.service);
  const candidateServiceName = getServiceLabel(candidate.service);
  if (
    currentServiceName &&
    candidateServiceName &&
    currentServiceName.toLowerCase() === candidateServiceName.toLowerCase()
  ) {
    score += 2;
  }

  const currentCategory = getCategoryLabel(current.categorie, current.service);
  const candidateCategory = getCategoryLabel(candidate.categorie, candidate.service);
  if (
    currentCategory &&
    candidateCategory &&
    currentCategory.toLowerCase() === candidateCategory.toLowerCase()
  ) {
    score += 2;
  }

  const currentVille = current.ville?.trim().toLowerCase();
  const candidateVille = (candidate.ville ?? candidate.localisation)?.trim().toLowerCase();
  if (currentVille && candidateVille && currentVille === candidateVille) {
    score += 1;
  }

  return score;
}

export function SimilarPrestataires({
  currentId,
  service,
  categorie,
  ville,
}: SimilarPrestatairesProps) {
  const { data: prestataires } = useQuery({
    queryKey: ["prestataires-similar", currentId],
    queryFn: () => fetchPrestataires(),
    staleTime: 5 * 60 * 1000,
  });

  const similar = useMemo(() => {
    const ctx: SimilarPrestatairesProps = { currentId, service, categorie, ville };

    return (prestataires ?? [])
      .filter((p) => p._id !== currentId)
      .map((p) => ({ p, score: scoreSimilarity(ctx, p) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.p.note ?? 0) - (a.p.note ?? 0);
      })
      .slice(0, 4)
      .map(({ p }) => p);
  }, [prestataires, currentId, service, categorie, ville]);

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 pt-10">
      <h2 className="mb-5 text-lg font-semibold text-neutral-900">
        Prestataires similaires
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((prestataire, i) => (
          <motion.div
            key={prestataire._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <PrestataireCard prestataire={prestataire} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
