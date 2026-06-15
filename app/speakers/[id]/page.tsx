import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { speakerCards } from "@/lib/data/speakers";
import { Navbar } from "@/components/ui/Navbar";
import { SpeakerFooter } from "@/components/ui/SpeakerFooter";
import type { Metadata } from "next";

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

  const title = `${speaker.title} - ${speaker.description} | From Go To Goal Summit`;
  const description = `Meet ${speaker.title}, ${speaker.description}, speaking at the From Go To Goal Summit 2026. Read their bio, career accomplishments, and session insights.`;

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

  const titleParts = speaker.title.split(/[\s\u00a0]+/);
  const firstWord = titleParts[0];
  const firstName = (["ATTORNEY", "ATTY."].includes(firstWord.toUpperCase()) ? titleParts[1] : firstWord).toUpperCase();

  const bioParagraphs = speaker.bio.split("\n\n");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col pt-[98px]">
      {/* Global Header / Nav */}
      <Navbar forceLight />

      {/* Main Content - Sticky Sidebar layout */}
      <main className="flex-1 w-full flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] w-full flex-1">

          {/* Left: Image Column — height always matches right column via grid */}
          <div className="flex min-h-[300px] w-full bg-slate-100">
            <Image
              src={speaker.imageSrc}
              alt={speaker.title}
              width={1200}
              height={1600}
              className="w-full h-full object-cover object-center"
              sizes="(max-width: 768px) 100vw, 35vw"
              priority
            />
          </div>

          {/* Right: Scrollable Content Column */}
          <div className="flex flex-col h-full">

            {/* Right Top: Title Box (White) */}
            <div className={`px-8 md:px-12 lg:px-20 pt-8 md:pt-12 bg-white ${
              speaker.id === 'alfred-eli-k-dei' ? 'pb-16 md:pb-32' :
              ['kuukua-eshun', 'richard-dick-darkey', 'carlos-idun-tawiah', 'cyril-alex-gockel', 'anthony-shaw'].includes(speaker.id) ? 'pb-12 md:pb-24' : 'pb-6'
            }`}>
              <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-normal tracking-tight text-slate-900 mb-2 font-sans leading-none">
                {speaker.id === "tatiauna-holland" ? "Atty. Tatiauna\u00A0Holland" : speaker.title}
              </h1>
              <p className="text-xl md:text-2xl text-slate-800 font-sans">
                {speaker.description}
              </p>
            </div>

            {/* Right Bottom: Bio Box (Grey) */}
            <div className="bg-[#f5f5f5] px-8 md:px-12 lg:px-20 py-8 md:py-10 flex flex-col flex-1">
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
