"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CardStack } from "@/components/ui/card-stack";
import { speakerCards } from "@/lib/data/speakers";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Call at mount
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

const HERO_IMAGES = [
  { src: "/hero%202.avif", alt: "Summit highlight moment", position: "50% 50%" },
  { src: "/hero%205.jpg", alt: "Audience and stage lighting at summit", position: "50% 40%" },
  { src: "/hero%206.png", alt: "Summit visual moment", position: "50% 46%" },
  { src: "/hero%207.jpg", alt: "Key summit interaction", position: "50% 50%" },
  { src: "/hero%208.jpg", alt: "Networking crowd at summit", position: "50% 44%" },
];
const SPONSOR_LOGOS = [
  { src: "/sponsors/pwc.svg", alt: "PWC logo" },
  { src: "/sponsors/foley.svg", alt: "Foley logo" },
  { src: "/sponsors/xero.svg", alt: "Xero logo" },
  { src: "/sponsors/dataiku.svg", alt: "Dataiku logo" },
  { src: "/sponsors/shack15.svg", alt: "Shack15 logo" },
  { src: "/sponsors/hpe.svg", alt: "HPE logo" },
  { src: "/sponsors/udemy.svg", alt: "Udemy logo" },
  { src: "/sponsors/xai-labs.svg", alt: "XAI Labs logo" },
  { src: "/sponsors/oracle.svg", alt: "Oracle logo" },
  { src: "/sponsors/commtel.svg", alt: "Commtel logo" },
  { src: "/sponsors/vectara.svg", alt: "Vectara logo" },
  { src: "/sponsors/fetch-ai.svg", alt: "Fetch.ai logo" },
];
const SITE_URL = "https://go-to-goal-summit-2.vercel.app";
const EVENT_START_DATE = "2026-07-17T09:00:00+00:00";
const EVENT_END_DATE = "2026-07-17T19:00:00+00:00";
const SPLASH_SEEN_KEY = "gtg_splash_seen";
const ENTRY_PATH_KEY = "gtg_entry_path";


