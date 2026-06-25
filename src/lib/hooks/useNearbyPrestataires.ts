"use client";

import { useEffect, useState } from "react";
import { haversineDistance, getUserLocation, type UserLocation } from "@/lib/utils/haversine";
import type { Prestataire } from "@/types";

export interface PrestataireWithDistance extends Prestataire {
  distanceKm?: number;
}

export function useNearbyPrestataires(
  prestataires: Prestataire[],
  radiusKm = 20,
) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [requesting, setRequesting] = useState(false);

  const requestLocation = async () => {
    setRequesting(true);
    setLocationError("");
    try {
      const loc = await getUserLocation();
      setUserLocation(loc);
    } catch {
      setLocationError(
        "Localisation refusée ou non disponible. Activez la géolocalisation dans votre navigateur.",
      );
    } finally {
      setRequesting(false);
    }
  };

  const nearby: PrestataireWithDistance[] = userLocation
    ? prestataires
        .map((p) => {
          const distanceKm =
            p.geoloc?.lat && p.geoloc?.lng
              ? haversineDistance(
                  userLocation.lat,
                  userLocation.lng,
                  p.geoloc.lat,
                  p.geoloc.lng,
                )
              : undefined;
          return { ...p, distanceKm };
        })
        .filter(
          (p) => p.distanceKm === undefined || p.distanceKm <= radiusKm,
        )
        .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999))
    : [];

  return {
    userLocation,
    nearby,
    locationError,
    requesting,
    requestLocation,
    hasLocation: !!userLocation,
  };
}
