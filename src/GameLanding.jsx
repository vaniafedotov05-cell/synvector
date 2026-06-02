import React, { useEffect, useState, useRef } from "react";

/* =================== EASY ASSET SWITCH — MEDIA (WEBM + images) ===================
   РЕКОМЕНДАЦИЯ: клади медиа в /public/media и обращайся как "/media/..."
   hero.videoWebm  — фон-видео на главном экране (WEBM).
   logo.videoWebm  — анимированное видео-лого (WEBM) для хедера/hero.
   trailerYouTubeId — ID ролика YouTube для блока трейлера.
   В infoBlocks можно оставить JPG/PNG, либо тоже сделать видео-фоном (videoWebm).
   >>> ЗАМЕНА СОЦ-СЕТЕЙ: меняй label и href ниже. Иконки сопоставляются по label.
=============================================================================== */
export const MEDIA = {
  hero: {
    videoWebm: "/media/hero.webm",
    poster: "/media/hero-poster.jpg",
  },
  logo: {
    videoWebm: "/media/logo.webm",
    poster: "/media/logo.png",
  },
  logos: {
    header: "/media/Synvector_Logo_horizontal.webp",
    hero: "/media/Synvector_Logo_wordmark.webp",
    footer: "/media/Synvector_Logo_symbol.webp",
  },
  socials: [
    { label: "Steam", href: "#steam" },
    { label: "YouTube", href: "https://youtube.com/@synvector?si=EJQYPf4lMRUJQjNO" },
    { label: "Reddit", href: "https://www.reddit.com/r/Synvector/" },
    { label: "Discord", href: "https://discord.gg/9kqW3JBfP5" },
  ],
  infoBlocks: [
    {
      title: "Play Co-op",
      text:
        "Team up with friends and share command of a fleet. Each player controls a different squad, coordinating strategies for large-scale battles. Victory feels even better when achieved together.",
      img: "/media/slide3.webp",
    },
    {
      title: "Fleet Customization",
      text:
        "Build the fleet of your dreams by fusing human and alien technology. Equip your ships with experimental weapons and unique modules to create unstoppable tactical combos.",
      img: "/media/slide2.webp",
    },
    {
      title: "Real-Time Action & Tactical Pause + RPG",
      text:
        "Engage in fast-paced real-time space battles, where every second counts. Use the *active pause* to issue tactical commands, then jump right back into the action. Between the fights, explore role-playing elements that let you shape your character and fleet.",
      img: "/media/slide1.webp",
    },
    {
      title: "Moral and Political Depth",
      text:
        "Forget about black-and-white choices. Every decision shifts alliances, sparks rivalries, and shapes the fate of the galaxy. Your actions define the story — and your reputation.",
      img: "/media/slide4.webp",
    },
  ],
  trailerYouTubeId: "ZgoIo1m_F_c",
  supportedBy: [
    { name: "Vaiz", logo: "/media/partner-supported.webp", href: "https://vaiz.com/" }
  ],
};
/* ============================================================================ */

