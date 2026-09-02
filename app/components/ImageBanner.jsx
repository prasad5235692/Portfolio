'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ImageBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <section ref={ref} className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y, scale, background: 'linear-gradient(135deg, #0C0C0C 0%, #111111 40%, #0C0C0C 100%)' }}
      >
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,243,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,243,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            className="text-[8vw] font-bold tracking-[-0.02em] font-bold"
            style={{ fontFamily: 'var(--font-inter)', color: 'rgba(255,0,60,0.12)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            SELECTED WORK
          </motion.p>
        </div>
      </motion.div>

      {/* Gradient overlays for smooth blending */}
      <div className="absolute inset-x-0 top-0 h-24 z-10" style={{ background: 'linear-gradient(to bottom, #0C0C0C, transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-24 z-10" style={{ background: 'linear-gradient(to top, #0C0C0C, transparent)' }} />
    </section>
  );
}
