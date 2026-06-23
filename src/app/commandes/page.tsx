"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { fetchMyCommandes } from "@/lib/api/commandes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceFCFA } from "@/lib/utils/format";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";

const STATUS_STYLES: Record<string, string> = {
  "En cours": "bg-amber-50 text-amber-700 border-amber-200",
  "Confirmée": "bg-blue-50 text-blue-700 border-blue-200",
  "En préparation": "bg-blue-50 text-blue-700 border-blue-200",
  "Expédiée": "bg-purple-50 text-purple-700 border-purple-200",
  "Livrée": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Annulée": "bg-red-50 text-red-700 border-red-200",
};

const FILTERS = [
  { value: "", label: "Toutes" },
  { value: "En cours", label: "En cours" },
  { value: "Livrée", label: "Livrées" },
  { value: "Annulée", label: "Annulées" },
];

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CommandesPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["mes-commandes", status, page],
    queryFn: () => fetchMyCommandes({ page, limit: LIMIT, status: status || undefined }),
  });

  const commandes = data?.commandes ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/emarche">
            <ArrowLeft className="mr-2 h-4 w-4" /> E-marché
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-neutral-900">Mes commandes</h1>
        <p className="mt-1 text-neutral-500">
          {total} commande{total > 1 ? "s" : ""}
        </p>

        {/* Status filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatus(f.value); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                status === f.value
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
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-14 text-center">
              <p className="text-neutral-500">Impossible de charger les commandes.</p>
            </div>
          )}

          {!isLoading && !error && commandes.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
              <Package className="h-14 w-14 text-neutral-200" />
              <p className="mt-4 text-lg font-semibold text-neutral-900">Aucune commande</p>
              <p className="mt-2 text-sm text-neutral-500">
                Vos commandes apparaîtront ici.
              </p>
              <Button className="mt-6" asChild>
                <Link href="/emarche">Découvrir l&apos;E-marché</Link>
              </Button>
            </div>
          )}

          {!isLoading && !error && commandes.length > 0 && (
            <AnimatedGrid className="space-y-3">
              {commandes.map((cmd) => (
                <AnimatedItem key={cmd._id}>
                  <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              STATUS_STYLES[cmd.statusCommande] ??
                              "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {cmd.statusCommande}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {formatDate(cmd.dateCreation ?? cmd.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-neutral-600">
                          {cmd.articles.length} article{cmd.articles.length > 1 ? "s" : ""}{" "}
                          —{" "}
                          {cmd.articles
                            .slice(0, 2)
                            .map((a) => a.nom)
                            .join(", ")}
                          {cmd.articles.length > 2 && (
                            <span className="text-neutral-400">
                              {" "}+{cmd.articles.length - 2} autre{cmd.articles.length - 2 > 1 ? "s" : ""}
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-neutral-900">
                          {formatPriceFCFA(cmd.prixTotal)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
                    </div>

                    {/* Delivery address */}
                    {cmd.infoCommande?.ville && (
                      <div className="border-t border-neutral-50 px-5 py-2.5 text-xs text-neutral-400">
                        Livraison → {cmd.infoCommande.ville}
                        {cmd.infoCommande.addresse
                          ? `, ${cmd.infoCommande.addresse}`
                          : ""}
                      </div>
                    )}
                  </div>
                </AnimatedItem>
              ))}
            </AnimatedGrid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Précédent
              </Button>
              <span className="text-sm text-neutral-500">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
