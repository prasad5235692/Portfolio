'use client';
import { useRef, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const PARAGRAPHS = [
  [
    { text: 'Over', highlight: false },
    { text: 'the', highlight: false },
    { text: 'years,', highlight: false },
    { text: 'I', highlight: false },
    { text: 'have', highlight: false },
    { text: 'been', highlight: false },
    { text: 'building', highlight: true },
    { text: 'web', highlight: true },
    { text: 'applications,', highlight: true },
    { text: 'AI', highlight: true },
    { text: 'tools,', highlight: true },
    { text: 'automation', highlight: true },
    { text: 'systems,', highlight: true },
    { text: 'and', highlight: false },
    { text: 'digital', highlight: true },
    { text: 'products', highlight: true },
  ],
  [
    { text: 'focused', highlight: true },
    { text: 'on', highlight: false },
    { text: 'performance,', highlight: true },
    { text: 'creativity,', highlight: true },
    { text: 'and', highlight: false },
    { text: 'user', highlight: true },
    { text: 'experience.', highlight: true },
  ],
];

export default function Experience() {
  const sectionRef = useRef(null);

useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  const el = sectionRef.current;
  if (!el) return;

  const ctx = gsap.context(() => {
    const letters = gsap.utils.toArray('.para-letter');

    if (!letters.length) return;

    gsap.set(letters, {
      opacity: 0.08,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 100%',
        end: 'bottom 90%',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    letters.forEach((letter) => {
      tl.to(
        letter,
        {
          opacity: 1,
          duration: 0.08,
          ease: 'none',
        },
        '+=0.02'
      );
    });
  }, el);

  return () => ctx.revert();
}, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding min-h-screen"
      style={{ background: 'transparent' }}
    >
      <div className="content-container">
        <motion.p
          className="text-[14px] tracking-[0.4em] uppercase mb-12 font-bold"
          style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          EXPERIENCE
        </motion.p>
        <div className="about-text-block w-fit mx-auto mb-[80px] md:mb-[120px]">
          {PARAGRAPHS.map((para, pi) => (
            <p key={pi} className="about-para-text">
              {para.map((wordObj, wi) => (
                <span key={wi} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                  {Array.from(wordObj.text).map((char, ci) => (
                    <span
                      key={`${wi}-${ci}`}
                      className="para-letter"
                      style={{
                        opacity: 0.08,
                        willChange: 'opacity',
                        color: wordObj.highlight ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {wi < para.length - 1 && (
                    <span className="para-letter" style={{ whiteSpace: 'pre' }}>&nbsp;</span>
                  )}
                </span>
              ))}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}
