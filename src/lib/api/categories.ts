import apiClient from "./client";
import type { Categorie } from "@/types";
import { matchesGroupe } from "@/lib/utils/filters";

function getGroupeName(categorie: Categorie): string | undefined {
  if (typeof categorie.groupe === "string") return categorie.groupe;
  return categorie.groupe?.nomgroupe;
}

// Cache mémoire léger — évite les appels en double pendant la même session
let _categoriesCache: Categorie[] | null = null;

export async function fetchCategories(): Promise<Categorie[]> {
  if (_categoriesCache) return _categoriesCache;
  const { data } = await apiClient.get<Categorie[]>("/categorie");
  _categoriesCache = data;
  return data;
}

export async function fetchCategoriesByGroupe(
  groupeName: string,
): Promise<Categorie[]> {
  const categories = await fetchCategories();
  return categories.filter((cat) =>
    matchesGroupe(getGroupeName(cat), groupeName),
  );
}

export function clearCategoriesCache() {
  _categoriesCache = null;
}

export async function fetchServices() {
  const { data } = await apiClient.get("/service");
  return data;
}

export async function checkHealth(): Promise<boolean> {
  try {
    await apiClient.get("/health");
    return true;
  } catch {
    return false;
  }
}
