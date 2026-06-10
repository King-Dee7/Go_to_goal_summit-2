import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { speakerCards } from "@/lib/data/speakers";
import { Navbar } from "@/components/ui/Navbar";
import { SpeakerFooter } from "@/components/ui/SpeakerFooter";
import type { Metadata } from "next";

// Icons were removed as they are unused in this file.

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

  const firstName = speaker.title.split(" ")[0].toUpperCase();

  const bioParagraphs = speaker.bio.split("\n\n");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col pt-[98px]">
      {/* Global Header / Nav */}
      <Navbar forceLight />

      {/* Main Content - Sticky Sidebar layout */}
      <main className="flex-1 w-full">
        <div className="flex flex-col md:flex-row w-full min-h-0">

          {/* Left: Image Column — stretches to match right column height */}
          <div className="w-full md:w-[35%] lg:w-[30%] flex-shrink-0 md:self-stretch">
            <div className="relative w-full h-full min-h-[400px]">
              <Image
                src={speaker.imageSrc}
                alt={speaker.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 35vw"
                priority
              />
            </div>
          </div>

          {/* Right: Scrollable Content Column */}
          <div className="flex-1 flex flex-col min-h-[420px]">

            {/* Right Top: Title Box (White) */}
            <div className="px-8 md:px-12 lg:px-20 pt-8 md:pt-12 pb-6 bg-white">
              <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-normal tracking-tight text-slate-900 mb-2 font-sans leading-none">
                {speaker.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-800 font-sans">
                {speaker.description}
              </p>
            </div>

            {/* Right Bottom: Bio Box (Grey) */}
            <div className="bg-[#f5f5f5] px-8 md:px-12 lg:px-20 py-8 md:py-10 flex flex-col flex-grow">
              <div className="text-[17px] text-slate-800 leading-[1.7] space-y-6">
                {bioParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative w-full max-w-4xl">
                {/* Divider line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-300"></div>
                
                <Link 
                  href="/#speakers"
                  className="text-slate-800 font-medium underline underline-offset-4 hover:text-black transition-colors"
                >
                  See lineup
                </Link>
                
                <Link 
                  href="/apply"
                  className="inline-flex items-center justify-center px-6 py-4 text-[13px] font-bold text-[#af2122] bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-widest"
                >
                  Meet {firstName} At The Summit
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      <SpeakerFooter />
    </div>
  );
}
