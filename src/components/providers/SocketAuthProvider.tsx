"use client";

import { useSocketAuth } from "@/lib/hooks/useSocket";

export function SocketAuthProvider() {
  useSocketAuth();
  return null;
}
