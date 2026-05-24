import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { speakerCards } from "@/lib/data/speakers";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface SpeakerPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SpeakerPageProps): Promise<Metadata> {
  const speaker = speakerCards.find((s) => s.id === params.id);
  if (!speaker) {
    return {
      title: "Speaker Not Found | Go To Goal Summit",
    };
  }

  const title = `${speaker.description} | Speaker | Go To Goal Summit`;
  const description = `Meet ${speaker.description}, speaking at the From Go To Goal Summit 2026. Read their bio, career accomplishments, and session insights.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: speaker.imageSrc,
          alt: `${speaker.description} at Go To Goal Summit`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [speaker.imageSrc],
    },
  };
}

export default function SpeakerProfile({ params }: SpeakerPageProps) {
  const speaker = speakerCards.find((s) => s.id === params.id);

  if (!speaker) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header / Nav */}
      <nav className="w-full border-b border-slate-100 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <Link
            href="/#speakers"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Summit
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Portrait */}
          <div className="w-full md:w-5/12 lg:w-1/2 flex-shrink-0">
            <div className="sticky top-12 rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-xl border border-slate-100">
              <Image
                src={speaker.imageSrc}
                alt={speaker.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Column: Bio & Info */}
          <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center py-2 md:py-8">
            <p className="text-xs font-bold tracking-[0.2em] text-[#af2122] uppercase mb-4">
              {speaker.title}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6" style={{ fontFamily: "var(--font-display), serif" }}>
              {speaker.description}
            </h1>
            
            <div className="flex items-center gap-4 mb-10">
              {speaker.socials.linkedin && (
                <a 
                  href={speaker.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {speaker.socials.twitter && (
                <a 
                  href={speaker.socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="text-lg text-slate-600 leading-[1.8] space-y-6">
              {speaker.bio.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6">See this speaker in action</h3>
              <Link 
                href="/apply"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-transform hover:scale-[1.02] shadow-lg shadow-slate-900/20"
              >
                Apply to Attend
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