/* ===== Scroll animation that re-triggers (not one-time) === */
function useInView({ threshold = 0.2 } = {}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
/* ========================================================= */

export default function GameLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const scrollToEl = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id) scrollToEl(id);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Preload critical media and preconnect to third-party origins
  useEffect(() => {
    const head = document.head;
    const links = [];
    const addLink = (attrs) => {
      const l = document.createElement('link');
      Object.entries(attrs).forEach(([k, v]) => l.setAttribute(k, v));
      head.appendChild(l);
      links.push(l);
    };

    try {
      // Preload hero assets and key logos
      if (MEDIA?.hero?.videoWebm) addLink({ rel: 'preload', as: 'video', href: MEDIA.hero.videoWebm, type: 'video/webm' });
      if (MEDIA?.hero?.poster) addLink({ rel: 'preload', as: 'image', href: MEDIA.hero.poster });
      if (MEDIA?.logos?.header) addLink({ rel: 'preload', as: 'image', href: MEDIA.logos.header });
      if (MEDIA?.logos?.hero) addLink({ rel: 'preload', as: 'image', href: MEDIA.logos.hero });

      // Preconnects for external embeds/assets
      addLink({ rel: 'preconnect', href: 'https://www.youtube.com' });
      addLink({ rel: 'preconnect', href: 'https://i.ytimg.com' });
      addLink({ rel: 'preconnect', href: 'https://t.me' });
      addLink({ rel: 'preconnect', href: 'https://discord.gg' });
    } catch { }

    return () => {
      links.forEach((l) => {
        try { l.remove(); } catch { }
      });
    };
  }, []);

  // ===== Global CSS for subtle hover gradient (aurora) and cursor position
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Prevent horizontal scroll on mobile */
      body { overflow-x: hidden; }
      html { overflow-x: hidden; }
      
      /* Mobile menu animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fadeInUp {
        animation: fadeInUp 0.5s ease-out forwards;
      }
      
      /* Additional mobile optimizations */
      @media (max-width: 480px) {
        .xs\\:w-20 { width: 5rem; }
        .xs\\:h-20 { height: 5rem; }
        .xs\\:gap-1 { gap: 0.25rem; }
        .xs\\:ml-2 { margin-left: 0.5rem; }
        .xs\\:rounded-lg { border-radius: 0.5rem; }
      }
      
      /* Force text wrapping on very small screens */
      @media (max-width: 360px) {
        .text-wrap { word-wrap: break-word; overflow-wrap: break-word; }
      }

    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  const nav = [
    { id: "about", label: "About" },
    // { id: "features", label: "Features" }, // удалено из навигации
    { id: "team", label: "Our Team" },
    { id: "media", label: "Trailer" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F16] text-slate-900 selection:bg-sky-200 selection:text-slate-900 overflow-x-hidden">
      <Header
        nav={nav}
        onNav={(id) => scrollToEl(id)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Hero />
      <SocialButtons />
      <InfoBlocks />
      <GameplayBlock />
      <About />
      {/* <Features />  // полностью удалено по запросу */}
      <Media />
      <FAQ />
      <Newsletter />
      <Footer setShowPrivacy={setShowPrivacy} setShowTerms={setShowTerms} />

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="text-slate-500 hover:text-slate-700 text-2xl">×</button>
            </div>
            <div className="text-slate-700 space-y-4">
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
              <p>We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
              <h3 className="text-lg font-semibold text-slate-900">Information We Collect</h3>
              <p>We may collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
              <h3 className="text-lg font-semibold text-slate-900">How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.</p>
              <h3 className="text-lg font-semibold text-slate-900">Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:sspacefleetcommander@gmail.com" className="text-blue-600 hover:underline">sspacefleetcommander@gmail.com</a></p>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} className="text-slate-500 hover:text-slate-700 text-2xl">×</button>
            </div>
            <div className="text-slate-700 space-y-4">
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
              <p>These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.</p>
              <h3 className="text-lg font-semibold text-slate-900">Acceptance of Terms</h3>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
              <h3 className="text-lg font-semibold text-slate-900">Use License</h3>
              <p>Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only.</p>
              <h3 className="text-lg font-semibold text-slate-900">Disclaimer</h3>
              <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.</p>
              <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
              <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:sspacefleetcommander@gmail.com" className="text-blue-600 hover:underline">sspacefleetcommander@gmail.com</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================== UI helpers ========================== */
const BTN_BASE =
  "inline-flex items-center justify-center px-5 py-2.5 text-base font-medium transition duration-150 ease-out active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

// Тёмное стекло (под стиль ТЁМНОГО хедера): белый текст, лёгкая окантовка, блюр
const BTN_PRIMARY_GLASS =
  BTN_BASE +
  " text-white/90 bg-white/5 hover:bg-white/10 backdrop-blur-md ring-1 ring-white/15";

// Соц-кнопки со встроенным текстом
const BTN_SOCIAL_GLASS =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-base font-medium text-white/90 bg-white/5 hover:bg-white/10 ring-1 ring-white/15 backdrop-blur-md active:scale-95 transition";
/* =============================================================== */

/* ===================== HEADER (тёмный; навигация сразу после лого, крупнее) ===================== */
function Header({ nav, onNav, mobileOpen, setMobileOpen }) {
  return (
  <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-5">
    <div className="mx-auto flex max-w-[1060px] items-center justify-between">
      <nav className="hidden md:flex items-center gap-4">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            className="rounded-xl bg-white/20 px-3 py-1 text-center text-2xl text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/30 active:scale-95"
          >
            {n.label}
          </button>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-3">
        {MEDIA.socials
          .filter((s) => ["YouTube", "Reddit", "Discord"].includes(s.label))
          .map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/30"
              aria-label={s.label}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {s.label === "YouTube" && <IconBrandYouTube width={22} height={22} />}

              {s.label === "Reddit" && (
                <img
                  src="/media/IconBrandReddit.png"
                  alt="Reddit"
                  className="h-[22px] w-[22px] object-contain"
                />
              )}

              {s.label === "Discord" && <IconBrandDiscord width={22} height={22} />}
            </a>
          ))}
      </div>

      <button
        className="md:hidden ml-auto inline-flex items-center justify-center rounded-xl bg-white/20 p-3 text-white backdrop-blur-md"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
    </div>
  </header>
);
}

