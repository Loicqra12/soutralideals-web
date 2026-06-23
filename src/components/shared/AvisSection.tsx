"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAvis,
  fetchAvisStats,
  createAvis,
  type AvisObjetType,
} from "@/lib/api/avis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-neutral-200",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function AvisCard({ avis }: { avis: { _id: string; auteur?: { nom?: string; prenom?: string }; note: number; titre: string; commentaire: string; recommande?: boolean; createdAt?: string } }) {
  const authorName =
    avis.auteur
      ? `${avis.auteur.prenom ?? ""} ${avis.auteur.nom ?? ""}`.trim() || "Anonyme"
      : "Anonyme";
  const initials = authorName.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-600">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-neutral-900">{authorName}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < avis.note ? "fill-amber-400 text-amber-400" : "text-neutral-200",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-900">{avis.titre}</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-600">
            {avis.commentaire}
          </p>
          {avis.recommande && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600">
              <ThumbsUp className="h-3 w-3" /> Recommande
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface AvisSectionProps {
  objetType: AvisObjetType;
  objetId: string;
}

export function AvisSection({ objetType, objetId }: AvisSectionProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    note: 0,
    titre: "",
    commentaire: "",
    recommande: true,
  });

  const { data: avisData, isLoading: avisLoading } = useQuery({
    queryKey: ["avis", objetType, objetId],
    queryFn: () => fetchAvis(objetType, objetId, { limit: 10 }),
  });

  const { data: stats } = useQuery({
    queryKey: ["avis-stats", objetType, objetId],
    queryFn: () => fetchAvisStats(objetType, objetId),
  });

  const { mutate: submitAvis, isPending } = useMutation({
    mutationFn: () =>
      createAvis({
        objetType,
        objetId,
        note: form.note,
        titre: form.titre,
        commentaire: form.commentaire,
        recommande: form.recommande,
      }),
    onSuccess: () => {
      toast.success("Merci pour votre avis !");
      setShowForm(false);
      setForm({ note: 0, titre: "", commentaire: "", recommande: true });
      queryClient.invalidateQueries({ queryKey: ["avis", objetType, objetId] });
      queryClient.invalidateQueries({ queryKey: ["avis-stats", objetType, objetId] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Impossible de publier l'avis"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.note === 0) {
      toast.error("Sélectionnez une note.");
      return;
    }
    if (!form.titre.trim() || !form.commentaire.trim()) {
      toast.error("Titre et commentaire sont requis.");
      return;
    }
    submitAvis();
  };

  const avis = avisData?.avis ?? [];
  const avgNote = stats?.moyenne ?? 0;
  const totalAvis = stats?.total ?? avisData?.total ?? 0;

  return (
    <section>
      {/* Stats header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Avis clients</h2>
          {totalAvis > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(avgNote)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {avgNote.toFixed(1)}
              </span>
              <span className="text-sm text-neutral-500">
                ({totalAvis} avis)
              </span>
            </div>
          )}
        </div>

        {isAuthenticated && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Star className="mr-2 h-4 w-4" />
            Laisser un avis
          </Button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
            >
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Votre note
                </p>
                <StarRatingInput
                  value={form.note}
                  onChange={(v) => setForm((p) => ({ ...p, note: v }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Titre de l&apos;avis
                </label>
                <Input
                  value={form.titre}
                  onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
                  placeholder="Résumez votre expérience"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Commentaire
                </label>
                <textarea
                  value={form.commentaire}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, commentaire: e.target.value }))
                  }
                  placeholder="Partagez votre expérience en détail…"
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.recommande}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, recommande: e.target.checked }))
                  }
                  className="h-4 w-4 rounded accent-neutral-900"
                />
                Je recommande
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} size="sm">
                  {isPending ? "Publication…" : "Publier l'avis"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {avisLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : avis.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-10 text-center">
          <p className="text-sm text-neutral-500">
            Aucun avis pour le moment. Soyez le premier à en laisser un !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {avis.map((a) => (
            <AvisCard key={a._id} avis={a} />
          ))}
        </div>
      )}
    </section>
  );
}
