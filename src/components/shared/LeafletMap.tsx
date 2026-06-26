"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface LeafletMapProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
}

/**
 * Carte interactive OpenStreetMap via Leaflet.
 * Zéro clé API, zéro coût.
 */
export function LeafletMap({ lat, lng, label = "Localisation", className }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let mounted = true;

    import("leaflet").then((L) => {
      if (!mounted || !containerRef.current) return;

      // Fix icône par défaut Leaflet (assets non inclus par défaut)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup();

      mapRef.current = map;
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <>
      {/* CSS Leaflet chargé dynamiquement */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={containerRef}
        className={className ?? "h-56 w-full rounded-2xl overflow-hidden"}
        aria-label={`Carte : ${label}`}
      />
    </>
  );
}

/** Version avec fallback si pas de coordonnées */
export function MapSection({
  geoloc,
  label,
  address,
}: {
  geoloc?: { lat: number; lng: number } | null;
  label?: string;
  address?: string;
}) {
  if (!geoloc?.lat || !geoloc?.lng) {
    if (!address) return null;
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">Localisation</h2>
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
          {address}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">Localisation</h2>
      {address && (
        <div className="mb-3 flex items-center gap-2 text-sm text-neutral-600">
          <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
          {address}
        </div>
      )}
      <LeafletMap
        lat={geoloc.lat}
        lng={geoloc.lng}
        label={label}
        className="h-56 w-full overflow-hidden rounded-2xl border border-neutral-200"
      />
    </section>
  );
}
