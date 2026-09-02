'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';
import Magnetic, { useMagnetic } from './Magnetic';

const navItems = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'work', label: 'WORK' },
  { id: 'contact', label: 'CONTACT' },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: FaLinkedinIn,
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: FaGithub,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/1234567890',
    icon: FaWhatsapp,
  },
];

function FlipNavButton({ item, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const activeTextClass = isActive ? 'text-[#ff003c]' : 'text-white/42';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`group relative h-[1.05rem] overflow-hidden text-left text-[11px] tracking-[0.34em] ${activeTextClass}`}
      style={{
        fontFamily: 'var(--font-inter)',
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
      data-cursor="pointer"
    >
      <span className="sr-only">{item.label}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        animate={isHovered ? { rotateX: -90, y: -18, opacity: 0 } : { rotateX: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 100%' }}
      >
        {item.label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block text-white"
        animate={isHovered ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: 90, y: 18, opacity: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 0%' }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
}

export default function Navigation({ visible }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [magneticReady, setMagneticReady] = useState(false);
  const logoRef = useRef(null);

  const scrollProgressRef = useRef(0);
  const activeSectionRef = useRef('home');
  const rafIdRef = useRef(null);

  useMagnetic(logoRef, { strength: 0.3, radius: 150, enabled: magneticReady });

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

      const sections = ['home', 'about', 'work', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          activeSectionRef.current = id;
          break;
        }
      }

      scheduleFlush();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setMagneticReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div
        id="navbar-logo-anchor"
        aria-hidden="true"
        className="fixed right-4 top-4 z-40 rounded-full border border-transparent px-4 py-2 text-[21px] tracking-[0.34em] md:right-6 md:top-6"
        style={{
          fontFamily: 'var(--font-inter)',
          lineHeight: 1,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        PK
      </div>

      <motion.nav
        className="fixed left-4 top-4 z-50 flex max-w-[calc(100vw-7rem)] flex-col gap-4 md:left-6 md:top-6 md:max-w-none md:p-4"
        initial={{ x: -48, opacity: 0 }}
        animate={{ x: visible ? 0 : -48, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-wrap items-center gap-3 font-bold md:flex-col md:items-start md:gap-4 md:px-5 md:py-5 md:text-lg">
          {navItems.map((item) => (
            <FlipNavButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => scrollTo(item.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="h-px bg-white/10 md:w-24" style={{ width: '4.5rem' }}>
            <motion.div
              className="h-full"
              style={{ background: 'var(--accent-red)' }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
          <p
            className="text-[14px] text-white/45"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {String(Math.round(scrollProgress)).padStart(2, '0')}%
          </p>
        </div>
      </motion.nav>

      <motion.button
        id="navbar-logo"
        ref={logoRef}
        type="button"
        onClick={() => scrollTo('home')}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/10 bg-black/30 px-4 py-4 text-[21px] tracking-[0.34em] text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:right-6 md:top-6"
        style={{ fontFamily: 'var(--font-inter)' }}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
        transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        data-cursor="pointer"
      >
        PK
      </motion.button>

      <motion.div
        className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3 md:bottom-6 md:left-6"
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