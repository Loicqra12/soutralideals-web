"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, ShoppingCart, Star, BadgeCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useArticleById } from "@/lib/hooks/useArticleById";
import { useCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/stores";
import { getVendeurId } from "@/types/cart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EntityImage } from "@/components/shared/EntityImage";
import { telHref, whatsappHref } from "@/lib/utils/contact";
import { formatPriceFCFA } from "@/lib/utils/format";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { JsonLd } from "@/components/shared/JsonLd";
import { SimilarArticles } from "@/components/emarche/SimilarArticles";
import type { Vendeur } from "@/types";

function getVendeurContact(vendeur?: string | Vendeur) {
  if (!vendeur || typeof vendeur === "string") return {};
  const user = typeof vendeur.utilisateur === "object" ? vendeur.utilisateur : undefined;
  const phone = vendeur.businessPhone ?? user?.telephone ?? undefined;
  const whatsapp = vendeur.socialMedia?.whatsapp ?? phone;
  return { phone, whatsapp, shopName: vendeur.shopName };
}

export default function ArticleDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: article, isLoading, error } = useArticleById(id);
  const { addItem } = useCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [adding, setAdding] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 h-8 w-32 animate-pulse rounded-lg bg-neutral-200" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-neutral-200" />
          <div className="space-y-5">
            <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-10 w-1/3 animate-pulse rounded bg-neutral-200" />
            <div className="h-24 animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-lg text-neutral-600">Article introuvable.</p>
        <Button className="mt-4" asChild>
          <Link href="/emarche">Retour à l&apos;E-marché</Link>
        </Button>
      </div>
    );
  }

  const { phone, whatsapp, shopName } = getVendeurContact(article.vendeur);
  const phoneLink = telHref(phone);
  const waLink = whatsappHref(whatsapp, `Bonjour, je suis intéressé par votre produit "${article.nomArticle}" sur Soutrali Deals.`);
  const inStock = article.quantiteArticle == null || article.quantiteArticle > 0;

  const handleAddToCart = async () => {
    setCartMsg("");
    if (!isAuthenticated) {
      router.push(`/connexion?redirect=/emarche/${id}`);
      return;
    }
    const vendeurId = getVendeurId(article.vendeur);
    if (!article._id || !vendeurId) {
      setCartMsg("Vendeur introuvable pour ce produit.");
      return;
    }
    setAdding(true);
    try {
      await addItem.mutateAsync({ articleId: article._id, vendeurId, quantite: 1 });
      setCartMsg("Produit ajouté au panier !");
    } catch (e) {
      setCartMsg(e instanceof Error ? e.message : "Impossible d'ajouter au panier.");
    } finally {
      setAdding(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: article.nomArticle,
    description: article.description,
    ...(article.photoArticle && { image: [article.photoArticle] }),
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
      price: article.prixArticle,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: shopName ?? "Soutrali Deals" },
    },
    ...(article.rating && article.rating > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: article.rating, bestRating: 5, reviewCount: 1 },
    }),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/emarche">
            <ArrowLeft className="mr-2 h-4 w-4" /> E-marché
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible" className="overflow-hidden rounded-2xl">
            <EntityImage
              src={article.photoArticle}
              alt={article.nomArticle}
              className="aspect-square w-full rounded-2xl"
              fallbackClassName="aspect-square w-full rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200"
            />
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
            {shopName && (
              <p className="text-sm font-medium text-neutral-500">
                Par <span className="text-neutral-700">{shopName}</span>
              </p>
            )}

            <h1 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">
              {article.nomArticle}
            </h1>

            {article.rating != null && article.rating > 0 && (
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(article.rating!) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`}
                  />
                ))}
                <span className="ml-1 text-sm text-neutral-500">
                  {article.rating.toFixed(1)}
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-neutral-900">
              {formatPriceFCFA(article.prixArticle)}
            </p>

            <div className="flex flex-wrap gap-2">
              {inStock ? (
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" /> En stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-200">
                  Rupture de stock
                </Badge>
              )}
              {article.quantiteArticle != null && inStock && (
                <Badge variant="outline">
                  {article.quantiteArticle} disponible{article.quantiteArticle > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            {article.description && (
              <p className="leading-relaxed text-neutral-600">{article.description}</p>
            )}

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock || adding}
              >
                {adding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours…
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {inStock ? "Ajouter au panier" : "Indisponible"}
                  </>
                )}
              </Button>

              {cartMsg && (
                <p
                  className={`text-center text-sm ${cartMsg.includes("ajouté") ? "text-emerald-600" : "text-red-600"}`}
                >
                  {cartMsg}
                </p>
              )}

              {phoneLink && (
                <Button className="w-full" variant="outline" size="lg" asChild>
                  <a href={phoneLink}>
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler le vendeur
                  </a>
                </Button>
              )}

              {waLink && (
                <Button
                  className="w-full bg-[#25D366] text-white hover:bg-[#20bd5a]"
                  size="lg"
                  asChild
                >
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <SimilarArticles currentId={article._id} categorie={article.categorie} />
    </div>
    </>
  );
}
