"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import Magnetic, { useMagnetic } from "./Magnetic";

const navItems = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "work", label: "WORK" },
  { id: "contact", label: "CONTACT" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/prasad-k-b70677374/",
    icon: FaLinkedinIn,
  },
  {
    label: "GitHub",
    href: "https://github.com/prasad5235692",
    icon: FaGithub,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/9342936209",
    icon: FaWhatsapp,
  },
];

/* ── Desktop MENU → nav transformation — coordinated variants, item hover untouched ── */
const menuLabelVariants = {
  closed: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    height: "4.75rem",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
    },
  },
  open: {
    opacity: 0,
    x: -12,
    scale: 0.92,
    filter: "blur(4px)",
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const deskListVariants = {
  open: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

const deskItemVariants = {
  closed: {
    opacity: 0,
    x: -30,
    scale: 0.95,
    filter: "blur(6px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  open: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.96,
    filter: "blur(5px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ── prefers-reduced-motion gate (mobile cinematic animation only) ── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/* ── Desktop flip button — hover animation preserved exactly ── */
function FlipNavButton({ item, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const activeTextClass = isActive ? "text-[#ff003c]" : "text-white/42";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`group relative h-[1.05rem] overflow-hidden whitespace-nowrap text-left text-[12px] tracking-[0.34em] ${activeTextClass}`}
      style={{
        fontFamily: "var(--font-inter)",
        perspective: "900px",
        transformStyle: "preserve-3d",
      }}
      data-cursor="pointer"
    >
      <span className="sr-only">{item.label}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        animate={
          isHovered
            ? { rotateX: -90, y: -18, opacity: 0 }
            : { rotateX: 0, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "50% 100%" }}
      >
        {item.label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block text-white"
        animate={
          isHovered
            ? { rotateX: 0, y: 0, opacity: 1 }
            : { rotateX: 90, y: 18, opacity: 0 }
        }
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "50% 0%" }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
}

/* ── Mobile-only Three.js visual — lazy-initialized, never runs on desktop ── */
function MobileMenuVisual({ staticFrame = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Hard gate: never init on desktop viewports
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let renderer = null;
    let rafId = 0;
    let geometry = null;
    let geometry2 = null;
    let material = null;
    let material2 = null;
    let onResize = null;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !mountRef.current) return;

      const width = mount.clientWidth || 320;
      const height = mount.clientHeight || 480;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      // Layer 1 — soft white starfield drifting forward (warp / zoom feel)
      const COUNT = 220;
      const positions = new Float32Array(COUNT * 3);
      const speeds = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        speeds[i] = 0.008 + Math.random() * 0.03;
      }
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.055,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
        depthWrite: false,
      });
      const stars = new THREE.Points(geometry, material);
      scene.add(stars);

      // Layer 2 — red embers, fewer + larger for black/red theme glow
      const COUNT2 = 70;
      const positions2 = new Float32Array(COUNT2 * 3);
      const speeds2 = new Float32Array(COUNT2);
      for (let i = 0; i < COUNT2; i++) {
        positions2[i * 3] = (Math.random() - 0.5) * 10;
        positions2[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions2[i * 3 + 2] = (Math.random() - 0.5) * 10;
        speeds2[i] = 0.012 + Math.random() * 0.04;
      }
      geometry2 = new THREE.BufferGeometry();
      geometry2.setAttribute(
        "position",
        new THREE.BufferAttribute(positions2, 3),
      );
      material2 = new THREE.PointsMaterial({
        color: 0xff003c,
        size: 0.11,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
      });
      const embers = new THREE.Points(geometry2, material2);
      scene.add(embers);

      // Cinematic dolly: start far → ease forward (zoom-in)
      const targetZ = 5.2;
      const posAttr = geometry.getAttribute("position");
      const posAttr2 = geometry2.getAttribute("position");

      const drift = (attr, spd, limit) => {
        const arr = attr.array;
        for (let i = 0; i < spd.length; i++) {
          arr[i * 3 + 2] += spd[i];
          if (arr[i * 3 + 2] > limit) arr[i * 3 + 2] = -limit;
        }
        attr.needsUpdate = true;
      };

      const tick = () => {
        camera.position.z += (targetZ - camera.position.z) * 0.055;
        stars.rotation.y += 0.0012;
        stars.rotation.x += 0.0004;
        embers.rotation.y -= 0.0018;
        embers.rotation.z += 0.0006;
        drift(posAttr, speeds, 6);
        drift(posAttr2, speeds2, 5);
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(tick);
      };

      onResize = () => {
        if (!mountRef.current || !renderer) return;
        const w = mount.clientWidth || 320;
        const h = mount.clientHeight || 480;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (staticFrame) renderer.render(scene, camera);
      };
      window.addEventListener("resize", onResize);

      if (staticFrame) {
        // Reduced motion: single static frame at the settled zoom, no loop
        camera.position.set(0, 0, targetZ);
        renderer.render(scene, camera);
      } else {
        tick();
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener("resize", onResize);
      if (renderer) {
        renderer.dispose();
        try {
          renderer.forceContextLoss();
        } catch {
          /* noop */
        }
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      }
      if (geometry) geometry.dispose();
      if (geometry2) geometry2.dispose();
      if (material) material.dispose();
      if (material2) material2.dispose();
    };
  }, [staticFrame]);

  return <div ref={mountRef} className="mnav-three-mount" aria-hidden="true" />;
}

