"use client";

import { useEffect, useState } from "react";

const KEY = "sdeal_search_history";
const MAX = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const addEntry = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {/* ignore */}
      return next;
    });
  };

  const removeEntry = (term: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h !== term);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {/* ignore */}
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(KEY);
    } catch {/* ignore */}
  };

  return { history, addEntry, removeEntry, clearHistory };
}
