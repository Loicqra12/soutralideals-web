"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores";
import { updateProfilePhoto } from "@/lib/api/utilisateurs";
import { getRoleLabel } from "@/lib/auth/roleLabels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GENRE_OPTIONS = ["Homme", "Femme", "Autre"];

function getInitials(prenom?: string, nom?: string): string {
  const p = prenom?.charAt(0).toUpperCase() ?? "";
  const n = nom?.charAt(0).toUpperCase() ?? "";
  return p + n || "?";
}

export function ProfileForm() {
  const { utilisateur, roles, activeRole, switchRole, updateProfile } =
    useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    genre: "",
  });
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!utilisateur) return;
    setForm({
      nom: utilisateur.nom ?? "",
      prenom: utilisateur.prenom ?? "",
      email: utilisateur.email ?? "",
      telephone: utilisateur.telephone ?? "",
      genre: utilisateur.genre ?? "",
    });
    setPhotoUrl(utilisateur.photoProfil);
  }, [utilisateur]);

  if (!utilisateur) return null;

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await updateProfile({
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim() || undefined,
        telephone: form.telephone.trim(),
        genre: form.genre || undefined,
      });
      setSuccess("Profil mis à jour.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Mise à jour impossible.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    setUploadingPhoto(true);
    try {
      const updated = await updateProfilePhoto(file);
      setPhotoUrl(updated.photoProfil);
      useAuthStore.setState({ utilisateur: updated });
      setSuccess("Photo de profil mise à jour.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo non enregistrée.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              {photoUrl ? (
                <AvatarImage src={photoUrl} alt="" />
              ) : (
                <AvatarFallback className="bg-primary-100 text-lg text-primary-700">
                  {getInitials(form.prenom, form.nom)}
                </AvatarFallback>
              )}
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50"
              aria-label="Changer la photo"
            >
              {uploadingPhoto ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">
              {form.prenom} {form.nom}
            </p>
            <p className="text-sm text-neutral-500">
              {form.email || form.telephone || "Compte Soutrali Deals"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Prénom</label>
              <Input
                value={form.prenom}
                onChange={(e) => update("prenom", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nom</label>
              <Input
                value={form.nom}
                onChange={(e) => update("nom", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Téléphone</label>
            <Input
              value={form.telephone}
              onChange={(e) => update("telephone", e.target.value)}
              placeholder="+225 07 00 00 00 00"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Genre</label>
            <select
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <option value="">Non renseigné</option>
              {GENRE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-primary-700" role="status">
              {success}
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>

        <div>
          <p className="mb-2 text-sm text-neutral-500">Mes rôles</p>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button key={role} type="button" onClick={() => switchRole(role)}>
                <Badge variant={role === activeRole ? "default" : "outline"}>
                  {getRoleLabel(role)}
                </Badge>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Cliquez sur un rôle pour changer votre mode d&apos;affichage.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href="/settings">Paramètres du compte</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
