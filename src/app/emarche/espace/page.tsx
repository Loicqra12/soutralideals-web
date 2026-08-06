"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package, ShoppingBag, Star, Store, Plus, Pencil, Trash2,
  X, Upload, Loader2, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProIcon, ProIconBox } from "@/components/prestataire/ProIcon";
import { useMyVendeur } from "@/lib/hooks/useMyVendeur";
import { useAuthStore } from "@/stores";
import {
  fetchArticles, createArticle, updateArticle, deleteArticle,
} from "@/lib/api/articles";
import { fetchCategories } from "@/lib/api/categories";
import { formatPriceFCFA } from "@/lib/utils/format";
import type { Article } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArticleForm {
  nomArticle: string;
  prixArticle: string;
  ancienPrixArticle: string;
  quantiteArticle: string;
  categorie: string;
  tags: string;
  isPromo: boolean;
}

const EMPTY_FORM: ArticleForm = {
  nomArticle: "", prixArticle: "", ancienPrixArticle: "",
  quantiteArticle: "", categorie: "", tags: "", isPromo: false,
};

// ─── Modale Article ──────────────────────────────────────────────────────────

function ArticleModal({
  article, vendeurId, onClose,
}: {
  article?: Article;
  vendeurId: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ArticleForm>(
    article
      ? {
          nomArticle: article.nomArticle ?? "",
          prixArticle: String(article.prixArticle ?? ""),
          ancienPrixArticle: String(article.ancienPrixArticle ?? ""),
          quantiteArticle: String(article.quantiteArticle ?? ""),
          categorie:
            typeof article.categorie === "object"
              ? (article.categorie?._id ?? "")
              : (article.categorie ?? ""),
          tags: (article.tags ?? []).join(", "),
          isPromo: article.isPromo ?? false,
        }
      : EMPTY_FORM,
  );
  const [preview, setPreview] = useState<string | null>(
    article?.photoArticle ?? null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("nomArticle", form.nomArticle);
      fd.append("prixArticle", form.prixArticle);
      if (form.ancienPrixArticle) fd.append("ancienPrixArticle", form.ancienPrixArticle);
      fd.append("quantiteArticle", form.quantiteArticle);
      fd.append("categorie", form.categorie);
      fd.append("vendeur", vendeurId);
      fd.append("tags", form.tags);
      fd.append("isPromo", String(form.isPromo));
      if (file) fd.append("photoArticle", file);
      return article ? updateArticle(article._id!, fd) : createArticle(fd);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success(article ? "Produit mis à jour" : "Produit ajouté");
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.nomArticle || !form.prixArticle || !form.categorie) {
      setError("Nom, prix et catégorie sont requis.");
      return;
    }
    if (!article && !file) {
      setError("Une photo est requise pour un nouveau produit.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {article ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Photo */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">
              Photo du produit {!article && <span className="text-red-500">*</span>}
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50"
            >
              {preview ? (
                <div className="relative h-full w-full">
                  <Image src={preview} alt="preview" fill className="object-cover" sizes="400px" unoptimized />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-neutral-400">
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Cliquer pour choisir</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.nomArticle}
              onChange={(e) => setForm((f) => ({ ...f, nomArticle: e.target.value }))}
              placeholder="Ex: Boubou brodé homme"
              className="rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number" min={0}
                value={form.prixArticle}
                onChange={(e) => setForm((f) => ({ ...f, prixArticle: e.target.value }))}
                placeholder="15000"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Ancien prix (optionnel)
              </label>
              <Input
                type="number" min={0}
                value={form.ancienPrixArticle}
                onChange={(e) => setForm((f) => ({ ...f, ancienPrixArticle: e.target.value }))}
                placeholder="20000"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Stock (quantité)
              </label>
              <Input
                type="number" min={0}
                value={form.quantiteArticle}
                onChange={(e) => setForm((f) => ({ ...f, quantiteArticle: e.target.value }))}
                placeholder="10"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categorie}
                onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm"
              >
                <option value="">Choisir…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.nomcategorie}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Tags (séparés par des virgules)
            </label>
            <Input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="mode, homme, brodé"
              className="rounded-xl"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.isPromo}
              onChange={(e) => setForm((f) => ({ ...f, isPromo: e.target.checked }))}
              className="rounded"
            />
            En promotion
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1 rounded-xl" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…</>
              ) : article ? "Mettre à jour" : "Publier"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EmarcheEspacePage() {
  const qc = useQueryClient();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const { data: shop, isLoading: shopLoading } = useMyVendeur();
  const { data: myArticles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles", { vendeur: shop?._id }],
    queryFn: () => fetchArticles({ vendeur: shop!._id }),
    enabled: Boolean(shop?._id),
    staleTime: 2 * 60 * 1000,
  });

  const [modal, setModal] = useState<"create" | Article | null>(null);

  const inStock = myArticles.filter((a) => (a.quantiteArticle ?? 0) > 0).length;

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Produit supprimé");
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const handleDelete = (article: Article) => {
    if (!confirm(`Supprimer "${article.nomArticle}" ?`)) return;
    deleteMut.mutate(article._id!);
  };

  if (shopLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-64 animate-pulse rounded-xl bg-neutral-200" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-neutral-600">Aucune boutique trouvée pour ce compte.</p>
        <Button className="mt-4" asChild>
          <Link href="/emarche/inscription">Ouvrir ma boutique</Link>
        </Button>
      </div>
    );
  }

  const shopName = shop.shopName ?? shop.nom ?? "Ma boutique";

  return (
    <>
      {modal && (
        <ArticleModal
          article={modal === "create" ? undefined : modal}
          vendeurId={shop._id!}
          onClose={() => setModal(null)}
        />
      )}

      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">
        {/* Header boutique */}
        <div className="mb-8 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">E-marché vendeur</p>
            <h1 className="mt-1 text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Bonjour{utilisateur?.prenom ? `, ${utilisateur.prenom}` : ""}
            </h1>
            <p className="mt-2 text-neutral-600">{shopName}</p>
            {shop.shopDescription && (
              <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{shop.shopDescription}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {shop.verifier && <Badge variant="outline">Boutique vérifiée</Badge>}
              {shop.ville && <Badge variant="outline">{shop.ville}</Badge>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Package, label: "Produits publiés", value: articlesLoading ? "…" : myArticles.length },
            { icon: Store, label: "En stock", value: articlesLoading ? "…" : inStock },
            { icon: Star, label: "Note boutique", value: shop.rating && shop.rating > 0 ? shop.rating.toFixed(1) : "—" },
          ].map(({ icon, label, value }) => (
            <Card key={label} className="border-neutral-200 shadow-sm">
              <CardContent className="flex items-center gap-3 p-5">
                <ProIconBox><ProIcon icon={icon} size={18} /></ProIconBox>
                <div>
                  <p className="text-xs text-neutral-500">{label}</p>
                  <p className="text-lg font-semibold text-neutral-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Produits CRUD */}
        <Card className="border-neutral-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Mes produits</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/boutique/${shop._id}`}>
                  <ShoppingBag className="mr-1 h-4 w-4" /> Ma boutique
                </Link>
              </Button>
              <Button size="sm" onClick={() => setModal("create")}>
                <Plus className="mr-1 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-100" />)}
              </div>
            ) : myArticles.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <Package className="h-10 w-10 text-neutral-200" />
                <p className="text-sm text-neutral-500">Aucun produit encore. Ajoutez votre premier produit.</p>
                <Button size="sm" onClick={() => setModal("create")}>
                  <Plus className="mr-1 h-4 w-4" /> Ajouter un produit
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {myArticles.map((article) => (
                  <li key={article._id} className="flex items-center gap-3 py-3">
                    {article.photoArticle ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={article.photoArticle}
                          alt={article.nomArticle ?? ""}
                          fill className="object-cover" sizes="48px" unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <Package className="h-5 w-5 text-neutral-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900">{article.nomArticle}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                        <span>{formatPriceFCFA(article.prixArticle ?? 0)}</span>
                        <span>·</span>
                        <span>Stock : {article.quantiteArticle ?? 0}</span>
                        {article.isPromo && <Badge variant="outline" className="text-xs">Promo</Badge>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => setModal(article)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(article)}
                        disabled={deleteMut.isPending}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
