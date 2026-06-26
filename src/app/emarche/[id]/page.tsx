import { articleMetadata } from "@/lib/seo/entityMetadata";
import ArticleDetailClient from "./ArticleDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return articleMetadata(id);
}

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ArticleDetailClient params={params} />;
}
