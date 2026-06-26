"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Bell, BellDot, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNotifications, useUnreadCount, useMarkAllRead, useMarkRead } from "@/lib/hooks/useNotifications";

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

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useNotifications();
  const notifications = data?.notifications ?? [];
  const { data: unreadCount = 0 } = useUnreadCount();
  const { mutate: markAll } = useMarkAllRead();
  const { mutate: markOne } = useMarkRead();

  const handleOpen = () => setOpen((v) => !v);

  const handleMarkOne = (id: string) => {
    markOne(id);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellDot className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-200/60"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-[11px] font-bold text-red-600">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAll()}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Tout marquer lu
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Bell className="h-10 w-10 text-neutral-200" />
                    <p className="mt-3 text-sm text-neutral-500">
                      Aucune notification
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n._id}
                      onClick={() => n.statut === "NON_LUE" && handleMarkOne(n._id)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50",
                        n.statut === "NON_LUE" && "bg-blue-50/50",
                      )}
                    >
                      <span className="mt-0.5 text-base">
                        {TYPE_ICON[n.type] ?? "🔔"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 leading-snug">
                          {n.titre}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed line-clamp-2">
                          {n.contenu}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {n.statut === "NON_LUE" && (
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-neutral-100 px-4 py-2.5">
                  <Link
                    href="/notifications"
                    onClick={() => setOpen(false)}
                    className="block text-center text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Voir tout l&apos;historique
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
