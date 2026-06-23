"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVendeurGuard } from "@/lib/hooks/useVendeurGuard";

export default function EmarcheInscriptionLandingPage() {
  const { ready, isLoading } = useVendeurGuard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">
            Ouvrez votre boutique
          </h1>
          <p className="mt-1 text-neutral-600">
            Vendez vos produits sur l&apos;E-marché Soutrali Deals.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          "Créez votre vitrine en ligne",
          "Gérez vos produits et commandes",
          "Touchez des clients dans toute la Côte d'Ivoire",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-500" />
            <span className="text-neutral-700">{item}</span>
          </div>
        ))}
      </div>

      <Card className="mt-10">
        <CardContent className="p-6 text-center">
          <p className="text-neutral-600">
            Connectez-vous pour ouvrir votre boutique vendeur.
          </p>
          <Button className="mt-4" size="lg" asChild>
            <Link href="/emarche/inscription/formulaire">
              Ouvrir ma boutique
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
