import apiClient from "./client";

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceCoordinates {
  lat: number;
  lng: number;
}

export async function autocompletePlaces(input: string): Promise<PlacePrediction[]> {
  const { data } = await apiClient.post<{
    success: boolean;
    predictions?: PlacePrediction[];
  }>("/maps/autocomplete", { input, country: "ci" });
  return data.predictions ?? [];
}

export async function fetchPlaceDetails(placeId: string): Promise<{
  coordinates: PlaceCoordinates;
  formattedAddress: string;
  name: string;
}> {
  const { data } = await apiClient.post<{
    success: boolean;
    coordinates?: PlaceCoordinates;
    formattedAddress?: string;
    name?: string;
    error?: string;
  }>("/maps/place-details", { placeId });

  if (!data.success || !data.coordinates) {
    throw new Error(data.error ?? "Impossible de récupérer ce lieu");
  }

  return {
    coordinates: data.coordinates,
    formattedAddress: data.formattedAddress ?? data.name ?? "",
    name: data.name ?? data.formattedAddress ?? "",
  };
}

export async function reverseGeocodeLocation(lat: number, lng: number): Promise<string> {
  const { data } = await apiClient.post<{
    success: boolean;
    address?: string;
  }>("/maps/reverse-geocode", { lat, lng });

  if (data.success && data.address) return data.address;
  return `GPS ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export async function geocodeAddressQuery(address: string): Promise<{
  coordinates: PlaceCoordinates;
  formattedAddress: string;
}> {
  const { data } = await apiClient.post<{
    success: boolean;
    coordinates?: PlaceCoordinates;
    formattedAddress?: string;
    error?: string;
  }>("/maps/geocode", { address: `${address}, Abidjan, Côte d'Ivoire` });

  if (!data.success || !data.coordinates) {
    throw new Error(data.error ?? "Adresse introuvable");
  }

  return {
    coordinates: data.coordinates,
    formattedAddress: data.formattedAddress ?? address,
  };
}