/* ========================= HERO — одна мягкая тень + кнопки ниже ========================= */
function Hero() {
  return (
  <section className="relative isolate min-h-screen w-full overflow-hidden" id="top">
    
    {/* background video */}
<div className="absolute inset-0 -z-10">
  <video
    className="h-full w-full object-cover scale-110"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/media/0602.mp4" type="video/mp4" />
  </video>

      {/* затемнение */}
      <div className="absolute inset-0 bg-black/25" />
      {/* плавный переход вниз */}
<div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#0B0F16]" />
    </div>


<div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-64 pb-4">
  <div className="flex flex-1 flex-col justify-end pb-4">
          <div className="ml-auto mb-6 max-w-[380px] rounded-2xl bg-black/25 px-5 py-3 text-left text-sm sm:text-xs leading-tight text-white backdrop-blur-md ring-1 ring-white/60">
            Mount & Blade in space - Action 3D RPG with massive battles, tactical pause, customizable fleets, co-op and moral contracts.
          </div>

          <img
  src="/media/Logo.png"
  alt="Logo"
  className="w-full max-w-[1320px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.65)]"
  decoding="async"
  fetchpriority="high"
/>

          <a
  href={MEDIA.socials.find((s) => s.label === "Steam")?.href || "#"}
  className="mx-auto mt-5 inline-flex h-[92px] w-[320px] items-center justify-center bg-contain bg-center bg-no-repeat text-3xl font-bold text-white transition hover:scale-[1.02] active:scale-95"
  style={{
    backgroundImage: "url('/media/Rectangle 28.png')"
  }}
>
  Steam
</a>
        </div>
      </div>
    </section>
  );
}

/* ===== Social links buttons strip ===== */
function SocialButtons() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#0B0F16] pt-20 pb-12 md:pt-24 md:pb-14"
      style={{
        backgroundImage: "url('/media/image 45.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/35" />

/* blur */
<div className="absolute inset-0 backdrop-blur-[6px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-6">
        <div className="relative mx-auto rounded-[42px] border border-white/35 bg-white/[0.06] px-7 py-9 backdrop-blur-xl md:min-h-[340px] md:max-w-[1080px] md:rounded-[48px] md:px-12 md:py-12">

          <div className="pointer-events-none absolute inset-0 rounded-[42px] bg-gradient-to-r from-[#102626]/70 via-black/10 to-transparent md:rounded-[48px]" />

          <div className="relative z-20 max-w-none md:max-w-[560px]">
            <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              About the game
            </h2>

            <p className="mt-5 text-[17px] leading-relaxed text-white/85 md:text-base md:leading-relaxed">
              SYNVECTOR is a sci-fi action RPG where you command an independent
              mercenary fleet in a galaxy torn by war and betrayal. Switch
              between real-time third-person combat and tactical pause,
              customize your ships, and team up in 4-player co-op. Your choices
              and reputation shape missions, factions, and the fate of the
              stars.
            </p>
          </div>

          <img
            src="/media/image 8.png"
            alt="Android"
            className="pointer-events-none absolute bottom-[-0px] right-[40px] hidden object-contain z-10 lg:block lg:h-[130%] xl:right-[40px] xl:h-[145%]"
          />
        </div>
      </div>


      {/* плавный переход к следующему блоку */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0B0F16]" />
    </section>
  );
}

