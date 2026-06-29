import path from "path";
import { fileURLToPath } from "url";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  // Sentry / OpenTelemetry — évite les alias hashés Turbopack (require-in-the-middle-xxx)
  serverExternalPackages: [
    "@sentry/nextjs",
    "@sentry/node",
    "require-in-the-middle",
    "import-in-the-middle",
  ],
  turbopack: {
    root: projectRoot,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/a-propos", destination: "/apropos", permanent: true },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "soutrali-deals",
  project: "sdeals-front",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
