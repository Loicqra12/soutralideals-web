"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/auth/AuthLayout";
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
    <AuthLayout
      variant="inscription"
      title="Créer un compte"
      subtitle="Rejoignez des milliers d'utilisateurs en Côte d'Ivoire"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prenom" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Prénom
            </label>
            <Input
              id="prenom"
              value={form.prenom}
              onChange={(e) => update("prenom", e.target.value)}
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
              required
            />
          </div>
          <div>
            <label htmlFor="nom" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Nom
            </label>
            <Input
              id="nom"
              value={form.nom}
              onChange={(e) => update("nom", e.target.value)}
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="votre@email.com"
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
          />
        </div>
        <div>
          <label htmlFor="telephone" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <Input
            id="telephone"
            value={form.telephone}
            onChange={(e) => update("telephone", e.target.value)}
            placeholder="+225 07 00 00 00 00"
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
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
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "Créer mon compte"}
        </Button>
      </form>

      <Button
        variant="outline"
        className="mt-4 h-11 w-full rounded-xl border-neutral-200"
        disabled
        title="Bientôt disponible"
      >
        Continuer avec Google
      </Button>

      <p className="mt-8 text-center text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
