"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/auth/AuthLayout";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <AuthLayout variant="connexion" title="Lien invalide" subtitle="">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm text-neutral-600">
            Ce lien est invalide ou a expiré. Faites une nouvelle demande.
          </p>
          <Button className="w-full rounded-xl" asChild>
            <Link href="/mot-de-passe-oublie">Nouvelle demande</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout
        variant="connexion"
        title="Mot de passe mis à jour"
        subtitle="Vous pouvez maintenant vous connecter"
      >
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <p className="text-sm text-neutral-600">
            Votre mot de passe a été réinitialisé avec succès.
          </p>
          <Button
            className="mt-2 w-full rounded-xl"
            onClick={() => router.push("/connexion")}
          >
            Se connecter
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      variant="connexion"
      title="Nouveau mot de passe"
      subtitle="Choisissez un mot de passe sécurisé"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Nouveau mot de passe
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            minLength={6}
            required
          />
          <p className="mt-1 text-xs text-neutral-400">Minimum 6 caractères</p>
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            Confirmer le mot de passe
          </label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            required
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-base font-semibold"
          disabled={loading}
        >
          {loading ? "Mise à jour..." : "Enregistrer le mot de passe"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
