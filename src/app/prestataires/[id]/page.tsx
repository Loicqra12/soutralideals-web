import { prestataireMetadata } from "@/lib/seo/entityMetadata";
import PrestataireDetailClient from "./PrestataireDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return prestataireMetadata(id);
}

export default function PrestataireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PrestataireDetailClient params={params} />;
}
