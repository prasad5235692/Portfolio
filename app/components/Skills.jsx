'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollRevealText from './ScrollRevealText';

const services = [
  {
    id: '01',
    title: 'CREATIVE',
    subtitle: 'DEVELOPMENT',
    desc: 'Building immersive, interaction-rich sites that blur the line between art and engineering.',
  },
  {
    id: '02',
    title: 'FRONTEND',
    subtitle: 'ENGINEERING',
    desc: 'Turning designs into pixel-perfect, performant web experiences users remember.',
  },
  {
    id: '03',
    title: 'MOBILE',
    subtitle: 'DEVELOPMENT',
    desc: 'Cross-platform apps that feel native — fast, intuitive, and polished.',
  },
  {
    id: '04',
    title: 'BACKEND',
    subtitle: 'DEVELOPMENT',
    desc: 'Scalable APIs and server architectures that power everything under the hood.',
  },
  {
    id: '05',
    title: 'CHATBOTS',
    subtitle: 'DEVELOPMENT',
    desc: 'Leveraging artificial intelligence to create intelligent, adaptive, and efficient solutions.',
  },
];

const EASE = [0.22, 1, 0.36, 1];

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (listRef.current && !listRef.current.contains(e.target)) {
        setActiveSkill(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleSkillClick = (id) => {
    setActiveSkill(prev => prev === id ? null : id);
  };

  return (
    <section id="services" className="section-padding min-h-screen" style={{ background: 'transparent' }}>
      <div className="content-container">
        <div className="flex items-center justify-between mb-16">
          <ScrollRevealText
            text="SKILLS"
            as="p"
            className="text-[14px] tracking-[0.4em] uppercase"
            style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
            stagger={0.06}
            duration={0.6}
            start="top 85%"
          />
          <motion.span
            className="text-[9px] tracking-[0.4em] uppercase hidden md:block"
            style={{ color: 'rgba(255,255,255,0.18)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            What I offer
          </motion.span>
        </div>

        <div className="relative" ref={listRef}>
          {services.map((s, i) => {
            const isReversed = i % 2 === 0;
            const isActive = activeSkill === s.id;
            const gridTemplate = isReversed
              ? 'grid-cols-2 md:grid-cols-[auto_1.5fr_2fr]'
              : 'grid-cols-2 md:grid-cols-[2fr_1.5fr_auto]';

            const titleCol = (
              <div className={`relative z-10 ${isReversed ? 'text-right' : ''}`}>
            
                <h3
                  className="text-[clamp(1rem,3.5vw,4.5rem)] font-black leading-none tracking-[0.03em]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  <span
                    className="block font-medium group-hover:text-black"
                    style={{ transition: 'color 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  >
                    {s.title}
                  </span>
                  <span
                    className="block text-stroke font-medium group-hover:text-black group-hover:[-webkit-text-stroke:0]"
                    style={{ transition: 'color 0.45s cubic-bezier(0.22, 1, 0.36, 1), -webkit-text-stroke 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  >
                    {s.subtitle}
                  </span>
                </h3>
              </div>
            );

            const descCol = (
              <div
                className="relative z-10 self-center w-full min-w-0"
              >
                <div className={`srv-desc-wrap${isActive ? ' expanded' : ''}`}>
                  <p
                    className={`srv-desc text-[14px] md:text-[16px] leading-[1.4] md:leading-relaxed max-w-[150px] md:max-w-[380px] ${isReversed ? 'text-left' : 'text-right'} opacity-100 md:opacity-0 ${isReversed ? 'md:translate-x-5' : 'md:-translate-x-5'} md:group-hover:opacity-100 md:group-hover:translate-x-0 text-[rgba(255,255,255,0.20)] md:group-hover:text-black`}
                    style={{
                      fontFamily: 'var(--font-inter)',
                      transition: 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            );

            const arrowCol = (
              <span
                className={`srv-arrow shrink-0 text-sm group-hover:translate-x-1 group-hover:-rotate-45 group-hover:text-black absolute md:relative ${isReversed ? 'right-1 md:right-auto' : 'left-1 md:left-auto'}`}
                style={{
                  color: 'rgba(255,255,255,0.10)',
                  fontFamily: 'var(--font-inter)',
                  justifySelf: isReversed ? 'start' : 'end',
                  transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                →
              </span>
            );

            return (
              <motion.div
                key={s.id}
                className={`group services-row relative py-[18px] md:py-[116px] border-b cursor-default${isActive ? ' is-active' : ''}`}
                style={{ borderColor: 'var(--line-color)' }}
                onClick={() => handleSkillClick(s.id)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                animate={isActive ? { y: -6 } : { y: 0 }}
                whileHover={isMobile ? undefined : {
                  y: -6,
                  borderColor: 'rgba(255, 0, 60, 0.35)',
                  boxShadow: '0 20px 50px -12px rgba(0,0,0,0.6)'
                }}
                whileTap={isMobile ? undefined : {
                  y: -4,
                  borderColor: 'rgba(255, 0, 60, 0.35)',
                  boxShadow: '0 20px 50px -12px rgba(0,0,0,0.6)'
                }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  default: {
                    delay: i * 0.07,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1]
                  },
                  y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  borderColor: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  boxShadow: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
              >
                <div className="bg-hover-expand" />
                <div
                  className="absolute -top-6 select-none pointer-events-none"
                  style={{
                    [isReversed ? 'right' : 'left']: '-0.5rem',
                  }}
                >
                  <span
                    className="text-[clamp(8rem,16vw,14rem)] font-black leading-none"
                    style={{
                      color: 'rgba(255,255,255,0.025)',
                      fontFamily: 'var(--font-inter)',
                      WebkitTextStroke: '1px rgba(255,0,60,0.06)',
                    }}
                  >
                    {s.id}
                  </span>
                </div>

                <span
                  className={`srv-arrow md:hidden absolute text-sm ${isReversed ? 'left-1' : 'right-1'}`}
                  style={{
                    top: '50%',
                    color: 'rgba(255,255,255,0.10)',
                    transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  →
                </span>

                <div className={`grid gap-2 md:gap-10 items-start ${gridTemplate} ${isReversed ? 'ml-4 md:ml-0' : 'mr-4 md:mr-0'}`}>
                  {isReversed ? (
                    <>
                      <span className="hidden md:contents">{arrowCol}</span>
                      {descCol}
                      {titleCol}
                    </>
                  ) : (
                    <>
                      {titleCol}
                      {descCol}
                      <span className="hidden md:contents">{arrowCol}</span>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
