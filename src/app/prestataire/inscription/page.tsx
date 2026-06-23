"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { usePrestataireGuard } from "@/lib/hooks/usePrestataireGuard";

export default function PrestataireInscriptionPage() {
  const { ready, isAuthenticated, isLoading } = usePrestataireGuard();

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
      <h1 className="text-4xl font-bold text-neutral-900">
        Devenez prestataire sur Soutrali Deals
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        Développez votre activité et touchez de nouveaux clients en Côte
        d&apos;Ivoire.
      </p>

      <div className="mt-8 space-y-3">
        {[
          "Créez votre profil professionnel",
          "Recevez des demandes de clients",
          "Gérez vos missions depuis votre dashboard",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary-500" />
            <span className="text-neutral-700">{item}</span>
          </div>
        ))}
      </div>

      <Card className="mt-10">
        <CardContent className="p-6 text-center">
          {isAuthenticated ? (
            <>
              <p className="text-neutral-600">
                Complétez votre inscription prestataire en quelques étapes.
              </p>
              <Button className="mt-4" size="lg" asChild>
                <Link href="/prestataire/registration">
                  Commencer l&apos;inscription
                </Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-neutral-600">
                Connectez-vous avec le même compte que sur l&apos;application
                mobile pour retrouver votre profil.
              </p>
              <Button className="mt-4" size="lg" asChild>
                <Link href="/connexion?redirect=/prestataire/inscription">
                  Se connecter
                </Link>
              </Button>
              <p className="mt-4 text-sm text-neutral-500">
                Pas de compte ?{" "}
                <Link
                  href="/inscription?redirect=/prestataire/inscription"
                  className="text-primary-600"
                >
                  S&apos;inscrire
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
