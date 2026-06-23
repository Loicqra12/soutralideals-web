"use client";

import { EmarcheSubNav } from "@/components/emarche/EmarcheSubNav";

export default function EmarcheEspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-neutral-50">
      <EmarcheSubNav publicShopHref="/emarche" />
      {children}
    </div>
  );
}
