"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyPrestataire } from "@/lib/hooks/useMyPrestataire";
import { updatePrestataire } from "@/lib/api/prestataires";

export default function PrestataireProfil() {
  const { data: profile, isLoading } = useMyPrestataire();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    description: "",
    prixprestataire: "",
    tarifHoraireMin: "",
    tarifHoraireMax: "",
    localisation: "",
    anneeExperience: "",
    rayonIntervention: "",
  });
  const [specialite, setSpecialite] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");
  const [zoneIntervention, setZoneIntervention] = useState<string[]>([]);
  const [newZone, setNewZone] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      description: profile.description ?? "",
      prixprestataire: profile.prixprestataire?.toString() ?? "",
      tarifHoraireMin: profile.tarifHoraireMin?.toString() ?? "",
      tarifHoraireMax: profile.tarifHoraireMax?.toString() ?? "",
      localisation: profile.localisation ?? profile.ville ?? "",
      anneeExperience: profile.anneeExperience ?? "",
      rayonIntervention: profile.rayonIntervention?.toString() ?? "",
    });
    setSpecialite(profile.specialite ?? []);
    setZoneIntervention(profile.zoneIntervention ?? []);
  }, [profile]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: () =>
      updatePrestataire(profile!._id, {
        description: form.description || undefined,
        prixprestataire: form.prixprestataire ? Number(form.prixprestataire) : undefined,
        tarifHoraireMin: form.tarifHoraireMin ? Number(form.tarifHoraireMin) : undefined,
        tarifHoraireMax: form.tarifHoraireMax ? Number(form.tarifHoraireMax) : undefined,
        localisation: form.localisation || undefined,
        anneeExperience: form.anneeExperience || undefined,
        rayonIntervention: form.rayonIntervention ? Number(form.rayonIntervention) : undefined,
        specialite: specialite.length ? specialite : undefined,
        zoneIntervention: zoneIntervention.length ? zoneIntervention : undefined,
      }),
    onSuccess: () => {
      toast.success("Profil mis à jour !");
      queryClient.invalidateQueries({ queryKey: ["my-prestataire"] });
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
        <p>Aucun profil prestataire trouvé.</p>
        <Button className="mt-4" asChild>
          <Link href="/prestataire/inscription">Créer mon profil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/prestataire/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Tableau de bord
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-neutral-900">Modifier mon profil</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Présentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={5}
                placeholder="Décrivez votre activité, vos compétences, votre expérience…"
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Localisation / Ville</label>
                <Input
                  value={form.localisation}
                  onChange={(e) => update("localisation", e.target.value)}
                  placeholder="Ex: Abidjan, Cocody"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Années d&apos;expérience
                </label>
                <Input
                  value={form.anneeExperience}
                  onChange={(e) => update("anneeExperience", e.target.value)}
                  placeholder="Ex: 5 ans"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Tarif global (FCFA)</label>
              <Input
                type="number"
                value={form.prixprestataire}
                onChange={(e) => update("prixprestataire", e.target.value)}
                placeholder="Ex: 10000"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tarif horaire min (FCFA)
                </label>
                <Input
                  type="number"
                  value={form.tarifHoraireMin}
                  onChange={(e) => update("tarifHoraireMin", e.target.value)}
                  placeholder="Ex: 5000"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tarif horaire max (FCFA)
                </label>
                <Input
                  type="number"
                  value={form.tarifHoraireMax}
                  onChange={(e) => update("tarifHoraireMax", e.target.value)}
                  placeholder="Ex: 15000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spécialités</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {specialite.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => setSpecialite((p) => p.filter((x) => x !== s))}
                    className="text-neutral-400 hover:text-red-500"
                    aria-label={`Supprimer ${s}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSpec.trim()) {
                    e.preventDefault();
                    setSpecialite((p) => [...new Set([...p, newSpec.trim()])]);
                    setNewSpec("");
                  }
                }}
                placeholder="Ajouter une spécialité…"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newSpec.trim()) {
                    setSpecialite((p) => [...new Set([...p, newSpec.trim()])]);
                    setNewSpec("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zones d&apos;intervention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {zoneIntervention.map((z) => (
                <span
                  key={z}
                  className="flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                >
                  {z}
                  <button
                    type="button"
                    onClick={() => setZoneIntervention((p) => p.filter((x) => x !== z))}
                    className="text-primary-400 hover:text-red-500"
                    aria-label={`Supprimer ${z}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newZone.trim()) {
                    e.preventDefault();
                    setZoneIntervention((p) => [...new Set([...p, newZone.trim()])]);
                    setNewZone("");
                  }
                }}
                placeholder="Ex: Cocody, Plateau…"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newZone.trim()) {
                    setZoneIntervention((p) => [...new Set([...p, newZone.trim()])]);
                    setNewZone("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Rayon d&apos;intervention (km)
              </label>
              <Input
                type="number"
                value={form.rayonIntervention}
                onChange={(e) => update("rayonIntervention", e.target.value)}
                placeholder="Ex: 20"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={() => save()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement…
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
}
