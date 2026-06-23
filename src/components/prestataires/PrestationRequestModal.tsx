"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPrestation } from "@/lib/api/prestations";
import { useAuthStore } from "@/stores";

export function PrestationRequestModal({
  open,
  onClose,
  prestataireId,
  serviceId,
  prestataireName,
}: {
  open: boolean;
  onClose: () => void;
  prestataireId: string;
  serviceId?: string;
  prestataireName: string;
}) {
  const router = useRouter();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [datePrestation, setDatePrestation] = useState("");
  const [notesClient, setNotesClient] = useState("");
  const [telephoneUrgence, setTelephoneUrgence] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated || !utilisateur?._id) {
      router.push(
        `/connexion?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    if (!adresse.trim() || !ville.trim()) {
      setError("L'adresse et la ville sont obligatoires.");
      return;
    }

    setLoading(true);
    try {
      await createPrestation({
        utilisateur: utilisateur._id,
        prestataire: prestataireId,
        service: serviceId,
        adresse: adresse.trim(),
        ville: ville.trim(),
        datePrestation: datePrestation || undefined,
        notesClient: notesClient.trim() || undefined,
        description: notesClient.trim() || `Demande pour ${prestataireName}`,
        telephoneUrgence: telephoneUrgence.trim() || undefined,
      });
      setSuccess(true);
    } catch {
      setError("Impossible d'envoyer la demande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prestation-modal-title"
    >
      <Card className="relative w-full max-w-md">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-500 hover:bg-neutral-100"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
        <CardHeader>
          <CardTitle id="prestation-modal-title">Demander un devis</CardTitle>
          <p className="text-sm text-neutral-600">{prestataireName}</p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <p className="text-neutral-700">
                Votre demande a été envoyée. Le prestataire vous contactera
                bientôt.
              </p>
              <Button className="w-full" onClick={onClose}>
                Fermer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <Input
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Quartier, rue, repères..."
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Ville <span className="text-red-500">*</span>
                </label>
                <Input
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="Abidjan, Bouaké..."
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Date souhaitée
                </label>
                <Input
                  type="date"
                  value={datePrestation}
                  onChange={(e) => setDatePrestation(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Détails de la demande
                </label>
                <textarea
                  value={notesClient}
                  onChange={(e) => setNotesClient(e.target.value)}
                  rows={3}
                  className="flex w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  placeholder="Décrivez votre besoin..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Téléphone de contact
                </label>
                <Input
                  value={telephoneUrgence}
                  onChange={(e) => setTelephoneUrgence(e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer la demande"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