export default function Navigation({ visible }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [magneticReady, setMagneticReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const logoRef = useRef(null);

  const scrollProgressRef = useRef(0);
  const activeSectionRef = useRef("home");
  const rafIdRef = useRef(null);

  useMagnetic(logoRef, { strength: 0.3, radius: 150, enabled: magneticReady });

  /* Mobile viewport gate — Three.js + modal only below md breakpoint */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const flushState = () => {
      setScrollProgress(scrollProgressRef.current);
      setActiveSection(activeSectionRef.current);
      rafIdRef.current = null;
    };

    const scheduleFlush = () => {
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(flushState);
      }
    };

    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = height > 0 ? (winScroll / height) * 100 : 0;

      const sections = ["home", "about", "work", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          activeSectionRef.current = id;
          break;
        }
      }

      scheduleFlush();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setMagneticReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  /* Mobile menu: lock background scroll + close on Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (window.lenis && typeof window.lenis.stop === "function") {
      try {
        window.lenis.stop();
      } catch {
        /* noop */
      }
    }
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      if (window.lenis && typeof window.lenis.start === "function") {
        try {
          window.lenis.start();
        } catch {
          /* noop */
        }
      }
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /* Auto-close mobile menu if viewport grows to desktop */
  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleMobileNav = (id) => {
    setMenuOpen(false);
    // Let the zoom-out start before smooth-scrolling
    setTimeout(() => scrollTo(id), 140);
  };

  const pct = String(Math.round(scrollProgress)).padStart(2, "0");

  return (
    <>
      <style>{`
        :root {
          --desktop-nav-rail-inset: 1.5rem;
          --desktop-nav-rail-width: 4.5rem;
          --desktop-nav-stack-gap: 0.75rem;
        }

        /* ══ DESKTOP vertical rail — isolated to md+ ══ */
        @media (min-width: 768px) {
          .desktop-side-nav {
            position: fixed;
            left: var(--desktop-nav-rail-inset);
            top: 1.5rem;
            z-index: 50;
            width: var(--desktop-nav-rail-width);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .desktop-v-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .desktop-v-item {
            width: 2rem;
            height: 4.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .desktop-v-rotate {
            rotate: -90deg;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* ── Desktop MENU hover zone — desktop-only, preserves rail ── */
          .desktop-menu-zone {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0.35rem 0.9rem;
            margin: -0.35rem -0.9rem;
          }
          .desktop-menu-label-btn {
            width: 2rem;
            height: 4.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: 0;
            padding: 0;
            cursor: pointer;
            overflow: hidden;
          }
          .desktop-menu-label-btn:focus-visible {
            outline: 1px solid rgba(255,255,255,0.35);
            outline-offset: 2px;
            border-radius: 4px;
          }
          .desktop-menu-label-rotate {
            rotate: -90deg;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-inter);
            font-size: 12px;
            letter-spacing: 0.34em;
            text-indent: 0.34em;
            white-space: nowrap;
            line-height: 1;
            color: rgba(255,255,255,0.75);
          }
          .desktop-menu-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .desktop-progress {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
          }
          .desktop-social-rail {
            left: var(--desktop-nav-rail-inset);
            bottom: 1.5rem;
            z-index: 50;
            width: var(--desktop-nav-rail-width);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--desktop-nav-stack-gap);
          }
          .desktop-progress-pct {
            rotate: -90deg;
            white-space: nowrap;
            line-height: 1;
            margin: 0.9rem 0;
          }
          .desktop-progress-track {
            width: 4.5rem;
            height: 1px;
            background: rgba(255,255,255,0.10);
            rotate: -90deg;
            margin: 2.1rem 0 1.6rem;
          }
          .desktop-progress-fill {
            height: 100%;
            background: var(--accent-red);
          }
          .mobile-nav-root,
          .mobile-menu-trigger { display: none !important; }
        }

        /* ══ MOBILE — isolated to <md, desktop rail hidden ══ */
        @media (max-width: 767px) {
          .desktop-side-nav { display: none !important; }

          .mobile-menu-trigger {
            position: fixed;
            left: 1rem;
            top: 1rem;
            z-index: 65;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            min-height: 44px;
            padding: 0.6rem 1rem;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(10,10,12,0.55);
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
            color: rgba(255,255,255,0.85);
            font-family: var(--font-inter);
            font-size: 10px;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            max-width: calc(100vw - 7.5rem);
          }
          .mobile-menu-trigger-bars {
            display: flex;
            flex-direction: column;
            gap: 5px;
            flex-shrink: 0;
          }
          .mobile-menu-trigger-bars span {
            display: block;
            width: 18px;
            height: 1.5px;
            background: #fff;
          }
          .mobile-menu-trigger-bars span:last-child {
            width: 12px;
            background: var(--accent-red);
          }

          .mobile-nav-root {
            position: fixed;
            inset: 0;
            z-index: 70;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            overflow-x: hidden;
            overflow-y: auto;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .mnav-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.62);
          }
          .mnav-visual {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
          }
          .mnav-visual::after {
            content: '';
            position: absolute;
            inset: 0;
            background:
              radial-gradient(60% 45% at 50% 30%, rgba(255,0,60,0.16), transparent 70%),
              radial-gradient(80% 60% at 50% 110%, rgba(255,0,60,0.10), transparent 70%);
            pointer-events: none;
          }
          .mnav-three-mount {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }
          .mnav-panel {
            position: relative;
            width: min(88vw, 380px);
            max-width: 100%;
            max-height: 86dvh;
            overflow-x: hidden;
            overflow-y: auto;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.10);
            background: rgba(12,12,14,0.55);
            -webkit-backdrop-filter: blur(22px) saturate(140%);
            backdrop-filter: blur(22px) saturate(140%);
            box-shadow:
              0 0 0 1px rgba(255,0,60,0.08),
              0 24px 80px rgba(0,0,0,0.55),
              0 0 60px rgba(255,0,60,0.12);
            padding: clamp(1.25rem, 5vw, 2rem);
            overscroll-behavior: contain;
          }
          .mnav-close {
            position: absolute;
            top: 0.85rem;
            right: 0.85rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.04);
            color: rgba(255,255,255,0.8);
            font-size: 18px;
            line-height: 1;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .mnav-list {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-top: 2.25rem;
          }
          .mnav-item {
            display: flex;
            align-items: baseline;
            gap: 0.9rem;
            width: 100%;
            padding: 0.85rem 0.5rem;
            border: 0;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            background: transparent;
            color: rgba(255,255,255,0.72);
            font-family: var(--font-inter);
            text-align: left;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .mnav-item:last-child { border-bottom: 0; }
          .mnav-item.is-active { color: var(--accent-red); }
          .mnav-index {
            font-size: 10px;
            letter-spacing: 0.3em;
            color: rgba(255,255,255,0.30);
            flex-shrink: 0;
          }
          .mnav-item.is-active .mnav-index { color: var(--accent-red); }
          .mnav-label {
            font-size: clamp(1.5rem, 8vw, 2rem);
            font-weight: 700;
            letter-spacing: 0.08em;
            line-height: 1.1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .mnav-foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1.25rem;
            padding: 0 0.5rem;
            font-family: var(--font-inter);
            font-size: 11px;
            letter-spacing: 0.3em;
            color: rgba(255,255,255,0.45);
          }
          .mnav-progress {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }
          .mnav-progress-track {
            width: 3.5rem;
            height: 1px;
            background: rgba(255,255,255,0.12);
          }
          .mnav-progress-fill {
            height: 100%;
            background: var(--accent-red);
          }
          /* No stuck hover on touch — active state only */
          @media (hover: none) {
            .mnav-item:hover { background: transparent; }
            .mnav-close:hover { background: rgba(255,255,255,0.04); }
          }
        }
      `}</style>

      <div
        id="navbar-logo-anchor"
        aria-hidden="true"
        className="fixed right-4 top-4 z-40 rounded-full border border-transparent px-4 py-2 text-[21px] tracking-[0.34em] md:right-6 md:top-6"
        style={{
          fontFamily: "var(--font-inter)",
          lineHeight: 1,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        PK
      </div>

      {/* ── DESKTOP: top-left vertical rail, no glass — pct first, labels below ── */}
      <motion.nav
        aria-label="Primary"
        className="desktop-side-nav hidden md:flex"
        initial={{ x: -48, opacity: 0 }}
        animate={{ x: visible ? 0 : -48, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="desktop-progress">
          <p
            className="desktop-progress-pct text-[14px] text-white/45"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {pct}%
          </p>
          <div className="desktop-progress-track">
            <motion.div
              className="desktop-progress-fill"
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── Desktop MENU hover zone — desktop-only, mobile untouched ── */}
        <div
          className="desktop-menu-zone"
          onMouseEnter={() => setDeskOpen(true)}
          onMouseLeave={() => setDeskOpen(false)}
          onFocus={() => setDeskOpen(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setDeskOpen(false);
          }}
        >
          <button
            type="button"
            className="desktop-menu-label-btn"
            aria-expanded={deskOpen}
            aria-controls="desktop-nav-list"
            onClick={() => setDeskOpen((v) => !v)}
            data-cursor="pointer"
          >
            <span className="desktop-menu-label-rotate">MENU</span>
          </button>

          <AnimatePresence initial={false}>
            {deskOpen && (
              <motion.div
                id="desktop-nav-list"
                className="desktop-menu-list desktop-v-list"
                variants={deskListVariants}
                initial="closed"
                animate="open"
                exit="exit"
              >
                {navItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="desktop-v-item"
                    variants={reduceMotion ? undefined : deskItemVariants}
                    initial={reduceMotion ? { opacity: 0 } : undefined}
                    animate={reduceMotion ? { opacity: 1 } : undefined}
                    exit={reduceMotion ? { opacity: 0 } : undefined}
                    transition={reduceMotion ? { duration: 0.15 } : undefined}
                  >
                    <div className="desktop-v-rotate">
                      <FlipNavButton
                        item={item}
                        isActive={activeSection === item.id}
                        onClick={() => scrollTo(item.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* ── MOBILE: compact trigger ── */}
      <motion.button
        type="button"
        className="mobile-menu-trigger md:hidden"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: visible ? 0 : -16, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="mobile-menu-trigger-bars" aria-hidden="true">
          <span />
          <span />
        </span>
        MENU
      </motion.button>

      {/* ── MOBILE: full glass modal with Three.js zoom ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav-root md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {/* Outside-tap layer */}
            <div
              className="mnav-backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Three.js visual layer — zoom-in on open, zoom-out on close */}
            <motion.div
              className="mnav-visual"
              aria-hidden="true"
              initial={
                reduceMotion ? { opacity: 0 } : { scale: 0.82, opacity: 0 }
              }
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.86, opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0.15 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {isMobile && <MobileMenuVisual staticFrame={reduceMotion} />}
            </motion.div>

            {/* Glass panel */}
            <motion.div
              className="mnav-panel"
              onClick={(e) => e.stopPropagation()}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { scale: 0.92, y: 28, opacity: 0 }
              }
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { scale: 0.94, y: 16, opacity: 0 }
              }
              transition={{
                duration: reduceMotion ? 0.15 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                className="mnav-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>

              <nav aria-label="Mobile" className="mnav-list">
                {navItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => handleMobileNav(item.id)}
                    className={`mnav-item${activeSection === item.id ? " is-active" : ""}`}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.08 + i * 0.06,
                      duration: reduceMotion ? 0.15 : 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="mnav-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mnav-label">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="mnav-foot">
                <span className="mnav-progress">
                  <span className="mnav-progress-track">
                    <span
                      className="mnav-progress-fill"
                      style={{ display: "block", width: `${scrollProgress}%` }}
                    />
                  </span>
                  {pct}%
                </span>
                <span>PK©26</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PK logo — unchanged top-right ── */}
      <motion.button
        id="navbar-logo"
        ref={logoRef}
        type="button"
        onClick={() => scrollTo("home")}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-black/30 px-6 py-8 text-[21px] tracking-[0.34em] text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:right-6 md:top-6"
        style={{ fontFamily: "var(--font-inter)" }}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
        transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        data-cursor="pointer"
      >
        PK
      </motion.button>

      {/* ── Socials — unchanged bottom-left ── */}
      <motion.div
        className="desktop-social-rail fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3 md:bottom-6 md:left-6"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: visible ? 0 : 24, opacity: visible ? 1 : 0 }}
        transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {socialLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Magnetic key={link.label} strength={0.25} radius={180}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/75 shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff003c]/50 hover:text-[#ff003c]"
                data-cursor="pointer"
              >
                <Icon className="text-sm transition-transform duration-300 group-hover:scale-110" />
              </a>
            </Magnetic>
          );
        })}
      </motion.div>
    </>
  );
}
