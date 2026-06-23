import { create } from "zustand";
import type { PoleType } from "@/lib/utils/filters";

interface UiStore {
  activePole: PoleType;
  searchQuery: string;
  setActivePole: (pole: PoleType) => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activePole: "metiers",
  searchQuery: "",
  setActivePole: (pole) => set({ activePole: pole }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
