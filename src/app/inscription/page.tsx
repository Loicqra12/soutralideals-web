"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/stores";
import { sendOtp, verifyOtp } from "@/lib/api/otp";

type Step = "phone" | "code" | "form";

export default function InscriptionPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState<Step>("phone");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneVerificationToken, setPhoneVerificationToken] = useState("");
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSendOtp = async () => {
    setError("");
    if (!form.telephone.trim()) {
      setError("Entrez votre numéro de téléphone.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await sendOtp(form.telephone);
      if (res.telephone) update("telephone", res.telephone);
      setDevCodeHint(res.devCode ?? null);
      setStep("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi du code impossible.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otpCode.length < 6) {
      setError("Entrez le code à 6 chiffres.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await verifyOtp(form.telephone, otpCode);
      setPhoneVerificationToken(res.phoneVerificationToken);
      if (res.telephone) update("telephone", res.telephone);
      setStep("form");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Code incorrect.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phoneVerificationToken) {
      setError("Vérifiez votre numéro de téléphone avant de continuer.");
      setStep("phone");
      return;
    }
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    try {
      await register({
        ...form,
        email: form.email || undefined,
        phoneVerificationToken,
      });
      router.push("/");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Inscription impossible. Vérifiez vos informations.",
      );
    }
  };

  return (
    <AuthLayout
      variant="inscription"
      title="Créer un compte"
      subtitle={
        step === "phone"
          ? "Vérifiez votre numéro pour sécuriser votre compte"
          : step === "code"
            ? "Entrez le code reçu par SMS"
            : "Complétez votre profil"
      }
    >
      <div className="mb-4 flex gap-2">
        {(["phone", "code", "form"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              (step === "phone" && i === 0) ||
              (step === "code" && i <= 1) ||
              step === "form"
                ? "bg-primary-500"
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      {step === "phone" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="telephone" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Téléphone mobile <span className="text-red-500">*</span>
            </label>
            <Input
              id="telephone"
              value={form.telephone}
              onChange={(e) => update("telephone", e.target.value)}
              placeholder="07 00 00 00 00 ou +225..."
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
            />
          </div>
          {error && <ErrorBanner message={error} />}
          <Button
            type="button"
            className="h-11 w-full rounded-xl"
            onClick={handleSendOtp}
            disabled={otpLoading}
          >
            {otpLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Recevoir le code SMS"
            )}
          </Button>
        </div>
      )}

      {step === "code" && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Code envoyé au <strong>{form.telephone}</strong>
          </p>
          {devCodeHint && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Mode dev — code : <strong>{devCodeHint}</strong>
            </p>
          )}
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Code à 6 chiffres
            </label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 text-center text-lg tracking-widest focus:bg-white"
            />
          </div>
          {error && <ErrorBanner message={error} />}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-xl"
              onClick={() => setStep("phone")}
            >
              Retour
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 rounded-xl"
              onClick={handleVerifyOtp}
              disabled={otpLoading}
            >
              {otpLoading ? "Vérification..." : "Vérifier"}
            </Button>
          </div>
          <button
            type="button"
            className="w-full text-center text-sm text-primary-600 hover:underline"
            onClick={handleSendOtp}
            disabled={otpLoading}
          >
            Renvoyer le code
          </button>
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
            Téléphone vérifié : {form.telephone}
          </div>
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
              Email (optionnel)
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
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={6}
              className="h-11 rounded-xl border-neutral-200 bg-neutral-50 focus:bg-white"
              required
            />
            <p className="mt-1 text-xs text-neutral-500">Minimum 6 caractères</p>
          </div>
          {error && <ErrorBanner message={error} />}
          <Button
            type="submit"
            className="h-11 w-full rounded-xl text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Inscription..." : "Créer mon compte"}
          </Button>
        </form>
      )}

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

function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
    >
      {message}
    </motion.p>
  );
}
