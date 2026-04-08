import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Syne, Bebas_Neue } from "next/font/google";
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
    "A flagship youth empowerment summit in Accra, Ghana. Where ambition meets action — equipping the next generation of African leaders with practical tools, real networks, and stories that prove what's possible.",
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
      "A flagship youth empowerment summit in Accra, Ghana. Where ambition meets action.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${syne.variable} ${bebasNeue.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
