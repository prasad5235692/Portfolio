'use client';
import { motion } from 'framer-motion';
import ScrollRevealText from './ScrollRevealText';

/*
 * Connect — aquadev.site contact section
 * Big spaced "S A Y  H I !" headline with email and social text links.
 */

const socials = [
  { label: 'LinkedIn', url: 'https://linkedin.com' },
  { label: 'GitHub', url: 'https://github.com' },
];

export default function Connect() {
  return (
    <section id="contact" className="section-padding min-h-screen flex flex-col" style={{ background: 'transparent' }}>
      <div className="content-container flex flex-col flex-1">
        {/* Section label */}
        <motion.p
          className="text-[14px] tracking-[0.4em] uppercase mb-12 font-bold"
          style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          CONTACT
        </motion.p>

        {/* CTA block */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {/* Top small text */}
          <motion.p
            className="text-[12px] tracking-[0.25em] uppercase mb-12"
            style={{
              color: 'var(--accent-light)',
              fontFamily: 'var(--font-inter)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            WANT TO WORK TOGETHER?
          </motion.p>

          {/* Huge headline */}
          <ScrollRevealText
            text="SAY HI!"
            as="h2"
            className="font-black leading-[0.85] tracking-[-0.04em] mb-8 text-center"
            style={{
              fontFamily: 'var(--font-inter)',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 'clamp(6rem, 18vw, 16rem)',
            }}
            stagger={0.1}
            duration={1}
            start="top 85%"
          />

          {/* Email */}
          <motion.a
            href="mailto:hello@aquadev.site"
            className="connect-email link-hover inline-block text-center py-4"
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 6rem)',
              color: 'var(--accent-light)',
              fontFamily: 'var(--font-inter)',
              borderBottom: '6px solid currentColor',
              lineHeight: 1,
              paddingBottom: '0.15em',
            }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-cursor="pointer"
          >
            prasad.itweb@gmail.com
          </motion.a>


          {/* Social text links */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {socials.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover text-[10px] tracking-[0.45em] uppercase transition-colors duration-300 hover:text-[#ff003c]"
                style={{ color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--font-inter)' }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="pointer"
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
