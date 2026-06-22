import PrivacyClient from "./PrivacyClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy | From Go To Goal Summit",
  description: "Read the consolidated Privacy Policy and Cookie Policy for the From Go To Goal Summit 2026 organized by Reinvent Africa Network.",
  openGraph: {
    title: "Privacy & Cookie Policy | From Go To Goal Summit",
    description: "Read the consolidated Privacy Policy and Cookie Policy for the From Go To Goal Summit 2026 organized by Reinvent Africa Network.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - Go To Goal Summit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy & Cookie Policy | From Go To Goal Summit",
    description: "Read the consolidated Privacy Policy and Cookie Policy for the From Go To Goal Summit 2026 organized by Reinvent Africa Network.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
