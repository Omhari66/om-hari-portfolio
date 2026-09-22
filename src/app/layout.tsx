import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SkipLink } from "@/components/a11y/SkipLink";
import { GhostCursor } from "@/components/effects/GhostCursor";
import { PortfolioProvider } from "@/portfolio/state";
import "./globals.css";

// ============================================================
// FONTS — next/font ensures zero layout shift and automatic
// self-hosting. CSS variables injected into <html className>.
// ============================================================
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false, // monospace is non-critical path — defer it
});

// ============================================================
// METADATA
// TODO: Replace "your.dev" with your real domain.
// TODO: Add /public/og-image.png (1200×630) for social cards.
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "Om Hari — Portfolio",
    template: "%s | Om Hari",
  },
  description:
    "Personal portfolio of Om Hari — developer, builder, and creator. Explore my projects, experience, and skills through an interactive guided interface.",
  metadataBase: new URL("https://your.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your.dev",
    siteName: "Om Hari — Portfolio",
    title: "Om Hari — Portfolio",
    description:
      "An interactive portfolio with a guide character. Ask it anything about my work.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Om Hari — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Hari — Portfolio",
    description: "An interactive portfolio. Ask the guide anything.",
    // TODO: creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Canonical URL hint for search engines
  alternates: {
    canonical: "https://your.dev",
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          DNS prefetch for any external resources the page may load at runtime.
          next/font already handles Google Fonts self-hosting, so no need
          to prefetch fonts.googleapis.com.
        */}
        <meta name="theme-color" content="#0B0C10" />
      </head>
      <body suppressHydrationWarning>

        {/*
          SkipLink is the very first focusable element in the page.
          It becomes visible only when focused via keyboard (Tab).
          WCAG 2.4.1 — Bypass Blocks (Level A).
        */}
        <SkipLink />
        <PortfolioProvider>
          <GhostCursor color="#6C63FF" brightness={0.8} />
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
