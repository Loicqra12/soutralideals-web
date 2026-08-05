import { CardSkeletonGrid } from "@/components/shared/CardSkeleton";

export default function FreelanceLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-neutral-200" />
      <CardSkeletonGrid count={8} />
    </div>
  );
}
