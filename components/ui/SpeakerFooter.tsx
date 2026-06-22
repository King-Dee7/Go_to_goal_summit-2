"use client";

import Link from "next/link";
import { useState } from "react";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function SpeakerFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-0">
      
      {/* Main Footer Content */}
      <div className="max-w-none px-8 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          
          {/* Left: Navigation Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer navigation">
            <Link href="/#story" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">About</Link>
            <Link href="/#agenda" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Agenda</Link>
            <Link href="/#experience" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Experience</Link>
            <Link href="/#sponsors" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Partners</Link>
            <Link href="/#speakers" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Speakers</Link>
            <Link href="/#faq" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">FAQ</Link>
            <Link href="/apply" className="text-sm text-slate-700 hover:text-slate-900 transition-colors">Apply to Attend</Link>
          </nav>

          {/* Right: Newsletter Signup */}
          <div className="lg:max-w-sm w-full flex-shrink-0">
            <p className="text-base font-semibold text-slate-900 mb-3">Get the newsletter</p>
            {subscribed ? (
              <p className="text-sm text-green-700 font-medium">Thank you for subscribing!</p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 text-sm border border-slate-300 border-r-0 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 bg-white"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#af2122] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#8a1a1a] transition-colors flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  I&apos;d like to receive event news and updates from{" "}
                  <strong className="text-slate-700">Reinvent Africa Network</strong> and the{" "}
                  <strong className="text-slate-700">From Go To Goal Summit</strong>. By signing up, you agree to our{" "}
                  <Link href="/privacy" className="text-[#af2122] hover:underline">Privacy Policy</Link>.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Social Icons Row */}
        <div className="flex gap-5 mt-12 pt-8 border-t border-slate-200">
          <a
            href="https://www.instagram.com/reinventafrica54/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.linkedin.com/company/reinvent-africa-network/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200 px-8 md:px-12 lg:px-16 py-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-6 flex-wrap">
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 From Go To Goal Summit. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}
