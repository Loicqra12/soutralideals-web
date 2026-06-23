"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores";

export default function InscriptionPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.telephone) {
      setError("Le numéro de téléphone est obligatoire.");
      return;
    }
    try {
      await register({
        ...form,
        email: form.email || undefined,
      });
      router.push("/");
    } catch {
      setError("Inscription impossible. Vérifiez vos informations.");
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Prénom</label>
                <Input value={form.prenom} onChange={(e) => update("prenom", e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Nom</label>
                <Input value={form.nom} onChange={(e) => update("nom", e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.telephone}
                onChange={(e) => update("telephone", e.target.value)}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mot de passe</label>
              <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription..." : "Créer mon compte"}
            </Button>
          </form>

          <Button variant="outline" className="mt-4 w-full" disabled title="Bientôt disponible">
            Continuer avec Google
          </Button>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-medium text-primary-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