function InfoBlocks() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F16] py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 max-w-[560px]">
          <div>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Play Co-op
            </h2>
            <p className="mt-4 max-w-[430px] text-sm leading-relaxed text-white/75">
              Team up with friends and share command of a fleet. Each player
              controls a different squad, coordinating strategies for large-scale
              battles. Victory feels even better when achieved together.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Fleet Customization
            </h2>
            <p className="mt-4 max-w-[460px] text-sm leading-relaxed text-white/75">
              Build the fleet of your dreams by fusing human and alien
              technology. Equip your ships with experimental weapons and unique
              modules to create unstoppable tactical combos.
            </p>
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <img
            src="/media/Group 94.png"
            alt="Spaceship"
            className="absolute right-0 top-0 w-full max-w-[720px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function GameplayBlock() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F16] py-20">
      <div className="relative mx-auto max-w-7xl px-6">

          {/* верхняя стеклянная плашка */}
          <div className="relative z-20 rounded-[32px] border border-white/25 bg-white/[0.04] px-8 py-6 backdrop-blur-md">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Real-Time Action & Tactical Pause+RPG
            </h2>

            <p className="mt-4 max-w-[980px] text-sm leading-relaxed text-white/80">
              Engage in fast-paced real-time space battles, where every second
              counts. Use the *active pause* to issue tactical commands, then
              jump right back into the action. Between the fights, explore
              role-playing elements that let you shape your character and fleet.
            </p>
          </div>

          {/* корабль */}
          <img
            src="/media/image 82.png"
            alt="Spaceship"
            className="pointer-events-none absolute left-1/2 top-[52%] z-10 w-[110%] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 object-contain"
          />

          {/* нижние тексты */}
          <div className="relative z-20 mt-[330px] grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
            <div>
              <h3 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                Moral<br />
                and Political Depth
              </h3>

              <p className="mt-5 max-w-[430px] text-sm leading-relaxed text-white/75">
                Forget about black-and-white choices. Every decision shifts alliances, sparks rivalries, and shapes the fate of the galaxy. Your actions define the story — and your reputation.
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                Multi-Genre Gameplay
              </h3>

              <p className="mt-5 max-w-[520px] text-sm leading-relaxed text-white/75">
                Fight on the front lines, command fleets across star systems, negotiate alliances, and shape the balance of power through your decisions. Synvector combines third-person action combat, tactical squad management, strategic planning, and narrative-driven progression into a single interconnected experience.
              </p>
            </div>
          </div>
      </div>
    </section>
  );
}

