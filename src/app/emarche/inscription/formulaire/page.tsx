"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesByPole } from "@/lib/hooks/useCategories";
import { createVendeur } from "@/lib/api/vendeurs";
import { useAuthStore } from "@/stores";
import { useVendeurGuard } from "@/lib/hooks/useVendeurGuard";

const BUSINESS_TYPES = ["Particulier", "Entreprise", "Auto-entrepreneur"];

export default function EmarcheInscriptionFormPage() {
  const router = useRouter();
  const { ready, isLoading: guardLoading } = useVendeurGuard();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const refreshRoles = useAuthStore((s) => s.refreshRoles);
  const { data: categories } = useCategoriesByPole("emarche");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [form, setForm] = useState({
    shopName: "",
    shopDescription: "",
    businessType: "Particulier",
    businessPhone: "",
    businessEmail: "",
    city: "",
    street: "",
    returnPolicy: "",
    paymentMethod: "orange_money",
  });
  const [files, setFiles] = useState<{
    shopLogo?: File;
    cni1?: File;
    cni2?: File;
  }>({});

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handleSubmit = async () => {
    setError("");
    if (!utilisateur?._id) {
      router.push("/connexion?redirect=/emarche/inscription/formulaire");
      return;
    }
    if (
      !form.shopName ||
      !form.shopDescription ||
      form.shopDescription.length < 20 ||
      !selectedCategories.length ||
      !form.city
    ) {
      setError(
        "Nom boutique, description (min. 20 car.), catégorie et ville sont obligatoires.",
      );
      return;
    }

    setLoading(true);
    try {
      await createVendeur(
        {
          utilisateur: utilisateur._id,
          shopName: form.shopName,
          shopDescription: form.shopDescription,
          businessType: form.businessType,
          businessCategories: selectedCategories,
          businessPhone: form.businessPhone || utilisateur.telephone,
          businessEmail: form.businessEmail || utilisateur.email,
          returnPolicy: form.returnPolicy || "Retours sous 7 jours",
          businessAddress: {
            street: form.street,
            city: form.city,
            country: "Côte d'Ivoire",
          },
          paymentMethods: [form.paymentMethod],
          preferredContactMethod: "Phone",
        },
        files,
      );
      await refreshRoles();
      router.push("/emarche");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ouverture boutique impossible.");
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
            className={`h-2 flex-1 rounded-full ${s <= step ? "bg-purple-500" : "bg-neutral-200"}`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Votre boutique"}
            {step === 2 && "Contact & livraison"}
            {step === 3 && "Logo & documents"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <Input
                placeholder="Nom de la boutique *"
                value={form.shopName}
                onChange={(e) => update("shopName", e.target.value)}
              />
              <select
                value={form.businessType}
                onChange={(e) => update("businessType", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm"
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div>
                <p className="mb-2 text-sm font-medium">Catégories *</p>
                <div className="flex flex-wrap gap-2">
                  {(categories ?? []).map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => toggleCategory(c.nomcategorie)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        selectedCategories.includes(c.nomcategorie)
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-200"
                      }`}
                    >
                      {c.nomcategorie}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Description de la boutique * (min. 20 caractères)"
                value={form.shopDescription}
                onChange={(e) => update("shopDescription", e.target.value)}
                rows={4}
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
                placeholder="Téléphone boutique"
                value={form.businessPhone}
                onChange={(e) => update("businessPhone", e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email boutique"
                value={form.businessEmail}
                onChange={(e) => update("businessEmail", e.target.value)}
              />
              <Input
                placeholder="Ville *"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <Input
                placeholder="Adresse / quartier"
                value={form.street}
                onChange={(e) => update("street", e.target.value)}
              />
              <select
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm"
              >
                <option value="orange_money">Orange Money</option>
                <option value="mtn_money">MTN Money</option>
                <option value="moov_money">Moov Money</option>
                <option value="wave_money">Wave</option>
              </select>
              <textarea
                placeholder="Politique de retour"
                value={form.returnPolicy}
                onChange={(e) => update("returnPolicy", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
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
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFiles((p) => ({ ...p, shopLogo: e.target.files?.[0] }))
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
                  {loading ? "Création..." : "Ouvrir ma boutique"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm">
        <Link href="/emarche/inscription" className="text-primary-600">
          Retour
        </Link>
      </p>
    </div>
  );
}
