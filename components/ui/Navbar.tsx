"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  forceLight?: boolean;
}

export function Navbar({ forceLight = false }: NavbarProps) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navLightTheme, setNavLightTheme] = useState(forceLight);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (forceLight) {
      setNavLightTheme(true);
    }
  }, [forceLight]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const isMobileViewport = window.innerWidth <= 1200;

      setNavScrolled(currentY > 60);

      if (!forceLight) {
        const navElement = document.getElementById("nav");
        const heroSection = document.getElementById("home");
        const navHeight = navElement?.offsetHeight ?? 80;
        const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 0;
        const inHeroSection = currentY + navHeight < heroBottom;
        setNavLightTheme(!inHeroSection);
      }

      if (isMobileViewport) {
        setNavHidden(false);
        lastScrollYRef.current = currentY;
      } else if (currentY <= 48) {
        setNavHidden(false);
        lastScrollYRef.current = currentY;
      } else if (Math.abs(currentY - lastY) > 8) {
        setNavHidden(currentY > lastY);
        lastScrollYRef.current = currentY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [forceLight]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <nav
      className={`nav ${navLightTheme ? "light-theme" : ""} ${navScrolled ? "scrolled" : ""} ${navHidden ? "nav-hidden" : ""}`}
      id="nav"
    >
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <Image
            src={navLightTheme ? "/reinvent-logo.png" : "/reinvent-logo-white.png"}
            alt="Reinvent Africa Network"
            width={250}
            height={62}
            unoptimized
            priority
          />
        </Link>
        <ul
          className={`nav-links ${mobileNavOpen ? "mobile-open" : ""}`}
          id="nav-menu"
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("a")) {
              setMobileNavOpen(false);
            }
          }}
        >
          <li><Link href="/#story">About</Link></li>
          <li><Link href="/#experience">Experience</Link></li>
          <li><Link href="/#agenda">Agenda</Link></li>
          <li><Link href="/#speakers">Speakers</Link></li>
          <li><Link href="/#sponsors">Partners</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
          <li><Link href="/apply" className="nav-cta">Apply to Attend</Link></li>
        </ul>
        <button
          className="nav-hamburger"
          id="hamburger"
          type="button"
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
          aria-controls="nav-menu"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
