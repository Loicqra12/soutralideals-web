"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchFreelances } from "@/lib/api/freelances";
import { FreelanceCard } from "@/components/freelance/FreelanceCard";
import {
  getCategoryLabel,
  getEntityServiceId,
  getServiceLabel,
} from "@/lib/utils/listingDisplay";
import type { Freelance } from "@/types";

interface SimilarFreelancesProps {
  currentId: string;
  service?: Freelance["service"];
  categorie?: Freelance["categorie"];
  category?: Freelance["category"];
  job?: Freelance["job"];
  location?: string | null;
}

function getFreelanceCategoryLabel(f: SimilarFreelancesProps): string | null {
  return (
    f.job ??
    f.category ??
    getCategoryLabel(f.categorie, f.service) ??
    getServiceLabel(f.service) ??
    null
  );
}

function scoreSimilarity(
  current: SimilarFreelancesProps,
  candidate: Freelance,
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

  const currentCategory = getFreelanceCategoryLabel(current);
  const candidateCategory =
    candidate.job ??
    candidate.category ??
    getCategoryLabel(candidate.categorie, candidate.service) ??
    getServiceLabel(candidate.service) ??
    null;
  if (
    currentCategory &&
    candidateCategory &&
    currentCategory.toLowerCase() === candidateCategory.toLowerCase()
  ) {
    score += 2;
  }

  const currentLocation = current.location?.trim().toLowerCase();
  const candidateLocation = (candidate.location ?? candidate.ville)?.trim().toLowerCase();
  if (currentLocation && candidateLocation && currentLocation === candidateLocation) {
    score += 1;
  }

  if (current.job && candidate.skills?.some((s) => s.toLowerCase() === current.job!.toLowerCase())) {
    score += 1;
  }

  return score;
}

export function SimilarFreelances({
  currentId,
  service,
  categorie,
  category,
  job,
  location,
}: SimilarFreelancesProps) {
  const { data: freelances } = useQuery({
    queryKey: ["freelances-similar", currentId],
    queryFn: () => fetchFreelances(),
    staleTime: 5 * 60 * 1000,
  });

  const similar = useMemo(() => {
    const ctx: SimilarFreelancesProps = {
      currentId,
      service,
      categorie,
      category,
      job,
      location,
    };

    return (freelances ?? [])
      .filter((f) => f._id !== currentId)
      .map((f) => ({ f, score: scoreSimilarity(ctx, f) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.f.rating ?? b.f.note ?? 0) - (a.f.rating ?? a.f.note ?? 0);
      })
      .slice(0, 4)
      .map(({ f }) => f);
  }, [freelances, currentId, service, categorie, category, job, location]);

  if (similar.length === 0) return null;

  return (
    <section className="border-t border-neutral-100 pt-10">
      <h2 className="mb-5 text-lg font-semibold text-neutral-900">
        Freelances similaires
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {similar.map((freelance, i) => (
          <motion.div
            key={freelance._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <FreelanceCard freelance={freelance} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
