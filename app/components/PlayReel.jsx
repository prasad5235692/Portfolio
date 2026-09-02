'use client';
import { motion } from 'framer-motion';

export default function PlayReel() {
  return (
    <section className="section-padding flex items-center justify-center" style={{ background: 'transparent' }}>
      <motion.button
        className="play-reel group"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.1 }}
        data-cursor="pointer"
      >
        <div className="flex flex-col items-center gap-1">
          <svg
            className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            PLAY REEL
          </span>
        </div>
      </motion.button>
    </section>
  );
}
