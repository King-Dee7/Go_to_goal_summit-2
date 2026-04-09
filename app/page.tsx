"use client";

import { useEffect, useRef, useState } from "react";

const HERO_IMAGES = [
  { src: "/hero%202.avif", alt: "Crowd at summit event", position: "50% 42%" },
  { src: "/hero%205.jpg", alt: "Audience and stage lighting at summit", position: "50% 40%" },
  { src: "/hero%206.png", alt: "Summit visual moment", position: "50% 46%" },
  { src: "/hero%207.jpg", alt: "Conference audience in blue-lit venue", position: "50% 42%" },
  { src: "/hero%208.png", alt: "Networking crowd at summit", position: "50% 44%" },
];


export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [navLightTheme, setNavLightTheme] = useState(false);
  const lastScrollYRef = useRef(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);  const [speakerIndex, setSpeakerIndex] = useState(1);
  const [speakerFlipDirection, setSpeakerFlipDirection] = useState<"prev" | "next" | null>(null);
  const [speakerFlipping, setSpeakerFlipping] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showMobileHeroCtas, setShowMobileHeroCtas] = useState(true);
  const speakerCards = [
    {
      image: "/summit-speaker.png",
      alt: "Summit speaker profile",
      name: "Speaker Announcement",
      role: "Industry Leader & Executive",
    },
    {
      image: "/summit-networking.png",
      alt: "Featured summit speaker",
      name: "Featured Speaker",
      role: "Founder, Creator, Mentor",
    },
    {
      image: "/summit-audience.png",
      alt: "Summit contributor profile",
      name: "Speaker Announcement",
      role: "Creative & Cultural Architect",
    },
    {
      image: "/summit-stage.png",
      alt: "Speaker delivering session on stage",
      name: "Speaker Announcement",
      role: "Policy & Ecosystem Builder",
    },
    {
      image: "/summit-speaker.png",
      alt: "Summit keynote speaker portrait",
      name: "Speaker Announcement",
      role: "Entrepreneur & Founder",
    },
    {
      image: "/summit-networking.png",
      alt: "Summit contributor in audience conversation",
      name: "Speaker Announcement",
      role: "Creative Director & Strategist",
    },
  ];
  const speakerCount = speakerCards.length;
  const leftSpeaker = speakerCards[(speakerIndex - 1 + speakerCount) % speakerCount];
  const centerSpeaker = speakerCards[speakerIndex];
  const rightSpeaker = speakerCards[(speakerIndex + 1) % speakerCount];
  
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

  const flipSpeaker = (direction: "prev" | "next") => {
    if (speakerFlipping) return;

    setSpeakerFlipDirection(direction);
    setSpeakerFlipping(true);

    window.setTimeout(() => {
      setSpeakerIndex((previous) =>
        direction === "next"
          ? (previous + 1) % speakerCount
          : (previous - 1 + speakerCount) % speakerCount
      );
    }, 230);

    window.setTimeout(() => {
      setSpeakerFlipping(false);
      setSpeakerFlipDirection(null);
    }, 520);
  };

  // We need to inject dynamic attributes back. 
  // Let's replace the static HTML fragments with our state logic below.
  return (
    <main>


{/*  ========== NAVIGATION ==========  */}
<nav className={`nav ${navLightTheme ? 'light-theme' : ''} ${navScrolled ? 'scrolled' : ''} ${navHidden ? 'nav-hidden' : ''}`} id="nav">
  <div className="nav-inner">
    <a href="#" className="nav-logo">
      <img src="/reinvent-logo.png" alt="Reinvent Africa Network" style={{ height: "50px", width: "auto" }} />
    </a>
    <ul className={`nav-links ${mobileNavOpen ? 'mobile-open' : ''}`} id="navLinks">
      <li><a href="#story">About</a></li>
      <li><a href="#experience">Experience</a></li>
      <li><a href="#agenda">Agenda</a></li>
      <li><a href="#speakers">Speakers</a></li>
      <li><a href="#sponsors">Partners</a></li>
      <li><a href="#faq">FAQ</a></li>
      <li><a href="#register" className="nav-cta">Join us in Accra</a></li>
    </ul>
    <div className="nav-hamburger" id="hamburger" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
      <span></span><span></span><span></span>
    </div>
  </div>
</nav>

{/*  ========== 01. HERO ==========  */}
<section className="hero" id="home">
  <div className="hero-bg-slides" aria-hidden="true">
    {HERO_IMAGES.map((image, index) => (
      <img
        key={image.src}
        className={`hero-bg-slide ${index === currentHeroIndex ? "is-active" : ""}`}
        src={image.src}
        alt={image.alt}
        style={{ objectPosition: image.position }}
      />
    ))}
  </div>
  <div className="hero-shell">
    <div className="hero-content-wide">
      <div className="hero-statement reveal reveal-delay-1">
        <h1 className="hero-title">FROM GO TO GOAL</h1>
        <div className="hero-event-line">
          <span className="hero-event-name">RAN</span>
          <span className="hero-event-year">2026</span>
        </div>
        <div className="hero-date-line">
          <span>May 23rd, 2026</span>
          <span className="hero-date-dot" aria-hidden="true">•</span>
          <span>Accra, Ghana</span>
        </div>
      </div>

      <p className="hero-subtitle-theme reveal reveal-delay-2">The Architecture of Ambition: Bridging Vision &amp; Value</p>

      <div className={`hero-ctas reveal reveal-delay-3 ${showMobileHeroCtas ? "" : "mobile-ctas-hidden"}`}>
        <a href="#register" className="hero-cta-primary">
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
        Hear the world's most compelling voices to share raw, unfiltered stories that transform aspiration into <span className="about-tedai-stamp">action.</span>
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
          <img src="/summit-speaker.png" alt="Speaker on stage at the summit" />
        </div>
        <div className="waterfall-img waterfall-img-2">
          <img src="/summit-networking.png" alt="Professionals networking at the summit" />
        </div>
        <div className="waterfall-img waterfall-img-3">
          <img src="/summit-stage.png" alt="Summit stage and venue" />
        </div>
        <div className="waterfall-img waterfall-img-4">
          <img src="/summit-audience.png" alt="Audience member at the summit" />
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
        <img src="/summit-speaker.png" alt="Speaker delivering a keynote on stage" />
      </div>
      <div className="experience-inbound-card-body">
        <h3>Hear Real Stories</h3>
        <p>Unfiltered journeys of failure, growth, and breakthrough from seasoned professionals across industries. No rehearsed talks, just honest accounts of what it takes to build something meaningful.</p>
        <a href="#agenda" className="experience-inbound-card-link">See sessions</a>
      </div>
    </div>
    <div className="experience-inbound-card reveal reveal-delay-1">
      <div className="experience-inbound-card-img">
        <img src="/summit-networking.png" alt="Professionals networking at the summit" />
      </div>
      <div className="experience-inbound-card-body">
        <h3>Build Your Network</h3>
        <p>Connect with mentors, peers, and collaborators through structured networking moments designed to spark real relationships. Leave with contacts who share your ambition and can open new doors.</p>
        <a href="#register" className="experience-inbound-card-link">Reserve your seat</a>
      </div>
    </div>
    <div className="experience-inbound-card reveal reveal-delay-2">
      <div className="experience-inbound-card-img">
        <img src="/summit-audience.png" alt="Engaged audience at the summit" />
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
          <p className="agenda-row-date">May 23</p>
          <h3 className="agenda-row-title">Opening Sessions</h3>
          <p className="agenda-row-blurb">
            The day starts with bold keynotes and context-setting conversations on ambition, leadership,
            and the systems behind real progress.
          </p>
        </div>
        <div className="agenda-row-media">
          <img src="/summit-stage.png" alt="Summit stage during opening session" />
        </div>
      </article>

      <article className="agenda-row reveal reveal-delay-1">
        <div className="agenda-row-copy">
          <p className="agenda-row-date">May 23</p>
          <h3 className="agenda-row-title">Panel Discussions</h3>
          <p className="agenda-row-blurb">
            Founders, operators, and creatives share practical lessons on building momentum, navigating setbacks,
            and turning vision into measurable value.
          </p>
        </div>
        <div className="agenda-row-media">
          <img src="/summit-networking.png" alt="Professionals discussing ideas in a panel environment" />
        </div>
      </article>

      <article className="agenda-row reveal reveal-delay-2">
        <div className="agenda-row-copy">
          <p className="agenda-row-date">May 23</p>
          <h3 className="agenda-row-title">Networking &amp; Close</h3>
          <p className="agenda-row-blurb">
            Curated networking moments and an intentional close designed to help you leave with clear next steps,
            stronger relationships, and immediate action points.
          </p>
        </div>
        <div className="agenda-row-media">
          <img src="/summit-audience.png" alt="Audience networking and engaging at summit close" />
        </div>
      </article>
    </div>

    <div className="agenda-cta reveal">
      <a href="#register" className="btn-primary">Reserve Your Seat</a>
    </div>
  </div>
</section>

{/*  ========== 05. SPEAKERS ==========  */}
<section className="speakers" id="speakers">
  <div className="container">
    <div className="speakers-header">
      <h2 className="speakers-title reveal">Speakers &amp; Contributors</h2>
      <a href="#" className="btn-secondary speakers-nominate reveal" style={{"display":"inline-flex","padding":"10px 24px","fontSize":"13px"}}>Nominate a Speaker</a>
    </div>
    <div className="speakers-grid-desktop reveal">
      {speakerCards.map((speaker, index) => (
        <div className="speaker-card speaker-card-grid" key={`${speaker.name}-${index}`}>
          <div className="speaker-photo">
            <img src={speaker.image} alt={speaker.alt} />
            <div className="speaker-overlay">
              <div className="speaker-name">{speaker.name}</div>
              <div className="speaker-role">{speaker.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="speakers-carousel-mobile speakers-carousel reveal">
      <button
        className="speaker-arrow speaker-arrow-left"
        onClick={() => flipSpeaker("prev")}
        aria-label="Show previous speaker"
        type="button"
      >
        &#8249;
      </button>
      <div className="speakers-track">
        <div className="speaker-card speaker-card-side">
          <div className="speaker-photo">
            <img src={leftSpeaker.image} alt={leftSpeaker.alt} />
            <div className="speaker-overlay">
              <div className="speaker-name">{leftSpeaker.name}</div>
              <div className="speaker-role">{leftSpeaker.role}</div>
            </div>
          </div>
        </div>

        <div
          className={`speaker-card speaker-card-featured ${
            speakerFlipping && speakerFlipDirection === "next"
              ? "speaker-card-flip-next"
              : ""
          } ${
            speakerFlipping && speakerFlipDirection === "prev"
              ? "speaker-card-flip-prev"
              : ""
          }`}
        >
          <div className="speaker-photo">
            <img src={centerSpeaker.image} alt={centerSpeaker.alt} />
            <div className="speaker-overlay">
              <div className="speaker-name">{centerSpeaker.name}</div>
              <div className="speaker-role">{centerSpeaker.role}</div>
            </div>
          </div>
        </div>

        <div className="speaker-card speaker-card-side">
          <div className="speaker-photo">
            <img src={rightSpeaker.image} alt={rightSpeaker.alt} />
            <div className="speaker-overlay">
              <div className="speaker-name">{rightSpeaker.name}</div>
              <div className="speaker-role">{rightSpeaker.role}</div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="speaker-arrow speaker-arrow-right"
        onClick={() => flipSpeaker("next")}
        aria-label="Show next speaker"
        type="button"
      >
        &#8250;
      </button>
    </div>

    <div className="speaker-cta-row reveal">
      <p style={{"color":"rgba(255,255,255,0.88)","fontSize":"20px","lineHeight":"1.4","marginBottom":"14px"}}>Speaker lineup will be announced soon. Want to be part of it?</p>
      <a href="mailto:hello@reinventafrica.org" className="speakers-contact-btn" style={{"display":"inline-flex","padding":"12px 28px","fontSize":"14px"}}>Get in Touch &rarr;</a>
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
      <div className="sponsor-logo-item"><img src="/sponsors/pwc.svg" alt="PWC logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/foley.svg" alt="Foley logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/xero.svg" alt="Xero logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/dataiku.svg" alt="Dataiku logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/shack15.svg" alt="Shack15 logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/hpe.svg" alt="HPE logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/udemy.svg" alt="Udemy logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/xai-labs.svg" alt="XAI Labs logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/oracle.svg" alt="Oracle logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/commtel.svg" alt="Commtel logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/vectara.svg" alt="Vectara logo" /></div>
      <div className="sponsor-logo-item"><img src="/sponsors/fetch-ai.svg" alt="Fetch.ai logo" /></div>
    </div>

    <div className="sponsor-cta reveal">
      <a href="mailto:partnerships@reinventafrica.org" className="sponsor-cta-btn">Become a Sponsor</a>
    </div>
  </div>
</section>

{/*  ========== 08. ABOUT REINVENT AFRICA NETWORK ==========  */}
<section className="about-org" id="about-org">
  <div className="container">
    <div className="about-org-inner">
      <div>
        <div className="section-label reveal">The Organizers</div>
        <h2 className="about-org-title reveal">Reinvent Africa Network</h2>
        <p className="about-org-text reveal">
          A non-profit organization committed to redefining opportunity, mentorship, and access for Africa's present and future generations. FROM GO TO GOAL is a flagship initiative of this mission.
        </p>
        <ul className="about-org-pillars reveal">
          <li>Mentorship &amp; leadership development</li>
          <li>Access to opportunity &amp; knowledge</li>
          <li>Building ecosystems for African talent to thrive locally and globally</li>
        </ul>
      </div>
      <div className="about-org-visual reveal">
        <span>Reinvent<br />Africa</span>
      </div>
    </div>
  </div>
</section>

{/*  ========== 09. FAQ ==========  */}
<section className="faq" id="faq">
  <div className="container">
    <div className="faq-header">
      <div className="section-label reveal">Questions</div>
      <h2 className="faq-title reveal">Frequently Asked Questions</h2>
    </div>
    <div className="faq-list">
      <details className="faq-item reveal">
        <summary className="faq-question">
          What is FROM GO TO GOAL?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>FROM GO TO GOAL is a high-impact leadership and innovation summit designed to bridge the gap between ambition and execution, vision and value, and dreams and tangible outcomes. It convenes purpose-driven individuals, industry leaders, and change-makers to share real stories and practical frameworks.</p></div>
      </details>

      <details className="faq-item reveal">
        <summary className="faq-question">
          Who can attend the summit?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>The summit is open to students, recent graduates, young professionals, entrepreneurs, creatives, corporate professionals, NGO leaders, mentors, and ecosystem builders. If you're driven by ambition and ready to learn, this event is for you.</p></div>
      </details>

      <details className="faq-item reveal">
        <summary className="faq-question">
          Is there a cost to attend?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>Registration details and ticket pricing will be announced soon. Sign up for our newsletter to be first to know when early-bird tickets become available.</p></div>
      </details>

      <details className="faq-item reveal">
        <summary className="faq-question">
          Where and when is the summit taking place?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>The summit will be held in Accra, Ghana. Exact date and venue details will be confirmed shortly. Stay connected through our newsletter for updates.</p></div>
      </details>

      <details className="faq-item reveal">
        <summary className="faq-question">
          Can I attend virtually?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>We are exploring virtual attendance and livestream options. Follow our updates for the latest on remote participation opportunities.</p></div>
      </details>

      <details className="faq-item reveal">
        <summary className="faq-question">
          How do I become a speaker?
          <span className="faq-icon">+</span>
        </summary>
        <div className="faq-answer"><p>We're actively seeking speakers who can share authentic, unfiltered stories and practical insights. If you'd like to be considered or nominate someone, reach out via our contact email or use the "Nominate a Speaker" link above.</p></div>
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
      FROM GO TO GOAL is more than an event. It is a movement toward intentional ambition. Will you be part of it?
    </p>
    <div className="reveal">
        <a href="#" className="btn-primary" style={{"fontSize":"17px","padding":"18px 44px"}}>Apply to Attend</a>
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
          <img src="/reinvent-logo.png" alt="Reinvent Africa Network" style={{ height: "60px", width: "auto", marginBottom: "16px" }} />
        </div>
        <p className="footer-brand-desc">
          A flagship initiative of Reinvent Africa Network. Bridging vision and value for Africa's present and future generations.
        </p>
      </div>
      <div>
        <div className="footer-col-title">Navigate</div>
        <ul className="footer-links">
          <li><a href="#story">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#agenda">Agenda</a></li>
          <li><a href="#speakers">Speakers</a></li>
          <li><a href="#register">Register</a></li>
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
        <a href="#">LinkedIn</a>
        <a href="#">Instagram</a>
        <a href="#">X / Twitter</a>
        <a href="#">YouTube</a>
      </div>
    </div>
  </div>
</footer>

{/*  ========== SCRIPTS ==========  */}

    </main>
  );
}






