function InfoRow({ title, text, img, flip }) {
  const [ref, visible] = useInView({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className={`grid items-stretch grid-cols-1 md:grid-cols-2 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
    >
      {/* Image column: full-bleed, авто-адаптация по размеру блока */}
      <div className={`${flip ? "md:order-last" : ""}`}>
        <div className="relative h-[40vh] sm:h-[48vh] min-h-[280px] sm:min-h-[320px] w-full overflow-hidden hover-aurora group">
          {/* >>> Для ВИДЕО вместо IMG можно использовать <video className=\"absolute inset-0 h-full w-full object-cover\" ...> */}
          <img
            src={img}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          {/* Градиентная накладка для лучшей читаемости */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      {/* Text column: full-bleed */}
      <div className={`${flip ? "md:order-first" : ""}`}>
        <div className="h-full w-full bg-white px-4 sm:px-6 py-8 sm:py-12 lg:px-20 hover-aurora">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h3>
            <p className="mt-3 text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
/* =================================================================== */

/* ===================== About: Collage + Team Sidebar ===================== */
function About() {
  const [ref, visible] = useInView({ threshold: 0.2 });

  const Person = ({ person }) => (
    <div className="flex flex-col items-center text-center min-w-0">
      <img
        src={person.img}
        alt={person.name}
        className="h-[72px] w-[72px] rounded-full object-cover"
      />

      <div className="mt-2 max-w-[100px] text-[12px] leading-tight text-cyan-300">
        {person.name}
      </div>

      <div className="mt-1 max-w-[100px] text-[10px] leading-tight text-white">
        {person.role}
      </div>
    </div>
  );

  const Group = ({ title, children, className = "" }) => (
    <div
      className={`relative rounded-[24px] border border-white/60 bg-white/[0.02] px-5 py-5 ${className}`}
    >
      <div className="absolute -top-3 left-6 bg-[#1a2028] px-2 text-sm text-white">
        {title}
      </div>

      {children}
    </div>
  );

  const people = [
    // Management
    { name: "Alexey Aleshin", role: "CEO", img: "/media/Ellipse 28.png" },
    { name: "Ivan Kalnaus", role: "Project manager", img: "/media/Ellipse 24.png" },
    { name: "Konstantin", role: "Marketing Manager", img: "/media/Ellipse 29.png" },

    // Design
    { name: "Pavel Puzyna", role: "Lead Narrative designer", img: "/media/Ellipse 30.png" },
    { name: "Maxim Novikov", role: "Game designer", img: "/media/Ellipse 15.png" },
    { name: "Maxim Dubrovsky", role: "Tech Game designer", img: "/media/Ellipse 6.png" },
    { name: "Gleb Kovalevich", role: "UIUX designer", img: "/media/Ellipse 1.png" },
    { name: "Alexander Lyulchenko", role: "Sound designer", img: "/media/Ellipse 7.png" },
    { name: "Ivan Fedotov", role: "Designer", img: "/media/Ellipse 16.png" },

    // Tech Art
    { name: "Anton Zarubin", role: "TechArt", img: "/media/Ellipse 2.png" },
    { name: "Egor Kirik", role: "VFX/TechArt", img: "/media/Ellipse 17.png" },

    // Development
    { name: "Andrey Shmanatov", role: "CTO", img: "/media/Ellipse 3.png" },
    { name: "Anna Potetenko", role: "Developer/UX", img: "/media/Ellipse 8.png" },
    { name: "Margarita Chebotareva", role: "Developer", img: "/media/Ellipse 9.png" },
    { name: "Alexander Poretsky", role: "Developer", img: "/media/Ellipse 18.png" },
    { name: "Anna Potetenko", role: "Developer/UX", img: "/media/Ellipse 8.png" },

    // 2D
    { name: "Daniil Yuminov", role: "Art Director", img: "/media/Ellipse 10.png" },
    { name: "Vyacheslav Grigorenko", role: "2D concept artist", img: "/media/Ellipse 11.png" },
    { name: "Vitaliy Shemyakin", role: "2D concept artist", img: "/media/Ellipse 19.png" },
    { name: "Abdurashid Rakhimberdiev", role: "2D concept artist", img: "/media/Ellipse 4.png" },
    { name: "Ewelina Dobrzyanska", role: "2D concept artist", img: "/media/Ellipse 12.png" },
    { name: "Igor Kirichenko", role: "2D illustrator artist", img: "/media/Ellipse 20.png" },

    // 3D
    { name: "Aleksei Barash", role: "3D Lead", img: "/media/Ellipse 21.png" },
    { name: "Artyom Stikhin", role: "3D artist", img: "/media/Ellipse 13.png" },
    { name: "Artyom Alshevsky", role: "3D artist", img: "/media/Ellipse 22.png" },
    { name: "Vladislav Kiselev", role: "3D artist texture", img: "/media/Ellipse 5.png" },
    { name: "Margarita Borzykh", role: "Cinematic 3D artist", img: "/media/Ellipse 14.png" },
    { name: "Sergey Dolzhenko", role: "VFX / Rigger", img: "/media/Ellipse 23.png" },
  ];

  return (
    <section
      id="team"
      ref={ref}
      className={`py-10 bg-[#0B0F16] transition-all duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="rounded-[42px] border border-white/40 bg-white/[0.04] p-6 backdrop-blur-xl">

          {/* ВЕРХ */}
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <h2 className="text-[34px] font-bold leading-[0.95] text-white lg:text-[64px]">
                Experienced team
                <br />
                you can trust
              </h2>

              <p className="mt-6 max-w-[520px] text-sm leading-relaxed text-white/80">
                Our core team comes from top studios like Wargaming, Playrix,
                Gaya and Ubisoft. With strong backgrounds in both AAA and
                large-scale mobile projects, we combine industry best practices
                and deep market knowledge to deliver high-quality,
                commercially successful games.
              </p>
            </div>

            <Group title="Management team" className="lg:mt-10">
              <div className="grid grid-cols-3 gap-6">
                {people.slice(0, 3).map((p, i) => (
                  <Person key={i} person={p} />
                ))}
              </div>
            </Group>
          </div>

          <div className="mt-6 space-y-6">

            <Group title="Design team">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {people.slice(3, 9).map((p, i) => (
                  <Person key={i} person={p} />
                ))}
              </div>
            </Group>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
  <Group title="Development team">
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {people.slice(11, 15).map((p, i) => (
        <Person key={i} person={p} />
      ))}
    </div>
  </Group>

  <Group title="Tech Art">
    <div className="grid grid-cols-2 gap-5">
      {people.slice(9, 11).map((p, i) => (
        <Person key={i} person={p} />
      ))}
    </div>
  </Group>
</div>

            <Group title="2d team">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {people.slice(15, 21).map((p, i) => (
                  <Person key={i} person={p} />
                ))}
              </div>
            </Group>

            <Group title="3d team">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {people.slice(21, 27).map((p, i) => (
                  <Person key={i} person={p} />
                ))}
              </div>
            </Group>

          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================== Media / FAQ / Newsletter ====================== */
function Media() {
  const [ref, visible] = useInView({ threshold: 0.15 });
  return (
    <section
      id="media"
      ref={ref}
      className={`relative overflow-hidden bg-[#0B0F16] py-16 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
          Watch the Trailer
        </h2>

        <div className="mt-8 aspect-video overflow-hidden bg-black">
          <video
            className="h-full w-full object-cover"
            controls
            poster="/media/Synvector_02-2.mp4"
          >
            <source src="/media/Synvector_02-2.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [ref, visible] = useInView({ threshold: 0.15 });

  const faqs = [
    { q: "What platforms will be supported?", a: "PC at launch. Consoles TBD." },
    { q: "Will there be multiplayer?", a: "Co-op and competitive modes are planned post-launch." },
    { q: "When is the release date?", a: "To be announced. Follow our socials for updates." },
  ];

  return (
    <section
      id="faq"
      ref={ref}
      className={`relative overflow-hidden bg-[#0B0F16] py-20 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="relative mx-auto min-h-[620px] max-w-7xl px-6">
        <div className="absolute right-[-40px] top-1/2 z-0 -translate-y-1/2">
  <img
    src="/media/image 84.png"
    alt="Spaceship"
    className="w-[760px] max-w-none object-contain"
  />

  {/* размытие краёв */}
  <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-r from-[#0B0F16] via-transparent to-[#0B0F16]" />

  <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-b from-[#0B0F16] via-transparent to-[#0B0F16]" />
</div>

        <div className="relative z-10 w-[440px] rounded-[34px] border border-white/35 bg-white/[0.06] px-8 py-8 backdrop-blur-xl">
          <h2 className="text-5xl font-bold text-white">FAQ</h2>

          <div className="mt-8 space-y-7">
            {faqs.map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="relative w-[260px] rounded-md bg-[#8BC4E0] px-5 py-3 text-[13px] text-[#0B0F16]">
                  {f.q}
                  <div className="absolute -bottom-3 left-0 h-0 w-0 border-r-[18px] border-t-[16px] border-r-transparent border-t-[#8BC4E0]" />
                </div>

                <div className="relative ml-auto w-[260px] rounded-md bg-[#95D0AA] px-5 py-3 text-[13px] text-[#0B0F16]">
                  {f.a}
                  <div className="absolute -bottom-3 right-0 h-0 w-0 border-l-[18px] border-t-[16px] border-l-transparent border-t-[#95D0AA]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <footer className="relative overflow-hidden bg-[#0B0F16] py-24">
      
      {/* фон */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F16] via-[#101827] to-[#0B0F16]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        
        {/* заголовок */}
        <h2 className="text-6xl font-light tracking-tight text-white md:text-7xl">
          Get Updates
        </h2>

        {/* подзаголовок */}
        <p className="mt-5 text-lg text-white/80">
          Subscribe for dev logs, betas, and release news.
        </p>

        {/* форма */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-4 sm:flex-row">
          
          {/* input */}
          <input
            type="email"
            placeholder=""
            className="h-[74px] flex-1 rounded-[22px] bg-[#D9D9D9] px-6 text-2xl text-black outline-none transition"
          />

          {/* button */}
          <button
            className="h-[74px] rounded-[22px] bg-[#8BC4E0] px-14 text-2xl font-medium text-black transition hover:brightness-110 active:scale-[0.98]"
          >
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ===== Footer — СТЕКЛЯННЫЙ как хедер ===== */
function Footer({ setShowPrivacy, setShowTerms }) {
  return (
    <footer className="relative overflow-hidden bg-[#0B0F16] pt-16 pb-24">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Основная часть футера */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-3">
          {/* Левая часть: Supported by */}
          <div className="flex items-center">
            {MEDIA.supportedBy?.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-medium text-white/90">Supported by</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  {MEDIA.supportedBy.map((p, i) => (
                    <a
                      key={i}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:opacity-100 transition hover-aurora"
                    >
                      <img
                        src={p.logo}
                        alt={p.name}
                        title={p.name}
                        className="h-6 sm:h-8 md:h-10"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Правая часть: кнопки */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setShowPrivacy(true)} className="text-sm sm:text-base text-white/80 hover:text-white active:scale-95 transition font-medium">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="text-sm sm:text-base text-white/80 hover:text-white active:scale-95 transition font-medium">Terms</button>
          </div>
        </div>

        {/* Копирайт по центру внизу */}
        <div className="text-center border-t border-white/10 pt-3">
          <div className="flex items-center justify-center gap-2">
            <img src={MEDIA.logos.footer} alt="Synvector Logo" className="h-5 w-5 object-contain" />
            <span className="text-sm text-white/70">© {new Date().getFullYear()} NORTH SOULS GAMES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ====================== BRAND SVG ICONS (clean, aligned) ====================== */
function IconBrandReddit(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}
function IconBrandSteam(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387l1.162-3.828a2.93 2.93 0 0 1-1.898-2.741c0-1.623 1.322-2.944 2.944-2.944.213 0 .42.022.62.065l2.195-2.004v-.134c0-2.084 1.695-3.779 3.779-3.779s3.779 1.695 3.779 3.779c0 2.083-1.695 3.779-3.779 3.779h-.134l-2.004 2.195a2.923 2.923 0 0 1 .065.62c0 1.622-1.321 2.944-2.944 2.944-.98 0-1.847-.479-2.382-1.21l-3.828 1.162C4.2 22.562 7.918 24 12 24c6.628 0 12-5.372 12-12S18.628 0 12 0zm3.779 7.672a2.352 2.352 0 1 0 0 4.704 2.352 2.352 0 0 0 0-4.704zM9.352 15.37a1.411 1.411 0 0 0-1.411 1.411c0 .777.634 1.411 1.411 1.411s1.411-.634 1.411-1.411c0-.777-.634-1.411-1.411-1.411z"
      />
    </svg>
  );
}

function IconBrandYouTube(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  );
}
function IconBrandTelegram(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M21.8 4.6c.3-.1.6.1.7.4.1.2.1.5 0 .8l-3 13c-.1.6-.7 1-.1.8l.1.1c-.5.2-1 .1-1.4-.2l-5.1-3.7-2.4 2.3c-.2.2-.5.3-.8.3h-.3l.4-3.9 9.2-7.6c.4-.3 0-.5-.3-.3L7.8 12.8 3.7 11.4c-.9-.3-.9-1.6.1-1.9L21.8 4.6Z" />
    </svg>
  );
}
function IconBrandDiscord(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
function IconBrandLinkedIn(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M20.451 20.451h-3.554v-5.569c0-1.329-.027-3.039-1.852-3.039-1.853 0-2.136 1.447-2.136 2.944v5.664H9.355V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.604 0 4.27 2.372 4.27 5.457v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.451H3.56V9h3.554v11.451zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}
/* =================================================================== */

function Dot() {
  return <span className="mt-2 inline-block h-2 w-2 flex-none rounded-full bg-slate-700" />;
}


