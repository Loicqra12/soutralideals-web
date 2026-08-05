import apiClient from "./client";
import type { Article } from "@/types";

export async function fetchArticles(params?: {
  vendeur?: string;
  categorie?: string;
}): Promise<Article[]> {
  const { data } = await apiClient.get<Article[]>("/articles", { params });
  return data;
}

export async function fetchArticleById(id: string): Promise<Article> {
  const { data } = await apiClient.get<Article>(`/article/${id}`);
  return data;
}

export async function createArticle(formData: FormData): Promise<Article> {
  const { data } = await apiClient.post<Article>("/article", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateArticle(
  id: string,
  formData: FormData,
): Promise<Article> {
  const { data } = await apiClient.put<Article>(`/article/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  await apiClient.delete(`/article/${id}`);
}
