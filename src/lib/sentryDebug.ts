/** Autorise /debug-sentry uniquement en local ou si ENABLE_SENTRY_DEBUG=true */
export function isSentryDebugAllowed(host?: string | null): boolean {
  if (process.env.ENABLE_SENTRY_DEBUG === "true") return true;
  if (!host) return process.env.NODE_ENV !== "production";
  return (
    host.startsWith("localhost:") ||
    host.startsWith("127.0.0.1:") ||
    host === "localhost" ||
    host === "127.0.0.1"
  );
}
