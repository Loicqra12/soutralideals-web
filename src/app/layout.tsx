import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";
import type { Viewport } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#1b5e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Soutrali Deals — Marketplace Côte d'Ivoire",
    template: "%s | Soutrali Deals",
  },
  description:
    "Trouvez des prestataires, freelances et produits locaux en Côte d'Ivoire.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Soutrali Deals",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180" }],
    shortcut: "/logo.png",
  },
  openGraph: {
    title: "Soutrali Deals",
    description: "La marketplace ivoirienne — services, freelance, e-commerce.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
    siteName: "Soutrali Deals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soutrali Deals",
    description: "La marketplace ivoirienne — services, freelance, e-commerce.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{ duration: 4000 }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
