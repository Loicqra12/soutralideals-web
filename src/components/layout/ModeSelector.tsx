"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Wrench, Laptop, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  poleSearchPlaceholder,
  poleToPath,
  type PoleType,
} from "@/lib/utils/filters";
import { useUiStore } from "@/stores";

const POLES: { id: PoleType; label: string; icon: React.ReactNode }[] = [
  { id: "metiers", label: "Métiers", icon: <Wrench className="h-4 w-4" /> },
  { id: "freelance", label: "Freelance", icon: <Laptop className="h-4 w-4" /> },
  { id: "emarche", label: "E-marché", icon: <ShoppingBag className="h-4 w-4" /> },
];

interface ModeSelectorProps {
  showSearch?: boolean;
  variant?: "default" | "hero";
}

export function ModeSelector({
  showSearch = true,
  variant = "default",
}: ModeSelectorProps) {
  const isHero = variant === "hero";
  const router = useRouter();
  const pathname = usePathname();
  const { activePole, searchQuery, setActivePole, setSearchQuery } = useUiStore();

  const handleSearch = () => {
    const base = poleToPath(activePole);
    const query = searchQuery.trim();
    router.push(query ? `${base}?q=${encodeURIComponent(query)}` : base);
  };

  const handlePoleChange = (pole: PoleType) => {
    setActivePole(pole);
    if (pathname === "/") return;
    router.push(poleToPath(pole));
  };

  return (
    <div className="w-full space-y-4">
      <Tabs value={activePole} onValueChange={(v) => handlePoleChange(v as PoleType)}>
        <TabsList
          className={cn(
            "grid w-full grid-cols-3",
            isHero && "border border-white/20 bg-white/10",
          )}
        >
          {POLES.map((pole) => (
            <TabsTrigger
              key={pole.id}
              value={pole.id}
              className={cn(
                "gap-2",
                isHero &&
                  "text-white/80 data-[state=active]:bg-white data-[state=active]:text-neutral-900",
              )}
            >
              {pole.icon}
              <span className="hidden sm:inline">{pole.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {showSearch && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                isHero ? "text-white/50" : "text-neutral-400",
              )}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={poleSearchPlaceholder(activePole)}
              className={cn(
                "pl-10",
                isHero &&
                  "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30",
              )}
            />
          </div>
          <Button
            onClick={handleSearch}
            className={isHero ? "bg-primary-500 hover:bg-primary-600" : undefined}
          >
            Chercher
          </Button>
        </div>
      )}
    </div>
  );
}
