'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    let tickFn = null;

    const startLenis = () => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: 0.08,
        wheelMultiplier: 0.4,
        touchMultiplier: 0.4,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      tickFn = (time) => {
        try { lenis.raf(time * 1000); } catch (e) { console.warn('Lenis raf error:', e); }
      };
      gsap.ticker.add(tickFn);
      gsap.ticker.lagSmoothing(0);
    };

    const onReady = () => startLenis();
    document.addEventListener('preloader-done', onReady, { once: true });

    // Fallback: if preloader never fires (e.g. dev hot-reload), start after 8s
    const fallbackTimer = setTimeout(() => {
      if (!lenisRef.current) startLenis();
    }, 10000);

    return () => {
      document.removeEventListener('preloader-done', onReady);
      clearTimeout(fallbackTimer);
      if (tickFn) gsap.ticker.remove(tickFn);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return <>{children}</>;
}
