/** Communes et quartiers d'Abidjan — fallback hors ligne / sans Google Places. */
export interface AbidjanZone {
  id: string;
  name: string;
  commune: string;
  latitude: number;
  longitude: number;
}

export const ABIDJAN_ZONES: AbidjanZone[] = [
  { id: "angre", name: "Angré", commune: "Cocody", latitude: 5.3833, longitude: -3.9833 },
  { id: "cocody-centre", name: "Cocody Centre", commune: "Cocody", latitude: 5.3600, longitude: -3.9870 },
  { id: "riviera", name: "Riviera", commune: "Cocody", latitude: 5.3650, longitude: -3.9680 },
  { id: "deux-plateaux", name: "Deux Plateaux", commune: "Cocody", latitude: 5.3540, longitude: -3.9930 },
  { id: "yopougon-niangon", name: "Niangon", commune: "Yopougon", latitude: 5.3480, longitude: -4.0890 },
  { id: "yopougon-siporex", name: "Siporex", commune: "Yopougon", latitude: 5.3370, longitude: -4.0760 },
  { id: "yopougon-toits-rouges", name: "Toits Rouges", commune: "Yopougon", latitude: 5.3290, longitude: -4.0680 },
  { id: "marcory-zone4", name: "Zone 4", commune: "Marcory", latitude: 5.3010, longitude: -3.9860 },
  { id: "plateau", name: "Plateau", commune: "Plateau", latitude: 5.3240, longitude: -4.0150 },
  { id: "treichville", name: "Treichville", commune: "Treichville", latitude: 5.2930, longitude: -4.0130 },
  { id: "abobo", name: "Abobo", commune: "Abobo", latitude: 5.4160, longitude: -4.0150 },
  { id: "koumassi", name: "Koumassi", commune: "Koumassi", latitude: 5.2980, longitude: -3.9520 },
  { id: "bingerville", name: "Bingerville", commune: "Bingerville", latitude: 5.3550, longitude: -3.8840 },
  { id: "port-bouet", name: "Port-Bouët", commune: "Port-Bouët", latitude: 5.2540, longitude: -3.9240 },
  { id: "adjame", name: "Adjamé", commune: "Adjamé", latitude: 5.3540, longitude: -4.0210 },
  { id: "attecoube", name: "Attécoubé", commune: "Attécoubé", latitude: 5.3290, longitude: -4.0410 },
  { id: "anyama", name: "Anyama", commune: "Anyama", latitude: 5.4950, longitude: -4.0510 },
  { id: "songon", name: "Songon", commune: "Songon", latitude: 5.2920, longitude: -4.2560 },
  { id: "williamsville", name: "Williamsville", commune: "Adjamé", latitude: 5.3420, longitude: -4.0280 },
  { id: "blockhaus", name: "Blockhaus", commune: "Plateau", latitude: 5.3180, longitude: -4.0080 },
];

export function searchAbidjanZones(query: string, limit = 8): AbidjanZone[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return ABIDJAN_ZONES.filter((zone) => {
    const haystack = `${zone.name} ${zone.commune} abidjan`.toLowerCase();
    return haystack.includes(q);
  }).slice(0, limit);
}
