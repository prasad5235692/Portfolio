'use client';
import { useRef, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PARAGRAPHS = [
  [
    { text: "I", highlight: false },
    { text: "turn", highlight: false },
    { text: "ideas", highlight: true },
    { text: "into", highlight: false },
    { text: "digital", highlight: true },
    { text: "products,", highlight: true },
    { text: "building", highlight: false },
    { text: "web", highlight: true },
    { text: "apps,", highlight: true },
    { text: "AI", highlight: true },
    { text: "tools,", highlight: true },
    { text: "and", highlight: false },
    { text: "automation", highlight: true },
    { text: "that", highlight: false },
    { text: "creates", highlight: false },
    { text: "real", highlight: true },
    { text: "value.", highlight: true },
  ],
  [
    { text: "Driven", highlight: true },
    { text: "by", highlight: false },
    { text: "curiosity.", highlight: true },
    { text: "Powered", highlight: true },
    { text: "by", highlight: false },
    { text: "technology.", highlight: true },
    { text: "Focused", highlight: true },
    { text: "on", highlight: false },
    { text: "creating", highlight: false },
    { text: "simple,", highlight: true },
    { text: "smart,", highlight: true },
    { text: "and", highlight: false },
    { text: "meaningful", highlight: true },
    { text: "experiences.", highlight: true },
  ],
];
export default function About() {
  const sectionRef = useRef(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.para-letter');

      gsap.set(letters, {
        opacity: 0.08,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 100%',
          end: 'bottom 90%',
          scrub: 1,
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
      id="about"
      ref={sectionRef}
      className="section-padding min-h-screen flex flex-col justify-center"
      style={{ background: 'transparent' }}
    >

      <div className="content-container">
        <motion.p
          className="text-[14px] tracking-[0.4em] uppercase mb-10 font-bold"
          style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          ABOUT ME
        </motion.p>

        <div className="about-text-block w-fit mx-auto">
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
