import { isSentryDebugAllowed } from "@/lib/sentryDebug";

export async function GET(request: Request) {
  const host = request.headers.get("host");

  if (!isSentryDebugAllowed(host)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  throw new Error("My first Sentry error! (sdeals-front API test)");
}
