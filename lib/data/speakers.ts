export type Speaker = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  bio: string;
  socials: {
    linkedin?: string;
    twitter?: string;
  };
};

export const speakerCards: Speaker[] = [
  {
    id: "01",
    title: "Speaker Announcement",
    description: "Industry Leader & Executive",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/01",
    bio: "This incredible industry leader has spent over two decades redefining what it means to build scalable, high-impact businesses in Africa. They have consistently broken glass ceilings and paved the way for the next generation of executives to thrive on a global stage. At the From Go To Goal Summit, they will be sharing unfiltered insights on navigating corporate ladders, building resilient teams, and turning ambitious visions into actionable strategies that yield real results.",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    id: "02",
    title: "Featured Speaker",
    description: "Founder, Creator, Mentor",
    imageSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/02",
    bio: "A visionary founder who seamlessly blends creativity with rigorous execution. From launching ground-breaking startups to mentoring hundreds of young entrepreneurs, they understand the delicate balance between passion and profit. Their journey is a masterclass in perseverance, and their session will unpack the raw realities of building from scratch in emerging markets.",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    id: "03",
    title: "Speaker Announcement",
    description: "Creative & Cultural Architect",
    imageSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/03",
    bio: "As a cultural architect, they have shaped narratives that resonate globally while staying deeply rooted in African heritage. Their work bridges the gap between art, culture, and commercial success, proving that authentic storytelling is the ultimate leverage. Expect a dynamic conversation on how to harness your unique voice to build movements and deeply engaged communities.",
    socials: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "04",
    title: "Speaker Announcement",
    description: "Policy & Ecosystem Builder",
    imageSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/04",
    bio: "With a profound understanding of the structural changes needed to accelerate innovation, this ecosystem builder has been at the forefront of policy reform and strategic partnerships. They will break down the systems behind real progress and share practical lessons on how to navigate institutional hurdles to build sustainable, scalable value.",
    socials: {
      twitter: "https://twitter.com",
    }
  },
  {
    id: "05",
    title: "Speaker Announcement",
    description: "Entrepreneur & Founder",
    imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/05",
    bio: "They turned an impossible idea into a thriving enterprise. This founder is known for their tactical brilliance and unwavering resilience. Their session at RAN2026 will strip away the glamour of entrepreneurship to reveal the hard truths, tactical frameworks, and strategic pivots required to survive and thrive as a modern founder.",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    id: "06",
    title: "Speaker Announcement",
    description: "Creative Director & Strategist",
    imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
    href: "/speakers/06",
    bio: "A master of visual identity and brand strategy, they have orchestrated some of the most memorable campaigns of the decade. They understand that perception is reality and will be sharing their playbook on how to build a brand that commands attention, drives loyalty, and consistently delivers value in a noisy digital world.",
    socials: {
      linkedin: "https://linkedin.com",
    }
  },
];
