import ApplyClient from "./ApplyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply to Attend | Go To Goal Summit",
  description: "Apply to attend the From Go To Goal Summit 2026 in Accra, Ghana. Submit your application to join Africa's leading builders and entrepreneurs.",
  openGraph: {
    title: "Apply to Attend | Go To Goal Summit",
    description: "Apply to attend the From Go To Goal Summit 2026 in Accra, Ghana. Submit your application to join Africa's leading builders and entrepreneurs.",
    images: [
      {
        url: "/real-og.jpg",
        width: 1200,
        height: 630,
        alt: "Apply to Attend Go To Goal Summit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply to Attend | Go To Goal Summit",
    description: "Apply to attend the From Go To Goal Summit 2026 in Accra, Ghana. Submit your application to join Africa's leading builders and entrepreneurs.",
    images: ["/real-og.jpg"],
  },
};

export default function ApplyPage() {
  return <ApplyClient />;
}
