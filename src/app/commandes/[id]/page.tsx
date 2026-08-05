"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Package, MapPin, Phone, AlertCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeliveryTimeline } from "@/components/shared/DeliveryTimeline";
import { fetchCommandeById } from "@/lib/api/commandes";
import { formatPriceFCFA } from "@/lib/utils/format";

const STATUS_STYLES: Record<string, string> = {
  "En cours": "bg-amber-50 text-amber-700 border-amber-200",
  "Confirmée": "bg-blue-50 text-blue-700 border-blue-200",
  "En préparation": "bg-blue-50 text-blue-700 border-blue-200",
  "Expédiée": "bg-purple-50 text-purple-700 border-purple-200",
  "Livrée": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Annulée": "bg-red-50 text-red-700 border-red-200",
};

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function CommandeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: commande, isLoading, error } = useQuery({
    queryKey: ["commande", id],
    queryFn: () => fetchCommandeById(id),
    staleTime: 30 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
      </div>
    );
  }

  if (error || !commande) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-neutral-300" />
        <p className="mt-4 text-lg font-semibold text-neutral-900">Commande introuvable</p>
        <p className="mt-2 text-sm text-neutral-500">
          Cette commande n&apos;existe pas ou vous n&apos;y avez pas accès.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/commandes">Mes commandes</Link>
        </Button>
      </div>
    );
  }

  const status = commande.statusCommande ?? "En cours";
  const statusStyle = STATUS_STYLES[status] ?? "bg-neutral-100 text-neutral-700";
  const date = commande.createdAt ?? commande.dateCreation;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/commandes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Mes commandes
          </Link>
        </Button>

        {/* En-tête */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-neutral-500">Commande</p>
              <p className="mt-0.5 font-mono text-sm font-medium text-neutral-900">
                #{commande._id.slice(-8).toUpperCase()}
              </p>
              {date && (
                <p className="mt-1 text-xs text-neutral-400">{formatDate(date)}</p>
              )}
            </div>
            <Badge
              variant="outline"
              className={`border text-xs font-medium ${statusStyle}`}
            >
              {status}
            </Badge>
          </div>
        </div>

        {/* Timeline suivi */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Suivi de livraison</h2>
          <DeliveryTimeline status={status} />
        </div>

        {/* Adresse livraison */}
        {commande.infoCommande && (
          <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">Adresse de livraison</h2>
            <div className="space-y-1.5 text-sm text-neutral-600">
              {commande.infoCommande.addresse && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{commande.infoCommande.addresse}</span>
                </div>
              )}
              {(commande.infoCommande.ville || commande.infoCommande.pays) && (
                <p className="ml-6 text-neutral-500">
                  {[commande.infoCommande.ville, commande.infoCommande.pays]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {commande.infoCommande.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{commande.infoCommande.telephone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              Articles ({commande.articles.length})
            </h2>
          </div>
          <ul className="divide-y divide-neutral-100">
            {commande.articles.map((item, i) => (
              <li key={i} className="flex items-center gap-4 p-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.nom}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-neutral-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{item.nom}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatPriceFCFA(item.prix)} × {item.quantite}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-neutral-900">
                  {formatPriceFCFA((item.prixTotal ?? item.prix * item.quantite))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Récapitulatif */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Sous-total</span>
              <span>{formatPriceFCFA(commande.prixArticles)}</span>
            </div>
            {commande.prixLivraison != null && (
              <div className="flex justify-between text-neutral-600">
                <span>Livraison</span>
                <span>
                  {commande.prixLivraison === 0
                    ? "Gratuite"
                    : formatPriceFCFA(commande.prixLivraison)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-100 pt-2 font-semibold text-neutral-900">
              <span>Total</span>
              <span>{formatPriceFCFA(commande.prixTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
