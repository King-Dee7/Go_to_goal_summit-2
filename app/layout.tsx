import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Syne, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-condensed",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Go To Goal Summit | Reinvent Africa Network",
  description:
    "Join us July 17 for RAN2026, a defining gathering designed to equip the next generation of African builders, entrepreneurs, creators and professionals with raw unfiltered stories, connections and actionable insight to turn ambition into action.",
  metadataBase: new URL("https://reinventaf.com"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Go To Goal Summit",
    "Reinvent Africa Network",
    "youth empowerment",
    "Accra Ghana",
    "leadership summit",
    "African youth",
    "entrepreneurship",
  ],
  openGraph: {
    title: "Go To Goal Summit | Reinvent Africa Network",
    description:
      "Join us July 17 for RAN2026, a defining gathering designed to equip the next generation of African builders, entrepreneurs, creators and professionals with raw unfiltered stories, connections and actionable insight to turn ambition into action.",
    url: "https://reinventaf.com",
    siteName: "Go To Goal Summit",
    type: "website",
    images: [
      {
        url: "/real-og.jpg",
        width: 1200,
        height: 630,
        alt: "Go To Goal Summit by Reinvent Africa Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go To Goal Summit | Reinvent Africa Network",
    description:
      "Join us July 17 for RAN2026, a defining gathering designed to equip the next generation of African builders, entrepreneurs, creators and professionals with raw unfiltered stories, connections and actionable insight to turn ambition into action.",
    images: ["/real-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${syne.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
