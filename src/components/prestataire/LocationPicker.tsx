"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Navigation, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchAbidjanZones } from "@/lib/data/abidjanZones";
import {
  autocompletePlaces,
  fetchPlaceDetails,
  geocodeAddressQuery,
  reverseGeocodeLocation,
} from "@/lib/api/maps";
import { getUserLocation } from "@/lib/utils/haversine";

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  label: string;
}

interface SuggestionItem {
  id: string;
  label: string;
  subtitle?: string;
  source: "local" | "google";
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationPickerProps {
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation | null) => void;
  error?: string;
  onError?: (message: string) => void;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function LocationPicker({ value, onChange, error, onError }: LocationPickerProps) {
  const [query, setQuery] = useState(value?.label ?? "");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value?.label) setQuery(value.label);
  }, [value?.label]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildSuggestions = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    const local = searchAbidjanZones(trimmed).map((zone) => ({
      id: `local-${zone.id}`,
      label: zone.name,
      subtitle: `${zone.commune}, Abidjan`,
      source: "local" as const,
      latitude: zone.latitude,
      longitude: zone.longitude,
    }));

    let google: SuggestionItem[] = [];
    try {
      const predictions = await autocompletePlaces(trimmed);
      google = predictions
        .filter((p) => {
          const localIds = new Set(local.map((l) => normalizeText(l.label)));
          return !localIds.has(normalizeText(p.mainText));
        })
        .map((p) => ({
          id: `google-${p.placeId}`,
          label: p.mainText,
          subtitle: p.secondaryText || p.description,
          source: "google" as const,
          placeId: p.placeId,
        }));
    } catch {
      // Fallback local uniquement si Google indisponible
    }

    setSuggestions([...local, ...google].slice(0, 10));
    setSearching(false);
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    onChange(null);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void buildSuggestions(text);
    }, 300);
  };

  const selectSuggestion = async (item: SuggestionItem) => {
    setOpen(false);
    setResolving(true);
    onError?.("");

    try {
      if (item.source === "local" && item.latitude != null && item.longitude != null) {
        const label = `${item.label}, ${item.subtitle ?? "Abidjan"}`;
        onChange({
          latitude: item.latitude,
          longitude: item.longitude,
          label,
        });
        setQuery(label);
        return;
      }

      if (item.placeId) {
        const details = await fetchPlaceDetails(item.placeId);
        const label = details.formattedAddress || details.name;
        onChange({
          latitude: details.coordinates.lat,
          longitude: details.coordinates.lng,
          label,
        });
        setQuery(label);
        return;
      }

      throw new Error("Lieu invalide");
    } catch (e) {
      onError?.(e instanceof Error ? e.message : "Impossible de sélectionner ce lieu");
    } finally {
      setResolving(false);
    }
  };

  const handleGeocodeSubmit = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      onError?.("Tapez au moins 2 caractères pour rechercher un quartier.");
      return;
    }

    setResolving(true);
    onError?.("");
    try {
      const localMatch = searchAbidjanZones(trimmed, 1)[0];
      if (localMatch) {
        const label = `${localMatch.name}, ${localMatch.commune}, Abidjan`;
        onChange({
          latitude: localMatch.latitude,
          longitude: localMatch.longitude,
          label,
        });
        setQuery(label);
        setOpen(false);
        return;
      }

      const result = await geocodeAddressQuery(trimmed);
      onChange({
        latitude: result.coordinates.lat,
        longitude: result.coordinates.lng,
        label: result.formattedAddress,
      });
      setQuery(result.formattedAddress);
      setOpen(false);
    } catch (e) {
      onError?.(
        e instanceof Error
          ? e.message
          : "Lieu introuvable. Choisissez une suggestion dans la liste.",
      );
    } finally {
      setResolving(false);
    }
  };

  const handleGps = async () => {
    setGpsLoading(true);
    onError?.("");
    try {
      const pos = await getUserLocation();
      const label = await reverseGeocodeLocation(pos.lat, pos.lng);
      onChange({
        latitude: pos.lat,
        longitude: pos.lng,
        label,
      });
      setQuery(label);
      setOpen(false);
    } catch {
      onError?.(
        "Impossible d'obtenir votre position. Autorisez la géolocalisation ou recherchez votre quartier.",
      );
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="relative">
        <label htmlFor="zone-search" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Quartier ou commune d&apos;intervention
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            id="zone-search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => {
              setOpen(true);
              if (query.trim().length >= 2) void buildSuggestions(query);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleGeocodeSubmit();
              }
            }}
            placeholder="Ex. Angré, Cocody, Yopougon…"
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 pl-10 pr-10 focus:bg-white"
            autoComplete="off"
          />
          {(searching || resolving) && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-neutral-400" />
          )}
        </div>
        <p className="mt-1.5 text-xs text-neutral-500">
          Tapez le nom de votre quartier et choisissez dans la liste.
        </p>

        {open && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-neutral-50"
                  onClick={() => void selectSuggestion(item)}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-neutral-900">{item.label}</span>
                    {item.subtitle && (
                      <span className="block truncate text-xs text-neutral-500">{item.subtitle}</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                      item.source === "local"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-blue-50 text-blue-700",
                    )}
                  >
                    {item.source === "local" ? "CI" : "Google"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
          <div className="min-w-0 flex-1">
            {value ? (
              <>
                <p className="text-sm font-medium text-neutral-900">Zone sélectionnée</p>
                <p className="mt-1 text-xs text-neutral-500">{value.label}</p>
                <p className="mt-1 font-mono text-[11px] text-neutral-400">
                  {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
                </p>
              </>
            ) : (
              <p className="text-sm text-neutral-600">Aucune zone sélectionnée</p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => void handleGps()}
        disabled={gpsLoading || resolving}
      >
        {gpsLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Localisation GPS…
          </>
        ) : (
          <>
            <Navigation className="mr-2 h-4 w-4" />
            Utiliser ma position actuelle (optionnel)
          </>
        )}
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
