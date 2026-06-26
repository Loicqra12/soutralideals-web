import { freelanceMetadata } from "@/lib/seo/entityMetadata";
import FreelanceDetailClient from "./FreelanceDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return freelanceMetadata(id);
}

export default function FreelanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <FreelanceDetailClient params={params} />;
}
