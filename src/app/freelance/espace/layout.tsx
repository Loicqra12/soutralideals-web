"use client";

import { FreelanceSubNav } from "@/components/freelance/FreelanceSubNav";
import { useMyFreelance } from "@/lib/hooks/useMyFreelance";

export default function FreelanceEspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profile } = useMyFreelance();
  const publicHref = profile?._id ? `/freelance/${profile._id}` : undefined;

  return (
    <div className="min-h-full bg-neutral-50">
      <FreelanceSubNav publicProfileHref={publicHref} />
      {children}
    </div>
  );
}
