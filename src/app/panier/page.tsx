"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/stores";
import { formatPriceFCFA } from "@/lib/utils/format";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  "En cours": { label: "En cours", color: "text-amber-600 bg-amber-50" },
  "Confirmée": { label: "Confirmée", color: "text-blue-600 bg-blue-50" },
  "En préparation": { label: "En préparation", color: "text-blue-600 bg-blue-50" },
  "Expédiée": { label: "Expédiée", color: "text-purple-600 bg-purple-50" },
  "Livrée": { label: "Livrée", color: "text-emerald-600 bg-emerald-50" },
  "Annulée": { label: "Annulée", color: "text-red-600 bg-red-50" },
};

export default function PanierPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { cart, isLoading, itemCount, updateQuantity, removeItem, setAddress, checkout } = useCart();

  const [address, setAddressForm] = useState({
    adresse: "",
    ville: "",
    telephone: "",
    pays: "Côte d'Ivoire",
  });
  const [orderDone, setOrderDone] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-neutral-300" />
        <p className="mt-4 text-lg font-semibold text-neutral-900">Panier vide</p>
        <p className="mt-2 text-neutral-500">Connectez-vous pour voir votre panier.</p>
        <Button className="mt-6" asChild>
          <Link href="/connexion?redirect=/panier">Se connecter</Link>
        </Button>
      </div>
    );
  }

  const handleQuantityChange = (itemId: string, val: number) => {
    if (val < 1) return;
    updateQuantity.mutate(
      { itemId, quantite: val },
      {
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Impossible de mettre à jour"),
      },
    );
  };

  const handleRemove = (itemId: string, name: string) => {
    removeItem.mutate(itemId, {
      onSuccess: () => toast.success(`"${name}" retiré du panier`),
      onError: (e) =>
        toast.error(e instanceof Error ? e.message : "Erreur lors de la suppression"),
    });
  };

  const handleCheckout = async () => {
    if (!address.adresse.trim() || !address.ville.trim() || !address.telephone.trim()) {
      toast.error("Renseignez l'adresse de livraison complète.");
      return;
    }
    const toastId = toast.loading("Validation de la commande…");
    try {
      await setAddress.mutateAsync(address);
      await checkout.mutateAsync({ moyenPaiement: "MOBILE_MONEY" });
      toast.success("Commande passée avec succès !", { id: toastId });
      setOrderDone(true);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Commande impossible pour le moment.",
        { id: toastId },
      );
    }
  };

  if (orderDone) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
        </motion.div>
        <h2 className="mt-6 text-2xl font-bold text-neutral-900">Commande envoyée !</h2>
        <p className="mt-3 text-neutral-500">
          Le vendeur vous contactera pour la livraison. Vous pouvez suivre vos
          commandes dans votre historique.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => router.push("/commandes")}>Voir mes commandes</Button>
          <Button variant="outline" onClick={() => router.push("/emarche")}>
            Continuer mes achats
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/emarche">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continuer mes achats
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-neutral-900">Mon panier</h1>
        <p className="mt-1 text-neutral-500">
          {itemCount > 0
            ? `${itemCount} article${itemCount > 1 ? "s" : ""}`
            : "Votre panier est vide"}
        </p>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200" />
            ))}
          </div>
        ) : !cart?.articles?.length ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-neutral-200" />
            <p className="mt-4 text-lg font-semibold text-neutral-900">
              Votre panier est vide
            </p>
            <Button className="mt-6" asChild>
              <Link href="/emarche">Découvrir l&apos;E-marché</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Articles */}
            <div className="space-y-4 lg:col-span-2">
              <AnimatePresence initial={false}>
                {cart.articles.map((item) => {
                  const itemId = item._id ?? "";
                  const name =
                    item.nomArticle ??
                    (typeof item.article === "object" ? item.article?.nomArticle : "Produit") ??
                    "Produit";
                  const total = (item.prixUnitaire ?? 0) * (item.quantite ?? 1);

                  return (
                    <motion.div
                      key={itemId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-4 p-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {item.imageArticle ? (
                            <Image
                              src={item.imageArticle}
                              alt={name}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={item.imageArticle.startsWith("http")}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-neutral-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col gap-1">
                          <p className="font-medium text-neutral-900">{name}</p>
                          <p className="text-sm text-neutral-500">
                            {formatPriceFCFA(item.prixUnitaire ?? 0)} / unité
                          </p>
                        </div>

                        {/* Quantity stepper */}
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-l-lg text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-40"
                            disabled={updateQuantity.isPending || (item.quantite ?? 1) <= 1}
                            onClick={() => handleQuantityChange(itemId, (item.quantite ?? 1) - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantite ?? 1}
                          </span>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-r-lg text-neutral-600 transition-colors hover:bg-neutral-200 disabled:opacity-40"
                            disabled={updateQuantity.isPending}
                            onClick={() => handleQuantityChange(itemId, (item.quantite ?? 1) + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="w-24 text-right text-sm font-semibold text-neutral-900">
                          {formatPriceFCFA(total)}
                        </p>

                        <button
                          className="ml-1 text-neutral-400 transition-colors hover:text-red-500"
                          onClick={() => handleRemove(itemId, name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order summary + address */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {/* Address */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-neutral-900">Adresse de livraison</h2>
                <div className="space-y-3">
                  <Input
                    placeholder="Adresse *"
                    value={address.adresse}
                    onChange={(e) => setAddressForm((p) => ({ ...p, adresse: e.target.value }))}
                  />
                  <Input
                    placeholder="Ville *"
                    value={address.ville}
                    onChange={(e) => setAddressForm((p) => ({ ...p, ville: e.target.value }))}
                  />
                  <Input
                    placeholder="Téléphone *"
                    value={address.telephone}
                    onChange={(e) => setAddressForm((p) => ({ ...p, telephone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 font-semibold text-neutral-900">Récapitulatif</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Sous-total</span>
                    <span>{formatPriceFCFA(cart.montantArticles ?? 0)}</span>
                  </div>
                  {(cart.fraisLivraison ?? 0) > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Livraison</span>
                      <span>{formatPriceFCFA(cart.fraisLivraison!)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-bold text-neutral-900">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {formatPriceFCFA(cart.montantTotal ?? cart.montantArticles ?? 0)}
                    </span>
                  </div>
                </div>

                <Button
                  className="mt-5 w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={checkout.isPending || setAddress.isPending}
                >
                  {checkout.isPending || setAddress.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement…
                    </>
                  ) : (
                    "Commander"
                  )}
                </Button>

                <p className="mt-3 text-center text-xs text-neutral-400">
                  Paiement à la livraison ou Mobile Money
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
