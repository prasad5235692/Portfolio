'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollRevealText
 * Splits `text` into word spans and animates them in on scroll.
 *
 * Props:
 *   text       — string to render
 *   as         — HTML tag to render (default "p")
 *   className  — class names for the wrapper element
 *   style      — inline styles for the wrapper element
 *   stagger    — per-word delay in seconds (default 0.06)
 *   duration   — animation duration per word (default 0.9)
 *   delay      — initial delay before stagger starts (default 0)
 *   start      — ScrollTrigger start (default "top 80%")
 *   once       — whether to play animation only once (default true)
 *   markers    — show ScrollTrigger markers for debugging (default false)
 */
export default function ScrollRevealText({
  text = '',
  as: Tag = 'p',
  className = '',
  style = {},
  stagger = 0.06,
  duration = 0.9,
  delay = 0,
  start = 'top 80%',
  once = true,
  markers = false,
}) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.srv-word');
    if (!words.length) return;

    gsap.set(words, { opacity: 0, y: 48, skewY: 3 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        once,
        markers,
      },
    });

    tl.to(words, {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration,
      ease: 'power3.out',
      stagger,
      delay,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [text, stagger, duration, delay, start, once, markers]);

  const words = text.split(' ');

  return (
    <Tag ref={wrapperRef} className={className} style={{ overflow: 'hidden', ...style }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="srv-word inline-block"
          style={{ marginRight: i < words.length - 1 ? '0.28em' : 0 }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
