import type { Prestation } from "@/types/prestation";
import { formatFcfa } from "@/lib/utils/prestataireDashboard";

export interface MonthlyDataPoint {
  label: string;
  value: number;
}

/** Génère les 6 derniers mois (abrégés) */
export function getLast6MonthLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    );
  }
  return labels;
}

/** Revenus mensuels depuis les missions terminées */
export function computeMonthlyRevenue(missions: Prestation[]): MonthlyDataPoint[] {
  const labels = getLast6MonthLabels();
  const now = new Date();
  const buckets = labels.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth(), total: 0 };
  });

  for (const m of missions) {
    if (m.statut !== "TERMINEE" || !m.createdAt) continue;
    const date = new Date(m.createdAt);
    const bucket = buckets.find(
      (b) => b.year === date.getFullYear() && b.month === date.getMonth(),
    );
    if (bucket) bucket.total += m.montantTotal ?? 0;
  }

  return labels.map((label, i) => ({
    label,
    value: buckets[i]?.total ?? 0,
  }));
}

/** Activité mensuelle (toutes missions) */
export function computeMonthlyActivity(missions: Prestation[]): MonthlyDataPoint[] {
  const labels = getLast6MonthLabels();
  const now = new Date();
  const buckets = labels.map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth(), count: 0 };
  });

  for (const m of missions) {
    if (!m.createdAt) continue;
    const date = new Date(m.createdAt);
    const bucket = buckets.find(
      (b) => b.year === date.getFullYear() && b.month === date.getMonth(),
    );
    if (bucket) bucket.count += 1;
  }

  return labels.map((label, i) => ({
    label,
    value: buckets[i]?.count ?? 0,
  }));
}

export function formatRevenueChart(v: number): string {
  if (v >= 1_000_000) return `${Math.round(v / 100_000) / 10}M`;
  if (v >= 1_000) return `${Math.round(v / 100) / 10}k`;
  return formatFcfa(v).replace(" FCFA", "");
}
