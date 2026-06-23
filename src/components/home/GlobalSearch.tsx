"use client";

import { SmartSearchBar } from "@/components/shared/SmartSearchBar";

type GlobalSearchProps = {
  className?: string;
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  return (
    <SmartSearchBar
      size="large"
      placeholder="Coiffeur, développeur, plombier, boutique..."
      className={className}
    />
  );
}
