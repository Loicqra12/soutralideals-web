"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesByPole } from "@/lib/hooks/useCategories";
import { createFreelance } from "@/lib/api/freelances";
import { useAuthStore } from "@/stores";
import { useFreelanceGuard } from "@/lib/hooks/useFreelanceGuard";

const EXPERIENCE_LEVELS = ["Débutant", "Intermédiaire", "Expert"];
const AVAILABILITY = ["Disponible", "Occupé", "En pause"];

export default function FreelanceInscriptionFormPage() {
  const router = useRouter();
  const { ready, isLoading: guardLoading } = useFreelanceGuard();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);
  const { data: categories } = useCategoriesByPole("freelance");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    job: "",
    category: "",
    location: "",
    phoneNumber: "",
    hourlyRate: "",
    description: "",
    experienceLevel: "Intermédiaire",
    availabilityStatus: "Disponible",
    workingHours: "Temps plein",
    skills: "",
  });
  const [files, setFiles] = useState<{
    profileImage?: File;
    cni1?: File;
    cni2?: File;
  }>({});

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError("");
    if (!utilisateur?._id) {
      router.push("/connexion?redirect=/freelance/inscription/formulaire");
      return;
    }
    if (!form.name || !form.job || !form.category || !form.location || !form.hourlyRate) {
      setError("Remplissez tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await createFreelance(
        {
          utilisateur: utilisateur._id,
          name: form.name,
          job: form.job,
          category: form.category,
          hourlyRate: Number(form.hourlyRate),
          location: form.location,
          phoneNumber: form.phoneNumber || utilisateur.telephone,
          description: form.description,
          experienceLevel: form.experienceLevel,
          availabilityStatus: form.availabilityStatus,
          workingHours: form.workingHours,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        files,
      );
      await refreshRoles();
      router.push("/freelance");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  };

  if (guardLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="h-48 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= step ? "bg-blue-500" : "bg-neutral-200"}`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Profil freelance"}
            {step === 2 && "Tarifs & disponibilité"}
            {step === 3 && "Documents"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <Input
                placeholder="Nom complet *"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <Input
                placeholder="Titre professionnel * (ex. Développeur web)"
                value={form.job}
                onChange={(e) => update("job", e.target.value)}
              />
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm"
                required
              >
                <option value="">Catégorie *</option>
                {(categories ?? []).map((c) => (
                  <option key={c._id} value={c.nomcategorie}>
                    {c.nomcategorie}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Ville / localisation *"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
              />
              <Input
                placeholder="Téléphone"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
              />
              <textarea
                placeholder="Bio / description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <Button className="w-full" onClick={() => setStep(2)}>
                Continuer
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                type="number"
                placeholder="Tarif horaire (FCFA) *"
                value={form.hourlyRate}
                onChange={(e) => update("hourlyRate", e.target.value)}
              />
              <Input
                placeholder="Compétences (séparées par des virgules)"
                value={form.skills}
                onChange={(e) => update("skills", e.target.value)}
              />
              <select
                value={form.experienceLevel}
                onChange={(e) => update("experienceLevel", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm"
              >
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={form.availabilityStatus}
                onChange={(e) => update("availabilityStatus", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm"
              >
                {AVAILABILITY.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
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
                Photo et pièces d&apos;identité (recommandé pour la vérification).
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, profileImage: e.target.files?.[0] }))
                }
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, cni1: e.target.files?.[0] }))
                }
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, cni2: e.target.files?.[0] }))
                }
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Retour
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Créer mon profil"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm">
        <Link href="/freelance/inscription" className="text-primary-600">
          Retour
        </Link>
      </p>
    </div>
  );
}
