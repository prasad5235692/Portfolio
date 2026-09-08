'use client';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa6';

const footerSocials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prasad-k-b70677374/', icon: FaLinkedinIn },
  { label: 'GitHub', href: 'https://github.com/prasad5235692', icon: FaGithub },
  { label: 'WhatsApp', href: 'https://wa.me/9342936209', icon: FaWhatsapp },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <motion.div
        className="border-t border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-xl md:px-10 py-10"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="content-container flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: 'var(--accent-red)', boxShadow: '0 0 8px rgba(255,0,60,0.6)' }}
            />
            <span
              className="text-[11px] uppercase tracking-[0.42em]"
              style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.5)' }}
            >
              Prasad K.
            </span>
          </div>

          {/* Copyright */}
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-inter)' }}
          >
            &copy; {year} — Built with Next.js &amp; GSAP
          </p>

          {/* Socials + back to top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {footerSocials.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    data-cursor="pointer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff003c]/40 hover:text-[#ff003c]"
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-cursor="pointer"
              className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff003c]/40 hover:text-[#ff003c]"
              aria-label="Back to top"
            >
              <span className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
