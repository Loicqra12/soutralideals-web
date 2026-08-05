"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  User,
  ShieldCheck,
  ShieldOff,
  Info,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPrestataire } from "@/lib/hooks/useMyPrestataire";
import { submitPrestataireFinalization } from "@/lib/api/prestataires";
import { LocationPicker } from "@/components/prestataire/LocationPicker";
import { cn } from "@/lib/utils";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(
    /\/api\/?$/,
    "",
  );

function resolveMediaUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}

type DocKey = "cni1" | "cni2" | "selfie";

const DOC_LABELS: Record<DocKey, { title: string; hint: string; icon: typeof CreditCard }> = {
  cni1: { title: "CNI recto", hint: "Photo lisible du recto", icon: CreditCard },
  cni2: { title: "CNI verso", hint: "Photo lisible du verso", icon: CreditCard },
  selfie: { title: "Photo selfie", hint: "Visage visible, fond neutre", icon: User },
};

export default function PrestataireFinalisationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useMyPrestataire();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locError, setLocError] = useState("");
  const [docs, setDocs] = useState<Partial<Record<DocKey, File>>>({});
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    if (!profile) return;
    if (profile.status === "pending" || profile.status === "active") {
      router.replace("/prestataire/dashboard");
    }
    if (profile.localisationmaps?.latitude != null && profile.localisationmaps?.longitude != null) {
      setLocation({
        latitude: profile.localisationmaps.latitude,
        longitude: profile.localisationmaps.longitude,
        label: profile.localisation ?? "Position enregistrée",
      });
    }
  }, [profile, router]);

  const existingDocs = useMemo(
    () => ({
      cni1: profile?.cni1,
      cni2: profile?.cni2,
      selfie: profile?.selfie,
    }),
    [profile],
  );

  const hasDoc = (key: DocKey) => !!(docs[key] || existingDocs[key]);

  // Localisation seule suffit pour publier (sans badge)
  const canSubmit = location != null;
  // CNI recto + verso + selfie → badge "Identité vérifiée"
  const hasIdentity = hasDoc("cni1") && hasDoc("cni2") && hasDoc("selfie");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <p className="text-neutral-600">Aucun profil prestataire trouvé.</p>
        <Button asChild className="mt-4">
          <Link href="/prestataire/registration">Créer mon profil</Link>
        </Button>
      </div>
    );
  }

  if (profile.status === "rejected") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Profil rejeté</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-neutral-600">
            <p>
              Votre dossier a été rejeté par l&apos;équipe Soutrali. Contactez le
              support pour obtenir des précisions avant de soumettre à nouveau.
            </p>
            <Button variant="outline" asChild>
              <Link href="/prestataire/dashboard">Retour au tableau de bord</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!canSubmit || !location) return;
    setLoading(true);
    setError("");
    try {
      await submitPrestataireFinalization(profile._id, {
        files: docs,
        existing: existingDocs,
        localisation: location.label,
        localisationmaps: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["my-prestataire"] });
      router.push("/prestataire/dashboard");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Soumission impossible. Réessayez.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Finalisation du profil
          </h1>
          <p className="text-sm text-neutral-500">
            Définissez votre zone pour être visible — ajoutez la CNI pour le badge Vérifié
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              "h-2 flex-1 rounded-full",
              s <= step ? "bg-primary-500" : "bg-neutral-200",
            )}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Documents d'identité (optionnel)"}
            {step === 2 && "Zone d'intervention (GPS)"}
            {step === 3 && "Confirmation"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              {/* Explication des deux niveaux */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Avec CNI + selfie</strong> → badge{" "}
                    <span className="font-semibold">&quot;Identité vérifiée&quot;</span> affiché sur
                    votre profil. Les clients vous font plus confiance.
                  </span>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
                  <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>
                    <strong>Sans documents</strong> → profil publié sans badge. Vous
                    pouvez toujours les ajouter plus tard depuis votre tableau de bord.
                  </span>
                </div>
              </div>

              {(["cni1", "cni2", "selfie"] as const).map((key) => {
                const meta = DOC_LABELS[key];
                const Icon = meta.icon;
                const existing = resolveMediaUrl(existingDocs[key]);
                const selected = docs[key];
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-neutral-200 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-neutral-500" />
                        <span className="text-sm font-medium">{meta.title}</span>
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                          OPTIONNEL
                        </span>
                      </div>
                      {hasDoc(key) && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="mb-3 text-xs text-neutral-500">{meta.hint}</p>
                    {existing && !selected && (
                      <img
                        src={existing}
                        alt={meta.title}
                        className="mb-3 h-24 w-full rounded-md border object-cover"
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setDocs((prev) => ({
                          ...prev,
                          [key]: file,
                        }));
                      }}
                    />
                    {selected && (
                      <p className="mt-1 text-xs text-green-700">
                        Nouveau fichier : {selected.name}
                      </p>
                    )}
                  </div>
                );
              })}

              {hasIdentity && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Documents complets — badge &quot;Identité vérifiée&quot; sera attribué après validation.
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => setStep(2)}
              >
                Continuer
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-neutral-600">
                Indiquez votre zone d&apos;intervention pour que les clients proches
                puissent vous trouver. Votre adresse exacte n&apos;est pas affichée
                publiquement.
              </p>
              <LocationPicker
                value={location}
                onChange={setLocation}
                error={locError}
                onError={setLocError}
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button
                  className="flex-1"
                  disabled={!location}
                  onClick={() => setStep(3)}
                >
                  Continuer
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Zone d&apos;intervention : {location?.label}
                </li>
                {hasIdentity ? (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Documents d&apos;identité fournis → badge{" "}
                    <span className="font-semibold text-emerald-700">Identité vérifiée</span>
                  </li>
                ) : (
                  <li className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-neutral-400" />
                    <span className="text-neutral-500">
                      Pas de CNI — profil publié{" "}
                      <span className="font-medium">sans badge</span>. Vous pourrez l&apos;ajouter plus tard.
                    </span>
                  </li>
                )}
              </ul>
              <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900">
                Après envoi, votre profil passera en{" "}
                <strong>attente de validation</strong> par l&apos;équipe Soutrali
                (24–48 h ouvrées).
              </p>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={loading || !canSubmit}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Soumettre pour validation"
                  )}
                </Button>
              </div>
            </>
          )}

          {error && step !== 3 && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-neutral-500">
        <Link href="/prestataire/dashboard" className="text-primary-600 hover:underline">
          Retour au tableau de bord
        </Link>
      </p>
    </div>
  );
}
