"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceSelect } from "@/components/forms/ServiceSelect";
import { createPrestataire } from "@/lib/api/prestataires";
import { useAuthStore } from "@/stores";
import { usePrestataireGuard } from "@/lib/hooks/usePrestataireGuard";

export default function PrestataireRegistrationPage() {
  const router = useRouter();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);
  const { ready, isLoading: guardLoading } = usePrestataireGuard();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    ville: "",
    description: "",
    serviceId: "",
    serviceName: "",
    tarif: "",
    anneeExperience: "",
  });
  const [docs, setDocs] = useState<{
    cni1?: File;
    cni2?: File;
    selfie?: File;
  }>({});

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (guardLoading || !ready) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  const handleFinish = async () => {
    setError("");
    if (!utilisateur?._id) {
      router.push("/connexion?redirect=/prestataire/registration");
      return;
    }
    if (!form.serviceId || !form.ville || !form.tarif) {
      setError("Ville, service et tarif sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await createPrestataire(
        {
          utilisateur: utilisateur._id,
          service: form.serviceId,
          prixprestataire: Number(form.tarif),
          localisation: form.ville,
          description: form.description || undefined,
          anneeExperience: form.anneeExperience || undefined,
          source: "web",
        },
        docs,
      );
      await refreshRoles();
      router.push("/prestataire/dashboard");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Inscription prestataire impossible.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary-500" : "bg-neutral-200"}`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Votre zone d'activité"}
            {step === 2 && "Votre service"}
            {step === 3 && "Vérification (optionnel)"}
          </CardTitle>
          <p className="text-sm text-neutral-500">
            Connecté en tant que {utilisateur?.prenom} {utilisateur?.nom}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Ville *</label>
                <Input
                  value={form.ville}
                  onChange={(e) => update("ville", e.target.value)}
                  placeholder="Abidjan, Bouaké..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Années d&apos;expérience
                </label>
                <Input
                  value={form.anneeExperience}
                  onChange={(e) => update("anneeExperience", e.target.value)}
                  placeholder="ex. 5 ans"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="flex w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  placeholder="Présentez votre activité..."
                />
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Continuer
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium">Service *</label>
                <ServiceSelect
                  pole="metiers"
                  value={form.serviceId}
                  onChange={(id, name) => {
                    update("serviceId", id);
                    update("serviceName", name);
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tarif moyen (FCFA) *
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.tarif}
                  onChange={(e) => update("tarif", e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button className="flex-1" onClick={() => setStep(3)}>
                  Continuer
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-neutral-600">
                Ajoutez vos documents pour accélérer la vérification (facultatif
                pour l&apos;instant).
              </p>
              {(["cni1", "cni2", "selfie"] as const).map((key) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium">
                    {key === "cni1"
                      ? "CNI recto"
                      : key === "cni2"
                        ? "CNI verso"
                        : "Photo selfie"}
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setDocs((prev) => ({
                        ...prev,
                        [key]: e.target.files?.[0],
                      }))
                    }
                  />
                </div>
              ))}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Terminer"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <Link href="/connexion?redirect=/prestataire/registration" className="text-primary-600">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
