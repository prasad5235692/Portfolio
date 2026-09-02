'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  CURSOR_LERP_FACTOR,
} from '../cursorConfig';
import styles from './LayeredCursor.module.css';

/**
 * LayeredCursor
 *
 * Renders two stacked text layers. A circular clip-path (synced to the
 * GlobalCursor red circle) reveals Layer B beneath Layer A on word hover.
 *
 * - No cursor div here; the red circle is owned by GlobalCursor (layout.js)
 * - Dispatches `cursor:expand` / `cursor:contract` custom window events so
 *   GlobalCursor can animate its scale in sync with clip.r
 * - Own GSAP lerp keeps clip-path in sync with GlobalCursor
 *
 * @param {{ lines: Array<Array<{ text: string; alt: string }>> }} props
 */
export default function LayeredCursor({ lines }) {
  const layerARef = useRef(null);
  const layerBRef = useRef(null);
  const sceneRef  = useRef(null);

  useEffect(() => {
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    const scene  = sceneRef.current;
    if (!layerA || !layerB || !scene) return;

    // ── Mutable state ────────────────────────────────────────────
    const mouse  = { x: -500, y: -500 };
    const lerped = { x: -500, y: -500 };
    // Clip radius matches the GlobalCursor's visual radius.
    const clip   = { r: 0 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    document.addEventListener('mousemove', onMouseMove);

    // ── Scene hover — single enter/leave on the whole block ────
    // Listening on the scene container (not per-word) so cursor does
    // not flicker when the pointer crosses the gap between rows.

    const onWordEnter = () => {
      window.dispatchEvent(new CustomEvent('cursor:redOn'));
      gsap.to(layerA, { opacity: 0, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
      gsap.to(clip, {
        r        : 9999,
        duration : 0.4,
        ease     : 'expo.out',
        overwrite: 'auto',
      });
    };

    const onWordLeave = () => {
      window.dispatchEvent(new CustomEvent('cursor:redOff'));
      gsap.to(layerA, { opacity: 1, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
      gsap.to(clip, {
        r        : 0,
        duration : 0.4,
        ease     : 'expo.out',
        overwrite: 'auto',
      });
    };

    scene.addEventListener('mouseenter', onWordEnter);
    scene.addEventListener('mouseleave', onWordLeave);

    // ── GSAP ticker — lerp clip center, update clip-path ─────────
    const tick = () => {
      lerped.x += (mouse.x - lerped.x) * CURSOR_LERP_FACTOR;
      lerped.y += (mouse.y - lerped.y) * CURSOR_LERP_FACTOR;

      const rect = layerB.getBoundingClientRect();
      const rx   = lerped.x - rect.left;
      const ry   = lerped.y - rect.top;
      layerB.style.clipPath = `circle(${clip.r}px at ${rx}px ${ry}px)`;
    };

    gsap.ticker.add(tick);

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      scene.removeEventListener('mouseenter', onWordEnter);
      scene.removeEventListener('mouseleave', onWordLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.scene}>

      {/* Layer A — white text with page background, interactive word spans */}
      <div ref={layerARef} className={styles.layerA}>
        {lines.map((line, li) => (
          <div key={li} className={styles.line}>
            {line.map((word, wi) => (
              <span
                key={wi}
                className={`${styles.text} ${styles.word}`}
                data-alt={word.alt}
              >
                {word.text}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Layer B — transparent bg, black text, revealed by clip-path circle */}
      <div
        ref={layerBRef}
        className={styles.layerB}
        aria-hidden="true"
      >
        {lines.map((line, li) => (
          <div key={li} className={styles.line}>
            {line.map((word, wi) => (
              <span key={wi} className={styles.text}>
                {word.alt}
              </span>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
