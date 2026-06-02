import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Syne, Bebas_Neue, Oswald, Open_Sans, Roboto, Inter } from "next/font/google";
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

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RAN'26 - From Go To Goal Summit",
  description:
    "Join us on July 17 for RAN 2026, a defining summit in Accra equipping the next generation of African builders, entrepreneurs, and creators to turn ambition into action.",
  metadataBase: new URL("https://www.reinventaf.com"),
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
    title: "RAN'26 - From Go To Goal Summit",
    description:
      "Join us on July 17 for RAN 2026, a defining summit in Accra equipping the next generation of African builders, entrepreneurs, and creators to turn ambition into action.",
    url: "https://reinventaf.com",
    siteName: "Go To Goal Summit",
    type: "website",
    images: [
      {
        url: "/Og%20image.png",
        width: 1200,
        height: 630,
        alt: "Go To Goal Summit by Reinvent Africa Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAN'26 - From Go To Goal Summit",
    description:
      "Join us on July 17 for RAN 2026, a defining summit in Accra equipping the next generation of African builders, entrepreneurs, and creators to turn ambition into action.",
    images: ["/Og%20image.png"],
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${syne.variable} ${bebasNeue.variable} ${oswald.variable} ${openSans.variable} ${roboto.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
