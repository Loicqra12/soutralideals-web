"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fetchSuggestions } from "@/lib/api/suggestions";
import { useSearchHistory } from "@/lib/hooks/useSearchHistory";

const POPULAR = [
  "Plombier",
  "Électricien",
  "Coiffeur",
  "Développeur web",
  "Menuisier",
  "Maçon",
  "Couturier",
  "Photographe",
];

interface SmartSearchBarProps {
  className?: string;
  size?: "default" | "large";
  placeholder?: string;
}

export function SmartSearchBar({
  className,
  size = "default",
  placeholder = "Plombier, coiffeur, développeur...",
}: SmartSearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { history, addEntry, removeEntry, clearHistory } = useSearchHistory();

  const filteredHistory = query.trim()
    ? history.filter((h) =>
        h.toLowerCase().includes(query.toLowerCase()),
      )
    : history;

  const showHistory = filteredHistory.length > 0 && !query.trim();
  const showSuggestions = suggestions.length > 0 && query.trim().length > 0;
  const showPopular = !query.trim() && !history.length;
  const hasDropdown = showHistory || showSuggestions || showPopular;

  // Fetch suggestions avec debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim() || query.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggestions(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(query);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allItems: { label: string; type: "history" | "suggestion" | "popular" }[] = [
    ...(showHistory ? filteredHistory.map((h) => ({ label: h, type: "history" as const })) : []),
    ...(showSuggestions ? suggestions.map((s) => ({ label: s, type: "suggestion" as const })) : []),
    ...(showPopular ? POPULAR.map((p) => ({ label: p, type: "popular" as const })) : []),
  ];

  const handleSubmit = (value?: string) => {
    const term = (value ?? query).trim();
    if (!term) return;
    addEntry(term);
    setOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !allItems.length) {
      if (e.key === "Enter") handleSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSubmit(allItems[activeIndex].label);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const inputHeight = size === "large" ? "h-[3.75rem] sm:h-16" : "h-12";
  const inputText = size === "large" ? "text-base sm:text-lg" : "text-sm";
  const btnSize = size === "large" ? "h-11 w-11 sm:h-12 sm:w-12" : "h-9 w-9";

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 overflow-hidden rounded-full border bg-white shadow-xl shadow-black/10 transition-shadow",
          open
            ? "border-neutral-300 shadow-2xl shadow-black/20"
            : "border-transparent",
          size === "large" ? "p-2" : "p-1.5",
        )}
      >
        <Search
          className={cn(
            "ml-3 shrink-0 text-neutral-400",
            size === "large" ? "h-5 w-5" : "h-4 w-4",
          )}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "min-w-0 flex-1 bg-transparent pr-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none",
            inputText,
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSubmit()}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700",
            btnSize,
          )}
          aria-label="Rechercher"
        >
          <Search className={size === "large" ? "h-5 w-5" : "h-4 w-4"} />
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && hasDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-black/15"
          >
            {/* History */}
            {showHistory && (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 pb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Recherches récentes
                  </p>
                  <button
                    onClick={clearHistory}
                    className="text-[11px] text-neutral-400 hover:text-neutral-700"
                  >
                    Tout effacer
                  </button>
                </div>
                {filteredHistory.map((h, i) => (
                  <div
                    key={h}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 hover:bg-neutral-50",
                      activeIndex === i && "bg-neutral-50",
                    )}
                    onMouseDown={() => handleSubmit(h)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
                      <span className="truncate text-sm text-neutral-800">{h}</span>
                    </div>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeEntry(h);
                      }}
                      className="shrink-0 text-neutral-300 hover:text-neutral-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && (
              <div className="py-2">
                <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Suggestions
                </p>
                {loadingSuggestions && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
                    <span className="text-sm text-neutral-400">Recherche...</span>
                  </div>
                )}
                {suggestions.map((s, i) => {
                  const idx = filteredHistory.length + i;
                  return (
                    <div
                      key={s}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-neutral-50",
                        activeIndex === idx && "bg-neutral-50",
                      )}
                      onMouseDown={() => handleSubmit(s)}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                      <span className="truncate text-sm text-neutral-800">
                        {highlightMatch(s, query)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Popular */}
            {showPopular && (
              <div className="py-2">
                <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Populaire
                </p>
                {POPULAR.map((p, i) => (
                  <div
                    key={p}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-neutral-50",
                      activeIndex === i && "bg-neutral-50",
                    )}
                    onMouseDown={() => handleSubmit(p)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <TrendingUp className="h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="text-sm text-neutral-700">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Met en gras la partie de la suggestion qui correspond à la recherche */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-neutral-900">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  );
}
