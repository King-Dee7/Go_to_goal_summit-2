"use client";

import { useEffect, useRef, useState } from "react";


export default function Home() {
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const verbs = ['dream', 'build', 'lead', 'start', 'rise', 'create'];
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const verbRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Hero verb cycling logic
    const cycleVerb = () => {
      if (!verbRef.current) return;
      
      verbRef.current.classList.remove('active');
      verbRef.current.classList.add('exit-up');
      
      setTimeout(() => {
        setCurrentVerbIndex((prev) => (prev + 1) % verbs.length);
        if (verbRef.current) {
          verbRef.current.classList.remove('exit-up');
          verbRef.current.classList.add('enter-below');
          
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (verbRef.current) {
                verbRef.current.classList.remove('enter-below');
                verbRef.current.classList.add('active');
              }
            });
          });
        }
      }, 500);
    };
    
    const interval = setInterval(cycleVerb, 2800);
    
    // Scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Nav scroll effect
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [verbs.length]);
  
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };
  
  // We need to inject dynamic attributes back. 
  // Let's replace the static HTML fragments with our state logic below.
  return (
    <main>


{/*  ========== NAVIGATION ==========  */}
<nav className={`nav ${navScrolled ? 'scrolled' : ''}`} id="nav">
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
  <div className="hero-go-bg" aria-hidden="true">GO</div>
  <div className="hero-content-wide">
    <div className="hero-statement reveal reveal-delay-1">
      <div className="hero-line hero-line-1">Are We</div>
      <div className="hero-line hero-line-2">
        <span className="hero-bold-enough">Bold Enough</span>
        <span className="hero-to">to</span>
        <span className="hero-verb-wrapper" id="verbWrapper"><span className="hero-verb active" id="heroVerb" ref={verbRef}>{verbs[currentVerbIndex]}</span></span>
        <span className="hero-question">?</span>
      </div>
    </div>

    <p className="hero-subtitle-theme reveal reveal-delay-2">The Architecture of Ambition: Bridging Vision &amp; Value</p>


    <div className="hero-ctas reveal reveal-delay-3">
      <a href="#register" className="btn-primary">Register Now &rarr;</a>
      <div className="hero-date">23RD MAY 2026</div>
    </div>
  </div>
</section>

{/*  ========== 02. NEW ABOUT / STORY (TEDAI STYLE) ==========  */}
<section className="about-tedai" id="story">
    <div className="about-tedai-header">
      <p className="about-tedai-lead reveal">
        Hear the world's most compelling voices to share raw, unfiltered stories that transform aspiration into <span className="about-tedai-italic">action.</span>
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
    <div className="experience-inbound-label reveal">The Experience</div>
    <h2 className="experience-inbound-title reveal">What awaits you</h2>
    <p className="experience-inbound-sub reveal">Every session is designed to be practical, reflective, and engaging, not theoretical. This is where real growth happens.</p>
  </div>
  <div className="experience-inbound-grid">
    <div className="experience-inbound-card reveal">
      <div className="experience-inbound-card-img">
        <img src="/summit-speaker.png" alt="Speaker delivering a keynote on stage" />
      </div>
      <div className="experience-inbound-card-body">
        <h3>Hear Real Stories</h3>
        <p>Unfiltered journeys of failure, growth, and breakthrough from seasoned professionals across industries. These are not rehearsed talks. They are raw, honest accounts of what it actually takes to build something meaningful from the ground up.</p>
      </div>
    </div>
    <div className="experience-inbound-card reveal reveal-delay-1">
      <div className="experience-inbound-card-img">
        <img src="/summit-networking.png" alt="Professionals networking at the summit" />
      </div>
      <div className="experience-inbound-card-body">
        <h3>Build Your Network</h3>
        <p>Connect with mentors, peers, and collaborators through structured networking moments designed to spark real relationships. Walk away with contacts who share your ambition and can open doors you did not know existed.</p>
      </div>
    </div>
    <div className="experience-inbound-card reveal reveal-delay-2">
      <div className="experience-inbound-card-img">
        <img src="/summit-audience.png" alt="Engaged audience at the summit" />
      </div>
      <div className="experience-inbound-card-body">
        <h3>Gain Practical Tools</h3>
        <p>Learn how speakers achieved goals once considered impossible. Understand the business behind passion and walk away with clear, actionable frameworks, templates, and strategies you can apply the very next day.</p>
      </div>
    </div>
  </div>
</section>

{/*  ========== 04. AGENDA ==========  */}
<section className="agenda" id="agenda">
  <div className="container">
    <div className="agenda-header">
      <div className="section-label reveal">Program</div>
      <h2 className="agenda-title reveal">Summit Agenda</h2>
    </div>
    <div className="format-strip reveal">
      <span className="format-tag">Keynote Addresses</span>
      <span className="format-tag">Panel Discussions</span>
      <span className="format-tag">Fireside Conversations</span>
      <span className="format-tag">Interactive Q&amp;A</span>
      <span className="format-tag">Networking Moments</span>
    </div>
    <div className="agenda-featured reveal">
      <div>
        <div className="agenda-featured-label">Featured Panel</div>
        <h3 className="agenda-featured-title">The Architecture of Ambition: Bridging Vision and Value</h3>
        <p className="agenda-featured-desc">
          This panel explores how ambition is not accidental, but designed. It interrogates how ideas are structured, refined, funded, and sustained&mdash;and how individuals can intentionally build careers, businesses, and platforms that create lasting value.
        </p>
        <a href="#register" className="btn-secondary" style={{"display":"inline-flex","padding":"12px 28px","fontSize":"14px"}}>Reserve Your Seat &rarr;</a>
      </div>
      <div className="agenda-featured-visual">
        <span>Vision<br />&amp;<br />Value</span>
      </div>
    </div>
    <div className="agenda-coming reveal">
      <p>Full agenda and session breakdown coming soon.</p>
      <a href="#register" className="btn-secondary" style={{"display":"inline-flex","padding":"12px 28px","fontSize":"14px"}}>Get Notified When It's Live &rarr;</a>
    </div>
  </div>
</section>

{/*  ========== 05. SPEAKERS ==========  */}
<section className="speakers" id="speakers">
  <div className="container">
    <div className="speakers-header">
      <div>
        <div className="section-label reveal">Voices</div>
        <h2 className="speakers-title reveal">Speakers &amp; Contributors</h2>
      </div>
      <a href="#" className="btn-secondary reveal" style={{"display":"inline-flex","padding":"10px 24px","fontSize":"13px"}}>Nominate a Speaker &rarr;</a>
    </div>
    <div className="speakers-grid">
      <div className="speaker-card reveal">
        <div className="speaker-photo"><div className="speaker-photo-placeholder">TBA</div></div>
        <div className="speaker-info">
          <div className="speaker-name">Speaker Announcement</div>
          <div className="speaker-role">Industry Leader &amp; Executive</div>
        </div>
      </div>
      <div className="speaker-card reveal reveal-delay-1">
        <div className="speaker-photo"><div className="speaker-photo-placeholder">TBA</div></div>
        <div className="speaker-info">
          <div className="speaker-name">Speaker Announcement</div>
          <div className="speaker-role">Entrepreneur &amp; Founder</div>
        </div>
      </div>
      <div className="speaker-card reveal reveal-delay-2">
        <div className="speaker-photo"><div className="speaker-photo-placeholder">TBA</div></div>
        <div className="speaker-info">
          <div className="speaker-name">Speaker Announcement</div>
          <div className="speaker-role">Creative &amp; Cultural Architect</div>
        </div>
      </div>
      <div className="speaker-card reveal reveal-delay-3">
        <div className="speaker-photo"><div className="speaker-photo-placeholder">TBA</div></div>
        <div className="speaker-info">
          <div className="speaker-name">Speaker Announcement</div>
          <div className="speaker-role">Policy &amp; Ecosystem Builder</div>
        </div>
      </div>
    </div>
    <div className="speaker-cta-row reveal">
      <p style={{"color":"var(--brand-muted)","fontSize":"14px","marginBottom":"12px"}}>Speaker lineup will be announced soon. Want to be part of it?</p>
      <a href="mailto:hello@reinventafrica.org" className="btn-secondary" style={{"display":"inline-flex","padding":"12px 28px","fontSize":"14px"}}>Get in Touch &rarr;</a>
    </div>
  </div>
</section>

{/*  ========== 06. WHO SHOULD ATTEND ==========  */}
<section className="audience" id="audience">
  <div className="container">
    <div className="audience-header">
      <div className="section-label reveal">Who It's For</div>
      <h2 className="audience-title reveal">This summit is for you</h2>
      <p className="audience-sub reveal">Whether you're just starting out or leading the way, there's a seat with your name on it.</p>
    </div>
    <div className="personas-grid">
      <div className="persona reveal">
        <div className="persona-title">Students &amp; Graduates</div>
        <div className="persona-desc">Discover clarity on your direction before the world tells you what to do.</div>
      </div>
      <div className="persona reveal reveal-delay-1">
        <div className="persona-title">Young Professionals</div>
        <div className="persona-desc">Gain the frameworks and networks to accelerate your early career trajectory.</div>
      </div>
      <div className="persona reveal reveal-delay-2">
        <div className="persona-title">Entrepreneurs &amp; Founders</div>
        <div className="persona-desc">Learn how others turned passion into sustainable, scalable businesses.</div>
      </div>
      <div className="persona reveal reveal-delay-3">
        <div className="persona-title">Creatives &amp; Cultural Leaders</div>
        <div className="persona-desc">See how art, culture, and innovation intersect to build platforms of influence.</div>
      </div>
      <div className="persona reveal reveal-delay-4">
        <div className="persona-title">Corporate Professionals</div>
        <div className="persona-desc">Reconnect with purpose and find new meaning in your career path.</div>
      </div>
      <div className="persona reveal reveal-delay-4">
        <div className="persona-title">NGO Leaders &amp; Mentors</div>
        <div className="persona-desc">Redefine what mentorship means and build ecosystems that truly empower.</div>
      </div>
    </div>
  </div>
</section>

{/*  ========== 07. SPONSORS & PARTNERS ==========  */}
<section className="sponsors" id="sponsors">
  <div className="container">
    <div className="sponsors-header">
      <div className="section-label reveal">Partners</div>
      <h2 className="sponsors-title reveal">Sponsors &amp; Partners</h2>
      <p className="sponsors-sub reveal">Align your brand with leadership, innovation, and lasting impact across Africa and beyond.</p>
    </div>
    <div className="sponsor-tiers">
      <div className="sponsor-tier reveal">
        <div className="tier-label">Title Sponsors</div>
        <div className="tier-logos">
          <div className="logo-placeholder large">Your Logo</div>
          <div className="logo-placeholder large">Your Logo</div>
        </div>
      </div>
      <div className="sponsor-tier reveal">
        <div className="tier-label">Category Sponsors</div>
        <div className="tier-logos">
          <div className="logo-placeholder">Your Logo</div>
          <div className="logo-placeholder">Your Logo</div>
          <div className="logo-placeholder">Your Logo</div>
        </div>
      </div>
      <div className="sponsor-tier reveal">
        <div className="tier-label">Supporting Partners</div>
        <div className="tier-logos">
          <div className="logo-placeholder small">Logo</div>
          <div className="logo-placeholder small">Logo</div>
          <div className="logo-placeholder small">Logo</div>
          <div className="logo-placeholder small">Logo</div>
        </div>
      </div>
    </div>
    <div className="sponsor-cta reveal">
      <p>Interested in partnering with FROM GO TO GOAL?</p>
      <a href="mailto:partnerships@reinventafrica.org" className="btn-primary" style={{"display":"inline-flex"}}>Become a Sponsor &rarr;</a>
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
      <div className={`faq-item reveal ${openFaqIndex === 0 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(0)}>
          What is FROM GO TO GOAL?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>FROM GO TO GOAL is a high-impact leadership and innovation summit designed to bridge the gap between ambition and execution, vision and value, and dreams and tangible outcomes. It convenes purpose-driven individuals, industry leaders, and change-makers to share real stories and practical frameworks.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 1 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(1)}>
          Who can attend the summit?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>The summit is open to students, recent graduates, young professionals, entrepreneurs, creatives, corporate professionals, NGO leaders, mentors, and ecosystem builders. If you're driven by ambition and ready to learn, this event is for you.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 2 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(2)}>
          Is there a cost to attend?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>Registration details and ticket pricing will be announced soon. Sign up for our newsletter to be first to know when early-bird tickets become available.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 3 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(3)}>
          Where and when is the summit taking place?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>The summit will be held in Accra, Ghana. Exact date and venue details will be confirmed shortly. Stay connected through our newsletter for updates.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 4 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(4)}>
          Can I attend virtually?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>We are exploring virtual attendance and livestream options. Follow our updates for the latest on remote participation opportunities.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 5 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(5)}>
          How do I become a speaker?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>We're actively seeking speakers who can share authentic, unfiltered stories and practical insights. If you'd like to be considered or nominate someone, reach out via our contact email or use the "Nominate a Speaker" link above.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 6 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(6)}>
          How can my organization sponsor or partner?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>We offer title, category, and supporting partnership opportunities with brand visibility, audience engagement, and media exposure. Contact our partnerships team for the sponsorship deck and available packages.</p></div>
      </div>
      <div className={`faq-item reveal ${openFaqIndex === 7 ? 'open' : ''}`}>
        <button className="faq-question" onClick={() => toggleFaq(7)}>
          What should I expect from the summit?
          <span className="faq-icon">+</span>
        </button>
        <div className="faq-answer"><p>By the end of the summit, you should gain clarity on your personal and professional direction, understand the systems behind success, build meaningful networks with peers and mentors, and feel empowered to take decisive, intentional action.</p></div>
      </div>
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
      <a href="#" className="btn-primary" style={{"fontSize":"17px","padding":"18px 44px"}}>Register Now &rarr;</a>
    </div>
    <div className="reveal" style={{"marginTop":"48px"}}>
      <p style={{"fontSize":"14px","color":"var(--brand-muted)","marginBottom":"16px"}}>Not ready to register? Stay in the loop.</p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" required={true} />
        <button type="submit">Subscribe</button>
      </form>
      <p className="newsletter-note">Speaker announcements, early-bird access, and summit updates.</p>
    </div>
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
