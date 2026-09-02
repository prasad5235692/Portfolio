'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollRevealText from './ScrollRevealText';

export default function Motto() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      className="section-padding min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <motion.p
        className="text-[14px] tracking-[0.4em] uppercase mb-12"
        style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        MY MOTTO
      </motion.p>

      <motion.div style={{ y }}>
        <ScrollRevealText
          text="GOOD DESIGN IS HONEST"
          as="h2"
          className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] max-w-[700px] tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-inter)' }}
          stagger={0.12}
          duration={0.9}
          start="top 85%"
        />
      </motion.div>

      <motion.p
        className="text-sm mt-10"
        style={{ color: 'rgba(0,243,255,0.45)', fontFamily: 'var(--font-inter)', letterSpacing: '0.2em' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Dieter Rams
      </motion.p>
    </section>
  );
}
