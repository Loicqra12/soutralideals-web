"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyFreelance } from "@/lib/hooks/useMyFreelance";
import { updateFreelance } from "@/lib/api/freelances";

const AVAILABILITY = ["Disponible", "Occupé", "En pause"];
const LEVELS = ["Débutant", "Intermédiaire", "Expert"];

export default function FreelanceProfil() {
  const { data: profile, isLoading } = useMyFreelance();
  const queryClient = useQueryClient();

  // Valeurs initiales dérivées du profil (pas de useEffect pour éviter les renders en cascade)
  const initialForm = useMemo(() => ({
    name: profile?.name ?? "",
    job: profile?.job ?? "",
    description: profile?.description ?? "",
    hourlyRate: (profile?.hourlyRate ?? profile?.tarif)?.toString() ?? "",
    location: profile?.location ?? profile?.ville ?? "",
    availabilityStatus: profile?.availabilityStatus ?? "Disponible",
    experienceLevel: profile?.experienceLevel ?? "Intermédiaire",
    workingHours: "",
  }), [profile?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [form, setForm] = useState(initialForm);
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? []);
  const [newSkill, setNewSkill] = useState("");

  const { mutate: save, isPending } = useMutation({
    mutationFn: () =>
      updateFreelance(profile!._id, {
        name: form.name || undefined,
        job: form.job || undefined,
        description: form.description || undefined,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        location: form.location || undefined,
        availabilityStatus: form.availabilityStatus || undefined,
        experienceLevel: form.experienceLevel || undefined,
        skills: skills.length ? skills : undefined,
      }),
    onSuccess: () => {
      toast.success("Profil mis à jour !");
      queryClient.invalidateQueries({ queryKey: ["my-freelance"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Mise à jour impossible."),
  });

  const update = (field: string, v: string) =>
    setForm((p) => ({ ...p, [field]: v }));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p>Aucun profil freelance trouvé.</p>
        <Button className="mt-4" asChild>
          <Link href="/freelance/inscription">Créer mon profil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/freelance/espace">
            <ArrowLeft className="mr-2 h-4 w-4" /> Mon espace freelance
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-neutral-900">Modifier mon profil</h1>

        <Card>
          <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Nom professionnel</label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Votre nom ou pseudo" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Titre / Poste</label>
                <Input value={form.job} onChange={(e) => update("job", e.target.value)} placeholder="Ex: Développeur Full-Stack" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                placeholder="Présentez-vous et décrivez vos services…"
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Localisation</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Ex: Abidjan" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tarif horaire (FCFA)</label>
                <Input type="number" value={form.hourlyRate} onChange={(e) => update("hourlyRate", e.target.value)} placeholder="Ex: 10000" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="availability-select"
                  className="mb-1 block text-sm font-medium"
                >
                  Disponibilité
                </label>
                <select
                  id="availability-select"
                  aria-label="Disponibilité"
                  value={form.availabilityStatus}
                  onChange={(e) => update("availabilityStatus", e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label
                  htmlFor="level-select"
                  className="mb-1 block text-sm font-medium"
                >
                  Niveau
                </label>
                <select
                  id="level-select"
                  aria-label="Niveau d'expérience"
                  value={form.experienceLevel}
                  onChange={(e) => update("experienceLevel", e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Compétences</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {s}
                  <button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))} aria-label={`Supprimer ${s}`} className="text-blue-400 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSkill.trim()) {
                    e.preventDefault();
                    setSkills((p) => [...new Set([...p, newSkill.trim()])]);
                    setNewSkill("");
                  }
                }}
                placeholder="Ajouter une compétence…"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => { if (newSkill.trim()) { setSkills((p) => [...new Set([...p, newSkill.trim()])]); setNewSkill(""); } }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={() => save()} disabled={isPending}>
          {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement…</>) : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}
