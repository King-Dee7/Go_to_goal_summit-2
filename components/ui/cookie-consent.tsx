"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check localStorage safely on the client
    const consent = localStorage.getItem("gtg_cookie_consent");
    let timer: NodeJS.Timeout;

    if (!consent) {
      timer = setTimeout(() => {
        setIsVisible(true);
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      }, 1500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleConsent = (preference: "accepted" | "declined") => {
    localStorage.setItem("gtg_cookie_consent", preference);
    setIsAnimating(false);

    // Unmount after transition animation finishes
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 left-6 md:left-auto z-[999] transition-all duration-500 ease-out transform ${
        isAnimating
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center w-full md:w-80 bg-white text-gray-500 p-4 md:p-6 rounded-lg border border-gray-500/30 text-sm shadow-2xl relative mt-12">
        {/* Absolute positioned cookie image */}
        <div className="flex items-center justify-center relative w-full gap-2 pb-3">
          <img
            className="absolute -top-14 md:-top-16 w-24 h-24 pointer-events-none select-none"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/cookies/cookieImage2.svg"
            alt="Cookie"
          />
          <h2 className="text-gray-800 text-xl font-medium text-left w-full pt-6 md:pt-8">
            Your privacy is important to us
          </h2>
        </div>

        <p className="text-gray-500 leading-relaxed text-left">
          We process your personal information to measure and improve our sites and services, to assist our campaigns and to provide personalised content. For more information see our{" "}
          <Link
            href="/privacy"
            className="font-medium underline text-gray-700 hover:text-gray-950 transition-colors"
          >
            Privacy Policy.
          </Link>
        </p>

        <div className="flex items-center justify-between mt-6 gap-3 w-full">
          <button
            onClick={() => handleConsent("declined")}
            className="underline text-gray-500 hover:text-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="bg-indigo-600 px-6 py-2 rounded text-white font-medium active:scale-95 transition hover:bg-indigo-700 shadow-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