export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [splashExiting, setSplashExiting] = useState(false);
  const [siteReady, setSiteReady] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navLightTheme, setNavLightTheme] = useState(false);
  const lastScrollYRef = useRef(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { width: windowWidth } = useWindowSize();
  
  // Calculate CardStack dimensions based on breakpoints
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const cardWidth = isMobile ? 280 : isTablet ? 400 : 520;
  const cardHeight = isMobile ? 360 : 320;
  const cardOverlap = isMobile ? 0.6 : 0.48;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Reinvent Africa Network",
    url: SITE_URL,
    logo: `${SITE_URL}/reinvent-logo.png`,
    sameAs: [
      "https://www.linkedin.com",
      "https://www.instagram.com",
      "https://twitter.com",
      "https://www.youtube.com",
    ],
  };
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "From Go To Goal Summit 2026",
    description:
      "Join us July 17 for RAN2026, a defining gathering designed to equip the next generation of African builders, entrepreneurs, creators and professionals with raw unfiltered stories, connections and actionable insight to turn ambition into action.",
    image: [`${SITE_URL}/real-og.jpg`],
    startDate: EVENT_START_DATE,
    endDate: EVENT_END_DATE,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Accra, Ghana",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Accra",
        addressCountry: "GH",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Reinvent Africa Network",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/#signup-updates`,
      availability: "https://schema.org/InStock",
      priceCurrency: "GHS",
      price: "0",
    },
  };

  useEffect(() => {
    let splashDisplayTimer: number | undefined;
    let splashRemoveTimer: number | undefined;

    try {
      const entryPath = sessionStorage.getItem(ENTRY_PATH_KEY) || "/";
      const hasSeenSplash = sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
      const shouldShowSplash = entryPath === "/" && !hasSeenSplash;

      if (!shouldShowSplash) {
        setShowSplash(false);
        setSplashExiting(false);
        setSiteReady(true);
        return;
      }

      sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
      setShowSplash(true);
      setSplashExiting(false);
      setSiteReady(false);

      splashDisplayTimer = window.setTimeout(() => {
        setSplashExiting(true);
        setSiteReady(true);
      }, 2500);

      splashRemoveTimer = window.setTimeout(() => {
        setShowSplash(false);
      }, 3400);
    } catch {
      setShowSplash(false);
      setSplashExiting(false);
      setSiteReady(true);
    }

    return () => {
      if (splashDisplayTimer) {
        window.clearTimeout(splashDisplayTimer);
      }
      if (splashRemoveTimer) {
        window.clearTimeout(splashRemoveTimer);
      }
    };
  }, []);

  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Dedicated audience fill observer (mobile-safe)
    const isMobileViewport = window.innerWidth <= 768;
    const audienceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            audienceObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: isMobileViewport ? 0.2 : 0.3,
        rootMargin: isMobileViewport ? "0px 0px -12% 0px" : "0px 0px -8% 0px",
      }
    );

    document.querySelectorAll(".audience-role-row").forEach((el) => audienceObserver.observe(el));

    // Nav scroll effect
    const handleScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const isMobileViewport = window.innerWidth <= 768;
      const navElement = document.getElementById("nav");
      const heroSection = document.getElementById("home");
      const navHeight = navElement?.offsetHeight ?? 80;
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 0;
      const inHeroSection = currentY + navHeight < heroBottom;

      setNavLightTheme(!inHeroSection);
      setNavScrolled(currentY > 60);

      if (isMobileViewport) {
        setNavHidden(false);
      } else if (currentY <= 48) {
        setNavHidden(false);
      } else if (currentY > lastY) {
        setNavHidden(true);
      } else if (currentY < lastY) {
        setNavHidden(false);
      }

      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      audienceObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;
    const intervalId = window.setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);



  // We need to inject dynamic attributes back. 
  // Let's replace the static HTML fragments with our state logic below.
  return (
    <>
      {showSplash && (
        <div className={`site-preloader ${splashExiting ? "is-exiting" : ""}`} aria-hidden={splashExiting}>
          <div className="site-preloader-content">
            <Image
              className="site-preloader-logo"
              src="/reinvent-logo-white.png"
              alt="Reinvent Africa Network"
              width={430}
              height={107}
              unoptimized
              priority
            />
            <div className="site-preloader-loadingline" aria-hidden="true">
              <span className="site-preloader-loadingline-fill"></span>
            </div>
          </div>
        </div>
      )}
      <main className={`site-shell ${siteReady ? "is-visible" : ""}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />


        {/*  ========== NAVIGATION ==========  */}
        <nav className={`nav ${navLightTheme ? 'light-theme' : ''} ${navScrolled ? 'scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`} id="nav">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <Image
                src={navLightTheme ? "/reinvent-logo.png" : "/reinvent-logo-white.png"}
                alt="Reinvent Africa Network"
                width={250}
                height={62}
                unoptimized
                priority
              />
            </a>
            <ul
              className={`nav-links ${mobileNavOpen ? 'mobile-open' : ''}`}
              id="nav-menu"
              onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("a")) {
                  setMobileNavOpen(false);
                }
              }}
            >
              <li><a href="#story">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#agenda">Agenda</a></li>
              <li><a href="#speakers">Speakers</a></li>
              <li><a href="#sponsors">Partners</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="/apply" className="nav-cta">Apply to Attend</a></li>
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
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>

        {/*  ========== 01. HERO ==========  */}
        <section className="hero" id="home">
          <div className="hero-bg-slides" aria-hidden="true">
            {HERO_IMAGES.map((image, index) => (
              <Image
                key={image.src}
                className={`hero-bg-slide ${index === currentHeroIndex ? "is-active" : ""}`}
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                quality={85}
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                style={{ objectPosition: image.position }}
              />
            ))}
          </div>
          <div className="hero-shell">
            <div className="hero-content-wide">
              <div className="hero-statement reveal reveal-delay-1">
                <h1 className="hero-title"><span className="hero-top-text md:whitespace-nowrap">FROM GO TO GOAL</span><br className="hidden md:block" /><span className="hero-main-text">SUMMIT</span></h1>
                <div className="hero-event-line">
                  <span className="hero-event-name">RAN</span>
                  <span className="hero-event-year">2026</span>
                </div>
                <div className="hero-date-line">
                  <span>July 17</span>
                  <span className="hero-date-dot" aria-hidden="true">&bull;</span>
                  <span>Accra, Ghana</span>
                </div>
              </div>

              <p className="hero-subtitle-theme reveal reveal-delay-2">The Architecture of Ambition: Bridging Vision &amp; Value for Global Acclaim</p>

              <div className="hero-ctas reveal reveal-delay-3">
                <a href="/apply" className="hero-cta-primary">
                  <span className="hero-cta-fill" aria-hidden="true"></span>
                  <span className="hero-cta-label">Apply to Attend</span>
                </a>
                <a href="#agenda" className="hero-cta-secondary">View Agenda</a>
              </div>
            </div>
          </div>
        </section>

        {/*  ========== 02. NEW ABOUT / STORY (TEDAI STYLE) ==========  */}
        <section className="about-tedai" id="story">
          <div className="about-tedai-header">
            <p className="about-tedai-lead reveal">
              Hear the world&apos;s most compelling voices to share raw, unfiltered stories that transform aspiration into <span className="about-tedai-stamp">action.</span>
            </p>
          </div>

          <div className="about-tedai-inner">
            {/* Left Column: Text */}
            <div className="about-tedai-text">
              <div className="about-tedai-body">
                <p className="reveal reveal-delay-1">
                  Imagine a society where dreams genuinely become reality, where people who look like you, talk like you, and walk like you are visibly able to reach all their dreams placed on the highest shelves.
                </p>
                <p className="reveal reveal-delay-2">
                  The time is now for us to care deliberately and collectively. To be great mentors. Inspiring role models. Intentional coaches. And thoughtful career advisors.
                </p>
                <p className="reveal reveal-delay-3">
                  We cannot reasonably expect current and future generations to become exceptional leaders, inventors, innovators, and change makers without making any meaningful and direct impact on their lives. This summit is our answer.
                </p>
              </div>
            </div>

            {/* Right Column: TEDAI Waterfall Images */}
            <div className="waterfall-collage reveal">
              <div className="waterfall-img waterfall-img-1">
                <Image src="/summit-speaker.png" alt="Speaker on stage at the summit" fill sizes="196px" quality={85} loading="lazy" />
              </div>
              <div className="waterfall-img waterfall-img-2">
                <Image src="/summit-networking.png" alt="Professionals networking at the summit" fill sizes="196px" quality={85} loading="lazy" />
              </div>
              <div className="waterfall-img waterfall-img-3">
                <Image src="/summit-stage.png" alt="Summit stage and venue" fill sizes="196px" quality={85} loading="lazy" />
              </div>
              <div className="waterfall-img waterfall-img-4">
                <Image src="/summit-audience.png" alt="Audience member at the summit" fill sizes="196px" quality={85} loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/*  ========== 03. WHAT YOU'LL EXPERIENCE ==========  */}
        <section className="experience-inbound" id="experience">
          <div className="experience-inbound-header">
            <h2 className="experience-inbound-title reveal">The Experience</h2>
            <p className="experience-inbound-sub reveal">No panels that talk at you. No theory without application. Every session puts you in the room with people who&apos;ve actually done it, and challenges you to leave with something you can use.</p>
          </div>
          <div className="experience-inbound-grid">
            <div className="experience-inbound-card reveal">
              <div className="experience-inbound-card-img">
                <Image src="/summit-speaker.png" alt="Speaker delivering a keynote on stage" fill sizes="(max-width: 900px) 100vw, 33vw" quality={85} loading="lazy" />
              </div>
              <div className="experience-inbound-card-body">
                <h3>Hear Real Stories</h3>
                <p>Unfiltered journeys of failure, growth, and breakthrough from seasoned professionals across industries. No rehearsed talks, just honest accounts of what it takes to build something meaningful.</p>
                <a href="#agenda" className="experience-inbound-card-link">See sessions</a>
              </div>
            </div>
            <div className="experience-inbound-card reveal reveal-delay-1">
              <div className="experience-inbound-card-img">
                <Image src="/summit-networking.png" alt="Professionals networking at the summit" fill sizes="(max-width: 900px) 100vw, 33vw" quality={85} loading="lazy" />
              </div>
              <div className="experience-inbound-card-body">
                <h3>Build Your Network</h3>
                <p>Connect with mentors, peers, and collaborators through structured networking moments designed to spark real relationships. Leave with contacts who share your ambition and can open new doors.</p>
                <a href="/apply" className="experience-inbound-card-link">Apply to attend</a>
              </div>
            </div>
            <div className="experience-inbound-card reveal reveal-delay-2">
              <div className="experience-inbound-card-img">
                <Image src="/summit-audience.png" alt="Engaged audience at the summit" fill sizes="(max-width: 900px) 100vw, 33vw" quality={85} loading="lazy" />
              </div>
              <div className="experience-inbound-card-body">
                <h3>Gain Practical Tools</h3>
                <p>Learn how speakers achieved goals once considered impossible. Understand the business behind passion and walk away with actionable frameworks and strategies you can apply the next day.</p>
                <a href="#story" className="experience-inbound-card-link">Why this summit</a>
              </div>
            </div>
          </div>
        </section>

        {/*  ========== 04. AGENDA ==========  */}
        <section className="agenda" id="agenda">
          <div className="agenda-editorial">
            <div className="agenda-editorial-header reveal">
              <h2 className="agenda-editorial-title">
                <span>Summit</span>
                <em className="agenda-stamp">program</em>
              </h2>
            </div>

            <div className="agenda-filters reveal">
              <span className="agenda-filter-tag">Keynotes</span>
              <span className="agenda-filter-tag">Panels</span>
              <span className="agenda-filter-tag">Fireside conversations</span>
              <span className="agenda-filter-tag">Interactive Q&amp;A</span>
              <span className="agenda-filter-tag">Networking</span>
            </div>

            <div className="agenda-rows">
              <article className="agenda-row reveal">
                <div className="agenda-row-copy">
                  <p className="agenda-row-date">July 17</p>
                  <h3 className="agenda-row-title">Opening Sessions</h3>
                  <p className="agenda-row-blurb">
                    The day starts with bold keynotes and context-setting conversations on ambition, leadership,
                    and the systems behind real progress.
                  </p>
                </div>
                <div className="agenda-row-media">
                  <Image src="/Opening Sessions.png" alt="Summit stage during opening session" fill sizes="(max-width: 1024px) 100vw, 34vw" quality={85} loading="lazy" />
                </div>
              </article>

              <article className="agenda-row reveal reveal-delay-1">
                <div className="agenda-row-copy">
                  <p className="agenda-row-date">July 17</p>
                  <h3 className="agenda-row-title">Panel Discussions</h3>
                  <p className="agenda-row-blurb">
                    Founders, operators, and creatives share practical lessons on building momentum, navigating setbacks,
                    and turning vision into measurable value.
                  </p>
                </div>
                <div className="agenda-row-media">
                  <Image src="/Panel Discussions.jpg" alt="Professionals discussing ideas in a panel environment" fill sizes="(max-width: 1024px) 100vw, 34vw" quality={85} loading="lazy" />
                </div>
              </article>

              <article className="agenda-row reveal reveal-delay-2">
                <div className="agenda-row-copy">
                  <p className="agenda-row-date">July 17</p>
                  <h3 className="agenda-row-title">Networking &amp; Close</h3>
                  <p className="agenda-row-blurb">
                    Curated networking moments and an intentional close designed to help you leave with clear next steps,
                    stronger relationships, and immediate action points.
                  </p>
                </div>
                <div className="agenda-row-media">
                  <Image src="/Networking & Close.jpg" alt="Audience networking and engaging at summit close" fill sizes="(max-width: 1024px) 100vw, 34vw" quality={85} loading="lazy" />
                </div>
              </article>
            </div>

            <div className="agenda-cta reveal">
              <a href="/apply" className="btn-primary">Apply to Attend</a>
            </div>
          </div>
        </section>

        {/*  ========== 05. SPEAKERS ==========  */}
        <section className="speakers" id="speakers" style={{ overflow: "hidden", padding: "80px 0" }}>
          <div className="container">
            <div className="speakers-header" style={{ marginBottom: "60px" }}>
              <h2 className="speakers-title reveal">Speakers &amp; Contributors</h2>
              <a href="#" className="btn-secondary speakers-nominate reveal" style={{ "display": "inline-flex", "padding": "10px 24px", "fontSize": "13px" }}>Nominate a Speaker</a>
            </div>
            
            <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
              <CardStack
                items={speakerCards}
                initialIndex={0}
                autoAdvance
                intervalMs={3000}
                pauseOnHover
                showDots
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                overlap={cardOverlap}
                perspectivePx={isMobile ? 800 : 1100}
              />
            </div>

            <div className="speaker-cta-row reveal" style={{ marginTop: "60px" }}>
              <p style={{ "color": "rgba(255,255,255,0.88)", "fontSize": "20px", "lineHeight": "1.4", "marginBottom": "14px" }}>Speaker lineup will be announced soon. Want to be part of it?</p>
              <a href="mailto:hello@reinventafrica.org" className="speakers-contact-btn" style={{ "display": "inline-flex", "padding": "12px 28px", "fontSize": "14px" }}>Get in Touch &rarr;</a>
            </div>
          </div>
        </section>

        {/*  ========== 06. WHO SHOULD ATTEND ==========  */}
        <section className="audience" id="audience">
          <div className="audience-intro container reveal">
            <h2 className="audience-title">What&apos;s in it for you</h2>
            <p className="audience-sub">
              This summit is for everyone shaping the future of Africa&apos;s leadership and innovation landscape.
              Whether you&apos;re building your first path or scaling your impact, there&apos;s something designed for you.
            </p>
          </div>

          <div className="audience-roles">
            <article className="audience-role-row reveal">
              <div className="audience-role-left role-students"><span>Students</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Find your direction</p>
                <p className="audience-role-copy">Discover clarity before the world defines your path for you.</p>
              </div>
            </article>

            <article className="audience-role-row reveal reveal-delay-1">
              <div className="audience-role-left role-professionals"><span>Young professionals</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Accelerate your growth</p>
                <p className="audience-role-copy">Gain frameworks, mentors, and networks to level up your career faster.</p>
              </div>
            </article>

            <article className="audience-role-row reveal reveal-delay-2">
              <div className="audience-role-left role-founders"><span>Entrepreneurs</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Build what lasts</p>
                <p className="audience-role-copy">Learn how founders turned ideas into resilient, scalable businesses.</p>
              </div>
            </article>

            <article className="audience-role-row reveal reveal-delay-3">
              <div className="audience-role-left role-creatives"><span>Creatives</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Turn craft into leverage</p>
                <p className="audience-role-copy">See how culture, storytelling, and strategy combine to build influence.</p>
              </div>
            </article>

            <article className="audience-role-row reveal reveal-delay-4">
              <div className="audience-role-left role-corporate"><span>Corporate professionals</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Reconnect with purpose</p>
                <p className="audience-role-copy">Find new meaning and sharper direction for your next leadership chapter.</p>
              </div>
            </article>

            <article className="audience-role-row reveal reveal-delay-4">
              <div className="audience-role-left role-ngo"><span>NGO &amp; community leaders</span></div>
              <div className="audience-role-right">
                <p className="audience-role-kicker">Multiply your impact</p>
                <p className="audience-role-copy">Redefine mentorship and grow ecosystems that truly empower people.</p>
              </div>
            </article>
          </div>

          <div className="audience-outro container reveal">
            <p className="audience-tagline">
              Different roles,
              <br />
              same <span className="audience-tagline-stamp">obsession</span>.
            </p>
          </div>
        </section>

        {/*  ========== 07. SPONSORS & PARTNERS ==========  */}
        <section className="sponsors" id="sponsors">
          <div className="container">
            <div className="sponsors-header">
              <h2 className="sponsors-title reveal">Sponsors</h2>
              <p className="sponsors-sub reveal">Organizations supporting the movement.</p>
            </div>

            <div className="sponsor-logo-grid reveal">
              {SPONSOR_LOGOS.map((logo) => (
                <div className="sponsor-logo-item" key={logo.src}>
                  <Image src={logo.src} alt={logo.alt} width={160} height={46} />
                </div>
              ))}
            </div>

            <div className="sponsor-cta reveal">
              <a href="mailto:partnerships@reinventafrica.org" className="sponsor-cta-btn">Become a Sponsor</a>
            </div>
          </div>
        </section>

        <section className="about-org" id="about-org">
          <div className="container">
            <div className="about-org-inner">
              <div>
                <div className="section-label reveal">The Organizers</div>
                <h2 className="about-org-title reveal">Reinvent Africa Network</h2>
                <p className="about-org-text reveal">
                  A non-profit organization committed to redefining opportunity, mentorship, and access for Africa&apos;s present and future generations. FROM GO TO GOAL SUMMIT is a flagship initiative of this mission.
                </p>
                <ul className="about-org-pillars reveal">
                  <li>Mentorship &amp; leadership development</li>
                  <li>Access to opportunity &amp; knowledge</li>
                  <li>Building ecosystems for African talent to thrive locally and globally</li>
                </ul>
              </div>
              <div className="about-org-visual reveal">
                <Image
                  src="/RAN logo 1.jpg"
                  alt="Reinvent Africa Network Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/*  ========== 09. THE VENUE ==========  */}
        <section className="venue" id="venue">
          <Image
            src="/venue.jpg"
            alt="Google AI Community Center in Accra"
            fill
            sizes="100vw"
            className="venue-bg"
            quality={90}
          />
          <div className="venue-overlay"></div>
          <div className="container venue-container">
            <div className="venue-header">
              <div className="venue-eyebrow reveal">THE VENUE</div>
              <a
                href="https://maps.google.com/?q=Google+Accra+87+Independence+Ave"
                target="_blank"
                rel="noopener noreferrer"
                className="venue-directions reveal reveal-delay-3"
              >
                GET DIRECTIONS <span className="venue-directions-arrow">&rsaquo;</span>
              </a>
            </div>
            <div className="venue-content">
              <h2 className="venue-title reveal reveal-delay-1">
                The Google AI Community Center<br />
                at the <em>heart</em> of Accra
              </h2>
              <p className="venue-desc reveal reveal-delay-2">
                Located at 87 Independence Ave, Accra, this state-of-the-art center provides the perfect backdrop for innovation, learning, and meaningful connection.
              </p>
            </div>
          </div>
        </section>

        {/*  ========== 10. FAQ ==========  */}
        <section className="faq" id="faq">
          <div className="container">
            <div className="faq-header">
              <div className="section-label reveal">Questions</div>
              <h2 className="faq-title reveal">Frequently Asked Questions</h2>
            </div>
            <div className="faq-list">
              <details className="faq-item reveal">
                <summary className="faq-question">
                  What is FROM GO TO GOAL SUMMIT?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>FROM GO TO GOAL SUMMIT is a high-impact leadership and innovation summit designed to bridge the gap between ambition and execution, vision and value, and dreams and tangible outcomes. It convenes purpose-driven individuals, industry leaders, and change-makers to share real stories and practical frameworks.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  Who can attend the summit?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>The summit is open to purpose-driven individuals across all sectors—from students and founders to corporate leaders. However, to maintain a curated and intimate experience, all attendees must apply and be selected, or receive a personal invitation.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  Is there a cost to attend?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>Attendance is free. However, to ensure a high-impact environment for all participants, the summit is strictly application-based or by personal invitation only. You can submit your application directly through the portal.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  Where and when is the summit taking place?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>The summit is being held at the Google AI Community Center in Accra, Ghana. Exact date details will be confirmed shortly. Stay connected through our newsletter for updates.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  Can I attend virtually?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>Yes, you can attend virtually. However, details will be communicated soon. Follow our updates for the latest information.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  How do I become a speaker?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>We&apos;re actively seeking speakers who can share authentic, unfiltered stories and practical insights. If you&apos;d like to be considered or nominate someone, reach out via our contact email or use the &quot;Nominate a Speaker&quot; link above.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  How can my organization sponsor or partner?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>We offer title, category, and supporting partnership opportunities with brand visibility, audience engagement, and media exposure. Contact our partnerships team for the sponsorship deck and available packages.</p></div>
              </details>

              <details className="faq-item reveal">
                <summary className="faq-question">
                  What should I expect from the summit?
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer"><p>By the end of the summit, you should gain clarity on your personal and professional direction, understand the systems behind success, build meaningful networks with peers and mentors, and feel empowered to take decisive, intentional action.</p></div>
              </details>
            </div>
          </div>
        </section>

        {/*  ========== 10. FINAL CTA ==========  */}
        <section className="final-cta" id="register">
          <div className="container final-cta-content">
            <div className="section-label reveal">Join the Movement</div>
            <h2 className="final-cta-title reveal">Your story <em>starts</em> here</h2>
            <p className="final-cta-sub reveal">
              FROM GO TO GOAL SUMMIT is more than an event. It is a movement toward intentional ambition. Will you be part of it?
            </p>
            <div className="reveal">
              <a href="#signup-updates" className="btn-primary" style={{ "fontSize": "17px", "padding": "18px 44px" }}>Apply to Attend</a>
            </div>
          </div>
        </section>

        {/*  ========== 11. SIGN UP ==========  */}
        <section className="signup-section" id="signup-updates">
          <div className="signup-inner reveal">
            <h3 className="signup-title">Sign up for updates</h3>
            <p className="signup-sub">Get speaker announcements, agenda updates, and ticket release alerts.</p>
            <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required={true} />
              <input type="text" placeholder="Enter your first name" required={true} />
              <input type="text" placeholder="Enter your last name" required={true} />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </section>

        {/*  ========== 11. FOOTER ==========  */}
        <footer className="footer">
          <div className="container">
            <div className="footer-inner">
              <div>
                <div className="footer-brand-name">
                  <Image
                    src="/RAN-logo-footer.png"
                    alt="Reinvent Africa Network"
                    width={1624}
                    height={314}
                    loading="lazy"
                    style={{ height: "44px", width: "auto", marginBottom: "12px" }}
                  />
                </div>
                <p className="footer-brand-desc">
                  A flagship initiative of Reinvent Africa Network. Bridging vision and value for Africa&apos;s present and future generations.
                </p>
              </div>
              <div>
                <div className="footer-col-title">Navigate</div>
                <ul className="footer-links">
                  <li><a href="#story">About</a></li>
                  <li><a href="#experience">Experience</a></li>
                  <li><a href="#agenda">Agenda</a></li>
                  <li><a href="#speakers">Speakers</a></li>
                  <li><a href="#signup-updates">Sign Up</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Information</div>
                <ul className="footer-links">
                  <li><a href="#sponsors">Sponsor</a></li>
                  <li><a href="#faq">FAQ</a></li>
                  <li><a href="#">Code of Conduct</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <div className="footer-col-title">Contact</div>
                <ul className="footer-links">
                  <li><a href="mailto:hello@reinventafrica.org">hello@reinventafrica.org</a></li>
                  <li><a href="#">Accra, Ghana</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>&copy; 2026 Reinvent Africa Network. All rights reserved.</span>
              <div className="footer-socials">
                <a href="https://www.linkedin.com/company/reinvent-africa-network/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://www.instagram.com/reinventafrica54/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>
        </footer>

        {/*  ========== SCRIPTS ==========  */}

      </main>
    </>
  );
}






















