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
    { label: "Telegram", href: "https://t.me/sfc_dev" },
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-200 selection:text-slate-900 overflow-x-hidden">
      <Header
        nav={nav}
        onNav={(id) => scrollToEl(id)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Hero />
      <IntroText />
      <SocialButtons />
      <InfoBlocks />
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
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ТЁМНОЕ стекло: хорошо читается и на белом фоне страницы */}
      <div className="bg-neutral-900/85 text-white backdrop-blur-xl ring-1 ring-white/10 supports-[backdrop-filter]:bg-neutral-900/75">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ЛЕВАЯ СТОРОНА: ЛОГО + НАВИГАЦИЯ */}
            <div className="flex items-center gap-6">
              {/* Логотип для хедера */}
              <div className="flex items-center gap-3">
                <img
                  src={MEDIA.logos.header}
                  alt="Synvector Logo"
                  className="h-8 md:h-9 object-contain"
                />
              </div>
              <nav className="hidden md:flex items-center gap-6 ml-6">
                {nav.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onNav(n.id)}
                    className="px-3.5 py-2 text-base uppercase tracking-widest text-white/80 hover:text-white transition active:scale-95"
                  >
                    {n.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* ПРАВАЯ СТОРОНА: соц-иконки + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                {MEDIA.socials.filter(s => s.label !== 'Steam').map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-white/90 hover:bg-white/10 transition ring-1 ring-white/10"
                    aria-label={s.label}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {s.label === 'Reddit' && <IconBrandReddit width={18} height={18} />}
                    {s.label === 'YouTube' && <IconBrandYouTube width={18} height={18} />}
                    {s.label === 'Telegram' && <IconBrandTelegram width={18} height={18} />}
                    {s.label === 'Discord' && <IconBrandDiscord width={18} height={18} />}
                  </a>
                ))}
              </div>
              <a href="#" className={BTN_PRIMARY_GLASS + " relative px-6 py-2.5 rounded-2xl hover-aurora overflow-visible"}>
                Add to Wishlist
                {/* Construction-tape style ribbon */}
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg] select-none w-[110%]">
                  <span
                    className="block w-full py-0.5 shadow-lg ring-1 ring-black/20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, #fde047 0px, #fde047 12px, #111827 12px, #111827 18px)'
                    }}
                  >
                    <span className="block text-center">
                      <span className="inline-block px-1 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-black bg-yellow-300/90 rounded">
                        Coming soon
                      </span>
                    </span>
                  </span>
                </span>
              </a>
            </div>

            {/* Мобильное меню */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 hover:bg-white/10 active:scale-95 rounded-lg transition-all duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileOpen ? 'opacity-0 scale-x-0' : 'scale-x-100'}`} />
                <span className={`absolute top-4 left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное выпадающее меню с белым стеклянным стилем */}
      <div className={`md:hidden absolute top-16 left-0 right-0 z-50 transition-all duration-300 ease-out ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Фон-оверлей для затемнения */}
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Само меню */}
        <div className={`relative mx-4 mt-2 transition-all duration-300 ease-out ${mobileOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
          <div className="bg-neutral-900/80 text-white backdrop-blur-xl ring-1 ring-white/10 supports-[backdrop-filter]:bg-neutral-900/70 shadow-2xl rounded-2xl overflow-hidden border border-white/10">

            {/* Навигационные ссылки */}
            <div className="px-2 py-2">
              {nav.map((n, index) => (
                <button
                  key={n.id}
                  onClick={() => { setMobileOpen(false); onNav(n.id); }}
                  className={`w-full text-left px-4 py-3 hover:bg-white/10 active:scale-95 transition-all duration-200 text-base text-white/80 hover:text-white rounded-xl group ${mobileOpen ? 'animate-fadeInUp' : ''
                    }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{n.label}</span>
                    <div className="w-2 h-2 bg-white/30 rounded-full group-hover:bg-white transition-all duration-200 group-hover:scale-125" />
                  </div>
                </button>
              ))}
            </div>

            {/* Кнопка Wishlist */}
            <div className={`px-4 py-3 border-t border-white/10 ${mobileOpen ? 'animate-fadeInUp' : ''
              }`}
              style={{
                animationDelay: '400ms',
                animationFillMode: 'both'
              }}>
              <a
                href="#"
                className={BTN_PRIMARY_GLASS + " w-full inline-flex items-center justify-center px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-xl"}
              >
                Add to Wishlist
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ========================= HERO — одна мягкая тень + кнопки ниже ========================= */
function Hero() {
  return (
    <section className="relative isolate h-[80.85vh] w-full overflow-hidden" id="top">
      {/* offset for fixed header */}
      <div className="absolute top-0 left-0 right-0 h-16" aria-hidden="true" />
      {/* Background WEBM video */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover scale-110"
          autoPlay
          loop
          muted
          playsInline
          poster={MEDIA.hero.poster}
        >
          <source src={MEDIA.hero.videoWebm} type="video/webm" />
        </video>
        {/* лёгкое затемнение */}
        <div className="absolute inset-0 bg-black/25" />

      </div>

      <div className="mx-auto flex h-full max-w-7xl flex-col px-4 text-center">
        {/* Верхняя половина: центрированный логотип */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={MEDIA.logos.hero}
            alt="Synvector Logo"
            className="h-[22px] sm:h-[31px] md:h-10 lg:h-11 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            decoding="async"
            fetchpriority="high"
          />
        </div>

        {/* Нижняя половина: отступ вместо трейлера (текст/CTA при желании) */}
        <div className="flex-1" />
      </div>
    </section>
  );
}

/* ===== Social links buttons strip ===== */
function SocialButtons() {
  return (
    <section className="bg-white pt-2 pb-8 sm:pb-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {MEDIA.socials.filter(s => s.label !== 'Steam').map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 active:scale-95 transition shadow-sm ring-1 ring-black/10 w-[140px] sm:w-[160px]"
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center">
                {s.label === 'Reddit' && <IconBrandReddit width={20} height={20} />}
                {s.label === 'YouTube' && <IconBrandYouTube width={20} height={20} />}
                {s.label === 'Telegram' && <IconBrandTelegram width={20} height={20} />}
                {s.label === 'Discord' && <IconBrandDiscord width={20} height={20} />}
              </span>
              <span className="text-sm font-medium truncate">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Текстовый блок перед боди (чистый фон, без рамок) ===== */
function IntroText() {
  const [ref, visible] = useInView({ threshold: 0.15 });
  return (
    <section
      id="about"
      ref={ref}
      className={`bg-white pt-8 pb-6 sm:pb-8 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">About the Game</h2>
        <p className="mt-3 text-slate-700 text-base sm:text-lg leading-relaxed">
          SYNVECTOR is a sci-fi action RPG where you command an independent mercenary fleet in a galaxy torn by war and betrayal. Switch between real-time third-person combat and tactical pause, customize your ships, and team up in 4-player co-op. Your choices and reputation shape missions, factions, and the fate of the stars.
        </p>
      </div>
    </section>
  );
}

/* ========== Full-bleed Info Blocks (edge-to-edge), clean ========= */
function InfoBlocks() {
  // добавляем один блок поверх MEDIA.infoBlocks
  const extraBlock = {
    title: "Multi-Genre Gameplay",
    text: "Engage in fast-paced real-time space battles, where every second counts. Use the *active pause* to issue tactical commands, then jump right back into the action. Between the fights, explore role-playing elements that let you shape your character and fleet.",
    img: "/media/slide5.webp",
  };
  const blocks = [...MEDIA.infoBlocks, extraBlock];

  return (
    <section className="relative w-full bg-white">
      <div className="space-y-0">
        {blocks.map((b, i) => (
          <InfoRow key={i} {...b} flip={i % 2 === 1} />
        ))}
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
  const shots = [
    "/media/pp/0.webp",
    "/media/pp/1.webp",
    "/media/pp/2.webp",
    "/media/pp/3.webp",
    "/media/pp/4.webp",
    "/media/pp/5.webp",
    "/media/pp/6.webp",
    "/media/pp/7.webp",
    "/media/pp/8.webp",
    "/media/pp/9.webp",
    "/media/pp/10.webp",
    "/media/pp/11.webp",
    "/media/pp/12.webp",
    "/media/pp/13.webp",
    "/media/pp/14.webp",
    "/media/pp/15.webp",
    "/media/pp/16.webp",
    "/media/pp/17.webp",
    "/media/pp/18.webp",
    "/media/pp/19.webp",
    "/media/pp/20.webp",
    "/media/pp/21.webp",
    "/media/pp/22.webp",
    "/media/pp/23.webp",
    "/media/pp/24.webp",
    "/media/pp/25.webp",
    "/media/pp/26.webp",
    "/media/pp/27.webp",
    "/media/pp/28.webp",
    "/media/pp/29.webp",
    "/media/pp/30.webp",
    "/media/pp/31.webp",
    "/media/pp/32.webp",
    "/media/pp/33.webp",
    "/media/pp/34.webp",
    "/media/pp/35.webp",
  ];

  // Manually editable team list (trimmed to requested members only)
  const teamMembers = [
    //{ name: "Aleksey Aleshin",  linkedin: "https://www.linkedin.com/in/greylis-54148a12a/", img: shots[0] },
    //{ name: "Tatiana Tarlakova", linkedin: "https://www.linkedin.com/in/pavel-pusuna-663338207/", img: shots[14] },
    { name: "Daniil Yuminov - 2D/Art Lead", linkedin: "https://www.linkedin.com/in/daniil-yuminov-91746b1a7/", img: shots[32] },
    { name: "Maksym Novikov - Lead Game Designer", linkedin: "https://www.linkedin.com/in/maksym-novikov-92062667/", img: shots[13] },
    { name: "Denis Lachikhin - 3D Lead", linkedin: "https://www.linkedin.com/in/denis-lachikhin-706a7b72/", img: shots[33] },
    { name: "Andrey Shmanatov - Dev lead/CTO", linkedin: "https://www.linkedin.com/in/andrey-shmanatov-b8a6b6166/", img: shots[34] },
    { name: "Pavel Puzyna - Narrative designer", linkedin: "https://www.linkedin.com/in/pavel-pusuna-663338207/", img: shots[35] },
    { name: "Daniil Aliyeu - QA Lead", linkedin: "https://www.linkedin.com/in/daniil-aliyeu/", img: shots[16] }
  ];

  const team = [
    { role: "3D / 2D Artists", name: "7" },
    { role: "Developers & DevOps", name: "4" },
    { role: "Game Designers & CEO", name: "3" },

    { role: "UI/UX Designers", name: "2" },
    { role: "Tech & VFX Specialists", name: "2" },
    { role: "Project Manager", name: "1" },

    { role: "Community Manager", name: "1" },
    { role: "Cinematic & Music Designer", name: "1" },
  ];

  return (
    <section
      id="team"
      ref={ref}
      className={`relative py-14 bg-white transition-all duration-700 ease-out overflow-hidden ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
    >
      <div className="mx-auto max-w-6xl px-4 overflow-hidden">
        <div className="mb-8">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-center px-2">Experienced team<br />you can trust</h2>
          <p className="mt-3 text-center text-slate-600 max-w-3xl mx-auto text-sm xs:text-base sm:text-lg px-4 text-wrap">
            Our core team comes from top studios like <strong>Wargaming</strong>, <strong>Playrix</strong>, <strong>Gaya</strong>, and <strong>Ubisoft</strong>. With strong backgrounds in both <strong>AAA</strong> and large-scale mobile projects, we combine industry best practices and deep market knowledge to deliver high-quality, commercially successful games.
          </p>
        </div>

        {/* Section label before team photos */}
        <div className="mb-4 px-1">
          <div className="text-[11px] xs:text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-500 font-semibold">OUR LEADERS</div>
        </div>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-12">
          {/* Collage */}
          <div className="lg:col-span-8 overflow-hidden">
            <div className="grid grid-cols-3 gap-1 xs:gap-2 sm:gap-4">
              {teamMembers.map((m, idx) => {
                const rowIndex = Math.floor(idx / 3);
                const offsetPx = rowIndex % 2 === 0 ? 8 : -8; // alternate rows right/left
                return (
                  <div key={idx} className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg hover-aurora group w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto" style={{ transform: `translateX(${offsetPx}px)` }}>
                    <img src={m.img || shots[idx % shots.length]} alt={m.name} className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 group-hover:blur-sm" loading="lazy" decoding="async" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="relative z-10 px-2">
                        <div className="text-white text-xs xs:text-sm sm:text-base font-semibold">{m.name}</div>
                        {m.linkedin ? (
                          <a href={m.linkedin} target={m.linkedin.startsWith('http') ? '_blank' : undefined} rel={m.linkedin.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-2 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-900 p-2 transition">
                            <IconBrandLinkedIn width={16} height={16} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-16 rounded-2xl bg-white/80 backdrop-blur-sm ring-1 ring-black/5 p-4 sm:p-6 shadow-sm hover-aurora">
              <h3 className="text-xl sm:text-2xl font-semibold">Team Structure</h3>
              <p className="mt-2 text-slate-600 text-sm sm:text-base text-wrap">
                Our diverse team of 21 professionals working together to create exceptional gaming experiences.
              </p>
              <ul className="mt-4 space-y-2 sm:space-y-3">
                {team.map((m, i) => (
                  <li key={i} className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-slate-600">{m.role}</span>
                    <span className="font-medium text-slate-900">{m.name}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 text-xs sm:text-sm text-slate-500">
                Want to collaborate? <a href="mailto:sspacefleetcommander@gmail.com" className="underline decoration-slate-400 hover:text-slate-700">Get in touch</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====================== Media / FAQ / Newsletter ====================== */
function Media() {
  const [ref, visible] = useInView({ threshold: 0.15 });
  const YT_ID = MEDIA.trailerYouTubeId;

  return (
    <section
      id="media"
      ref={ref}
      className={`relative py-14 bg-white transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
    >
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">Watch the Trailer</h2>

        <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/5 hover-aurora">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${YT_ID}?rel=0&modestbranding=1`}
            title="Trailer"
            loading="lazy"
            referrerPolicy="origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "What platforms will be supported?", a: "PC at launch. Consoles TBD." },
    { q: "Will there be multiplayer?", a: "Co-op and competitive modes are planned post-launch." },
    { q: "When is the release date?", a: "To be announced. Follow our socials for updates." },
  ];
  const [ref, visible] = useInView({ threshold: 0.15 });

  return (
    <section
      id="faq"
      ref={ref}
      className={`relative py-14 bg-white transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">FAQ</h2>
        <div className="mt-6 bg-white rounded-2xl shadow-sm ring-1 ring-black/5 hover-aurora">
          {faqs.map((f, i) => (
            <details key={i} className="p-5 transition active:scale-95">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between gap-4 select-none transition active:scale-95">
                <span><span className="mr-2">{i + 1}.</span> {f.q}</span>
                <span className="text-slate-400">▼</span>
              </summary>
              <p className="mt-2 text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-slate-600 text-base sm:text-lg">Ask the question.</p>
          <a
            href="mailto:sspacefleetcommander@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition rounded-xl hover-aurora"
          >
            Email Us
          </a>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [ref, visible] = useInView({ threshold: 0.15 });
  return (
    <section
      ref={ref}
      className={`relative py-14 bg-white transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl bg-gradient-to-r from-white to-slate-50 p-8 text-center shadow-sm ring-1 ring-black/5 hover-aurora">
          <h3 className="text-2xl font-semibold">Get Updates</h3>
          <p className="mt-2 text-slate-600">
            Subscribe for dev logs, betas, and release news.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks!");
            }}
            className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="w-full max-w-md px-4 py-3 bg-white shadow-sm placeholder:text-slate-400 ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button type="submit" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition rounded-xl hover-aurora">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===== Footer — СТЕКЛЯННЫЙ как хедер ===== */
function Footer({ setShowPrivacy, setShowTerms }) {
  return (
    <footer className="py-4 bg-neutral-900/85 text-white backdrop-blur-xl ring-1 ring-white/10 supports-[backdrop-filter]:bg-neutral-900/75">
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


