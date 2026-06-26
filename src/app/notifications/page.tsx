"use client";

import Link from "next/link";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkAllRead,
  useMarkRead,
} from "@/lib/hooks/useNotifications";

const TYPE_ICON: Record<string, string> = {
  NOUVELLE_MISSION: "📋",
  MISSION_ACCEPTEE: "✅",
  MISSION_REFUSEE: "❌",
  MISSION_DEMARREE: "🚀",
  MISSION_TERMINEE: "🏁",
  MESSAGE_RECU: "💬",
  EVALUATION_RECUE: "⭐",
  SYSTEME: "🔔",
};

const FILTERS = [
  { value: "", label: "Toutes" },
  { value: "NON_LUE", label: "Non lues" },
  { value: "LUE", label: "Lues" },
];

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useNotifications({ limit: 100, statut: filter || undefined });
  const { mutate: markAll } = useMarkAllRead();
  const { mutate: markOne } = useMarkRead();

  const notifications = data?.notifications ?? [];
  const total = data?.total ?? 0;
  const unreadCount = notifications.filter((n) => n.statut === "NON_LUE").length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Accueil
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
            <p className="mt-1 text-neutral-500">
              {total} notification{total > 1 ? "s" : ""}
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAll()}
              className="shrink-0"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer lu
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-200" />
            ))}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-neutral-200 bg-white py-20 text-center">
              <Bell className="h-14 w-14 text-neutral-200" />
              <p className="mt-4 text-lg font-semibold text-neutral-900">
                Aucune notification
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Vos alertes missions, messages et commandes apparaîtront ici.
              </p>
            </div>
          )}

          {!isLoading &&
            notifications.map((n, i) => (
              <motion.button
                key={n._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => n.statut === "NON_LUE" && markOne(n._id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-shadow hover:shadow-sm",
                  n.statut === "NON_LUE"
                    ? "border-blue-100 bg-blue-50/30"
                    : "border-neutral-100",
                )}
              >
                <span className="text-xl">{TYPE_ICON[n.type] ?? "🔔"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-neutral-900">{n.titre}</p>
                    {n.statut === "NON_LUE" && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                    {n.contenu}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
}
