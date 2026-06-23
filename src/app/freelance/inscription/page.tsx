"use client";

import Link from "next/link";
import { CheckCircle2, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFreelanceGuard } from "@/lib/hooks/useFreelanceGuard";

export default function FreelanceInscriptionLandingPage() {
  const { ready, isLoading } = useFreelanceGuard();

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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Laptop className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">
            Devenez freelance sur Soutrali
          </h1>
          <p className="mt-1 text-neutral-600">
            Proposez vos compétences en ligne et trouvez des clients en Côte
            d&apos;Ivoire.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          "Créez votre profil professionnel en quelques minutes",
          "Fixez vos tarifs et votre disponibilité",
          "Recevez des demandes de clients qualifiés",
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
            Vous devez être connecté pour compléter votre inscription freelance.
          </p>
          <Button className="mt-4" size="lg" asChild>
            <Link href="/freelance/inscription/formulaire">
              Commencer l&apos;inscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
