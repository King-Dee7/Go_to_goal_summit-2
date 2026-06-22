"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Cookie, Shield, Eye, Lock, Mail, ExternalLink } from "lucide-react";

interface PolicySection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const SECTIONS: PolicySection[] = [
  { id: "introduction", title: "1. Introduction", icon: <Shield className="w-4 h-4" /> },
  { id: "personal-data", title: "2. Personal Data We Collect", icon: <Eye className="w-4 h-4" /> },
  { id: "what-are-cookies", title: "3. What Are Cookies?", icon: <Cookie className="w-4 h-4" /> },
  { id: "how-we-use-cookies", title: "4. How We Use Cookies", icon: <Lock className="w-4 h-4" /> },
  { id: "cookie-types", title: "5. Types of Cookies Used", icon: <Cookie className="w-4 h-4" /> },
  { id: "cookie-management", title: "6. Managing Cookie Preferences", icon: <Shield className="w-4 h-4" /> },
  { id: "data-security", title: "7. Data Security & Storage", icon: <Lock className="w-4 h-4" /> },
  { id: "contact", title: "8. Contact Us", icon: <Mail className="w-4 h-4" /> },
];

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-15% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-6xl h-20 items-center justify-between px-6">
          <Link href="/" className="relative h-10 w-40 sm:w-48 transition-transform hover:scale-[1.01]">
            <Image
              src="/reinvent-logo.png"
              alt="Reinvent Africa Network"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 160px, 192px"
              priority
            />
          </Link>

          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-200 group-hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-slate-500 group-hover:text-slate-900 transition-colors">
              Back to Summit
            </span>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative border-b border-slate-200 bg-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="mx-auto max-w-6xl px-6 relative">
          <div className="max-w-3xl">
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 mb-6 leading-[1.1]"
              style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
            >
              Privacy &amp; Cookie Policy
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              This consolidated policy outlines how Reinvent Africa Network collects, uses, and safeguards your personal data, and details our usage of cookies when you interact with the From Go To Goal Summit website.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* SIDEBAR NAVIGATION (TABLE OF CONTENTS) */}
          <aside className="lg:w-1/4 flex-shrink-0">
            <div className="lg:sticky lg:top-28 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 px-3">
                Table of Contents
              </h2>
              <nav className="flex flex-col gap-1.5">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-rose-50/70 text-rose-900 shadow-sm border-l-2 border-rose-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950"
                    }`}
                  >
                    <span className={`transition-colors ${
                      activeSection === section.id ? "text-rose-700" : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      {section.icon}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
              
              <div className="hidden lg:block border-t border-slate-200 pt-6 mt-8 px-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Have questions about our privacy practices? Contact our team at:
                  <a href="mailto:info@reinventaf.com" className="block text-rose-800 hover:text-rose-900 font-semibold mt-1.5 transition-colors">
                    info@reinventaf.com
                  </a>
                </p>
              </div>
            </div>
          </aside>

          {/* POLICY CONTENT PANE */}
          <main className="lg:w-3/4 max-w-3xl prose prose-slate prose-lg">
            <div className="space-y-16">
              
              {/* SECTION 1: INTRODUCTION */}
              <section id="introduction" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    1. Introduction
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    Reinvent Africa Network (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the From Go To Goal Summit website. We respect your privacy and are committed to protecting your personal data in compliance with applicable data protection laws.
                  </p>
                  <p>
                    This policy explains how we collect and process your personal data when you visit our website, apply to attend the summit, or subscribe to our newsletter. It also details how we use cookies and tracking technologies to optimize your experience.
                  </p>
                  <p>
                    By using our website, submitting applications, or registering for updates, you acknowledge the terms of this Privacy &amp; Cookie Policy.
                  </p>
                </div>
              </section>

              {/* SECTION 2: PERSONAL DATA WE COLLECT */}
              <section id="personal-data" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    2. Personal Data We Collect
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    We collect personal information that you voluntarily provide to us when expressing interest in attending or participating in the summit:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>
                      <strong className="text-slate-900">Application Details:</strong> When you apply to attend via our application form, we collect your full name, email address, phone number, professional background, organization, LinkedIn profile URL, role selection (student, professional, founder, NGO, corporate, creative), and your statement of motivation.
                    </li>
                    <li>
                      <strong className="text-slate-900">Newsletter/Update Subscription:</strong> When you sign up for updates, we collect your email address, first name, and last name.
                    </li>
                    <li>
                      <strong className="text-slate-900">Communication History:</strong> If you contact us directly via email (e.g. for sponsorships or speaking opportunities), we retain the records of that correspondence.
                    </li>
                  </ul>
                  <p>
                    We do not collect sensitive personal data (such as health, political opinions, or religious beliefs) unless explicitly required for accommodation purposes and provided by you with explicit consent.
                  </p>
                </div>
              </section>

              {/* SECTION 3: WHAT ARE COOKIES? */}
              <section id="what-are-cookies" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    3. What Are Cookies?
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    Cookies are small text files containing a string of alphanumeric characters that are downloaded to your computer or mobile device when you visit a website. They allow the website to recognize your device and store information about your preferences or past actions.
                  </p>
                  <p>
                    Cookies can be &ldquo;persistent cookies&rdquo; (which remain on your device for a pre-set period or until deleted) or &ldquo;session cookies&rdquo; (which are deleted as soon as you close your web browser).
                  </p>
                </div>
              </section>

              {/* SECTION 4: HOW WE USE COOKIES */}
              <section id="how-we-use-cookies" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    4. How We Use Cookies
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    We use cookies and similar technologies for several essential and performance-related purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-slate-600">
                    <li>
                      <strong className="text-slate-900">Essential/Security Functions:</strong> Cookies help authenticate users and prevent fraudulent use of user accounts. For instance, when admins access the dashboard, Supabase uses session cookies to maintain secure authorization.
                    </li>
                    <li>
                      <strong className="text-slate-900">Performance and Analytics:</strong> We use Vercel Analytics to understand how visitors arrive at and interact with our website. This provides us with anonymized data on page views, device types, and navigation paths, helping us improve speed and layout.
                    </li>
                    <li>
                      <strong className="text-slate-900">Feature Preferences:</strong> To remember choices you make on our website (such as closing modal notices or filling forms) to provide a smoother, more personalized experience.
                    </li>
                  </ul>
                  <p>
                    We do not use advertising tracking cookies or share cookie profile data with third-party advertisers.
                  </p>
                </div>
              </section>

              {/* SECTION 5: TYPES OF COOKIES USED */}
              <section id="cookie-types" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    5. Types of Cookies Used
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    We classify cookies on our site into the following two categories:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-slate-600">
                    <li>
                      <strong className="text-slate-900">Essential Cookies:</strong> These cookies are strictly necessary to enable core site services, specifically admin user sessions, authentication tokens, and secure access to our management dashboard. These cookies do not store any personally identifiable information and cannot be turned off.
                    </li>
                    <li>
                      <strong className="text-slate-900">Performance &amp; Analytics Cookies:</strong> These cookies collect aggregated, anonymized information about how visitors navigate and interact with our summit page (such as visitor volume and loading performance). This data is used solely to diagnose website speed and refine user experience, and no individual tracking profiles are created.
                    </li>
                  </ul>
                </div>
              </section>

              {/* SECTION 6: MANAGING COOKIE PREFERENCES */}
              <section id="cookie-management" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    6. Managing Cookie Preferences
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    Most web browsers are configured to accept cookies by default. However, you can manage, block, or delete cookies at any time through your browser settings:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600">
                    <li>
                      To manage cookies in <strong className="text-slate-900">Google Chrome</strong>, navigate to: Settings &gt; Privacy and Security &gt; Third-party cookies.
                    </li>
                    <li>
                      To manage cookies in <strong className="text-slate-900">Mozilla Firefox</strong>, navigate to: Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data.
                    </li>
                    <li>
                      To manage cookies in <strong className="text-slate-900">Apple Safari</strong>, navigate to: Settings &gt; Privacy &gt; Prevent cross-site tracking / Block all cookies.
                    </li>
                  </ul>
                  <p>
                    Please note that if you choose to block or disable essential cookies, certain features of this website (specifically admin access and form persistence) may not function as intended.
                  </p>
                </div>
              </section>

              {/* SECTION 7: DATA SECURITY & STORAGE */}
              <section id="data-security" className="scroll-mt-32 border-b border-slate-200/80 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    7. Data Security &amp; Storage
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    We take the security of your personal data seriously. All registration and application information is transmitted using secure HTTPS encryption and stored inside Supabase databases protected by Row-Level Security (RLS) policies.
                  </p>
                  <p>
                    Access to your submission data is strictly limited to authorized coordinators of the Reinvent Africa Network team. We do not sell, rent, or trade your personal information to third parties. We will only share details with external entities when required to comply with law, or with your explicit consent (e.g. coordinate transportation/hotel arrangements with vendors).
                  </p>
                </div>
              </section>

              {/* SECTION 8: CONTACT US */}
              <section id="contact" className="scroll-mt-32 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h2 
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-display), Playfair Display, serif" }}
                  >
                    8. Contact Us
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed space-y-4">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy &amp; Cookie Policy or how we handle your personal data, please reach out to us at:
                  </p>
                  <div className="bg-slate-100/70 p-6 rounded-2xl border border-slate-200/60 max-w-md space-y-3 mt-4">
                    <p className="font-semibold text-slate-900">Reinvent Africa Network</p>
                    <p className="text-sm text-slate-600">Attn: Privacy Team</p>
                    <p className="text-sm text-slate-600">Accra, Ghana</p>
                    <div className="pt-2 flex flex-col gap-1.5 text-sm text-slate-700">
                      <span>Email: <a href="mailto:info@reinventaf.com" className="text-rose-800 hover:text-rose-900 font-medium transition-colors">info@reinventaf.com</a></span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-6 text-sm text-slate-400">
          <span>&copy; 2026 Reinvent Africa Network. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
            <a 
              href="https://www.linkedin.com/company/reinvent-africa-network/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors"
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
