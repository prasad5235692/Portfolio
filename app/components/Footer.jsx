'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
     
      <div
        className="site-footer section-padding"
        style={{ borderTop: '1px solid rgba(255, 0, 60, 0.15)', paddingTop: '2rem', paddingBottom: '2rem', background: 'transparent' }}
      >
        <div className="content-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)', boxShadow: '0 0 8px rgba(255,0,60,0.6)' }} />
          <span
            className="footer-label text-[11px] tracking-[0.42em] uppercase"
            style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,255,255,0.45)' }}
          >
            portfolio
          </span>
        </div>

        <motion.p
          className="footer-copy text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          &copy; {year} — Built with Next.js &amp; GSAP
        </motion.p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          data-cursor="pointer"
          className="footer-top text-[12px] tracking-[0.42em] uppercase transition-colors duration-300 hover:text-[#ff003c]"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-inter)' }}
        >
          ↑ Back to Top
        </button>
        </div>
      </div>
    </footer>
  );
}
