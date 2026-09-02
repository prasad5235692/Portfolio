'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  CURSOR_DEFAULT_SIZE,
  CURSOR_EXPANDED_SIZE,
  CURSOR_PROJECT_SIZE,
  CURSOR_LERP_FACTOR,
  getCursorScale,
} from './cursorConfig';
import styles from './GlobalCursor.module.css';

/*
 * GlobalCursor — single-element premium cursor (minhpham.design style)
 *
 * Architecture
 * ────────────
 * One 150 × 150 px circle (`cursor`) with a centered label span inside.
 * `overflow: hidden` + `border-radius: 50%` clips the label naturally,
 * so the text reveals itself as the circle scales up — no opacity trick,
 * no timing mismatch, no flicker.  Both scale and text visibility are
 * driven by ONE transform on ONE element (requirements 1-4, 6).
 *
 * Three expand sources
 * ────────────────────
 * • data-cursor-label  →  scale(1) = 150 px  + label text visible
 * • cursor:expand event (LayeredCursor / About clip-path sections)
 *                      →  scale(3.2) = 480 px, no label text
 * • cursor:project event (Projects section)
 *                      →  scale(1.33) = 200 px, "VIEW" text visible
 *
 * The sources never conflict in practice (different page regions).
 * Precedence guard: if a label is active, cursor:contract is ignored
 * until the pointer leaves the labelled element.
 */
export default function GlobalCursor() {
  const cursorRef = useRef(null);
  const labelRef  = useRef(null);
  const viewRef   = useRef(null);
  const moreRef   = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const view   = viewRef.current;
    const more   = moreRef.current;
    if (!cursor || !view || !more) return;

    // ── Mutable state ─────────────────────────────────────────────
    const mouse  = { x: -500, y: -500 };
    const lerped = { x: -500, y: -500 };
    let isCursorVisible = false;
    let expandedBy = null;   // null | 'label' | 'event' | 'project'
    let currentLabel = '';

    // ── Hide OS cursor ────────────────────────────────────────────
    document.body.style.cursor = 'none';

    // ── Initial GSAP state ────────────────────────────────────────
    gsap.set(cursor, {
      xPercent      : -50,
      yPercent      : -50,
      x             : -500,
      y             : -500,
      z             : 0,
      scale         : getCursorScale(CURSOR_DEFAULT_SIZE),
      opacity       : 0,
      transformOrigin: '50% 50%',
    });

    gsap.set([view, more], {
      opacity: 0,
      scale: 0.9,
    });

    // ── Helpers ───────────────────────────────────────────────────
    const EASE     = 'expo.out';
    const DURATION = 0.4;

    const setLabel = (text) => {
      currentLabel      = text;
      view.textContent  = text;
      more.textContent  = '';
    };

    const setViewMore = () => {
      view.textContent = 'VIEW';
      more.textContent = 'MORE';
    };

    /**
     * Expand to label mode: scale to full 150 px, reveal text.
     * The `.expanded` CSS class triggers the bonus text scale-in
     * (transform: scale(0.72 → 1)) in the SAME frame as GSAP scale.
     */
    const expandToLabel = (text) => {
      expandedBy = 'label';
      setLabel(text);
      cursor.classList.add(styles.expanded);
      gsap.to(cursor, {
        scale    : 1,
        duration : DURATION,
        ease     : EASE,
        overwrite: 'auto',
      });
      gsap.to(view, {
        opacity   : 1,
        scale     : 1,
        duration  : 0.35,
        ease      : 'power3.out',
        overwrite : 'auto',
      });
    };

    /**
     * Expand for clip-path sections (About / LayeredCursor).
     * Grows cursor to match the clip-path backdrop.  No label text.
     * Ignored when a labelled element has priority.
     */
    const expandToEvent = () => {
      if (expandedBy === 'label') return;
      if (expandedBy === 'project') return;
      expandedBy = 'event';
      cursor.classList.remove(styles.expanded);
      gsap.to([view, more], {
        opacity   : 0,
        scale     : 0.9,
        duration  : 0.2,
        overwrite : 'auto',
      });
      gsap.to(cursor, {
        scale    : getCursorScale(CURSOR_EXPANDED_SIZE),
        duration : DURATION,
        ease     : EASE,
        overwrite: 'auto',
      });
    };

    /**
     * Project mode — ~120 px cursor with "VIEW" / "MORE" text.
     * Used while the Projects section is in view.
     * Smooth 0.45s power3.out — animates scale only.
     */
    const expandToProject = () => {
      expandedBy = 'project';
      setViewMore();
      cursor.classList.add(styles.expanded);
      cursor.style.mixBlendMode = 'difference';
      gsap.to(cursor, {
        scale    : getCursorScale(CURSOR_PROJECT_SIZE),
        duration : 0.45,
        ease     : 'power3.out',
        overwrite: 'auto',
      });
      gsap.fromTo([view, more],
        { opacity: 0, scale: 0.9 },
        {
          opacity   : 1,
          scale     : 1,
          duration  : 0.35,
          ease      : 'power3.out',
          stagger   : 0.06,
          overwrite : 'auto',
        }
      );
    };

    /**
     * Contract back to dot.  `from` guards against cross-source conflicts:
     * a 'label' contract cannot dismiss an 'event' expand and vice-versa.
     */
    const contract = (from) => {
      if (from === 'project' && expandedBy !== 'project') return;
      if (from === 'event' && expandedBy === 'label') return;
      if (from === 'event' && expandedBy === 'project') return;
      if (from === 'label' && expandedBy !== 'label') return;

      const isProjectMode = expandedBy === 'project';
      const isLabelMode   = expandedBy === 'label';
      expandedBy = null;
      setLabel('');
      cursor.classList.remove(styles.expanded);

      if (isProjectMode) {
        gsap.to([view, more], {
          opacity   : 0,
          scale     : 0.9,
          duration  : 0.25,
          ease      : 'power3.out',
          overwrite : 'auto',
        });
      } else if (isLabelMode) {
        gsap.to(view, {
          opacity   : 0,
          scale     : 0.9,
          duration  : 0.2,
          ease      : 'power3.out',
          overwrite : 'auto',
        });
      }

      gsap.to(cursor, {
        scale    : getCursorScale(CURSOR_DEFAULT_SIZE),
        duration : isProjectMode ? 0.45 : DURATION,
        ease     : isProjectMode ? 'power3.out' : EASE,
        overwrite: 'auto',
      });
    };

    // ── Native-cursor detection ───────────────────────────────────
    const nativeSel = '[data-cursor="pointer"], button, a, [role="button"]';
    const isNative  = (el) => el instanceof Element && Boolean(el.closest(nativeSel));
    const syncBody  = (el) => { document.body.style.cursor = isNative(el) ? 'default' : 'none'; };

    const setVisible = (show) => {
      if (isCursorVisible === show) return;
      isCursorVisible = show;
      gsap.to(cursor, { opacity: show ? 1 : 0, duration: 0.2, overwrite: 'auto' });
    };

    // ── Mouse listeners ───────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (expandedBy === 'project') {
        document.body.style.cursor = 'none';
        if (!isCursorVisible) setVisible(true);
        return;
      }

      syncBody(e.target);
      setVisible(!isNative(e.target));

      // Detect data-cursor-label on the hovered element (or an ancestor).
      const labelEl  = (e.target instanceof Element) ? e.target.closest('[data-cursor-label]') : null;
      const newLabel = labelEl ? labelEl.dataset.cursorLabel : '';

      if (newLabel !== currentLabel) {
        if (newLabel) {
          expandToLabel(newLabel);
        } else {
          contract('label');
        }
      }
    };

    const onDocLeave  = () => { document.body.style.cursor = 'none'; setVisible(false); };
    const onDocEnter  = () => {
      const el = document.elementFromPoint(mouse.x, mouse.y);
      if (expandedBy === 'project') {
        document.body.style.cursor = 'none';
        return;
      }
      if (el) syncBody(el);
      setVisible(!isNative(el));
    };

    document.addEventListener('mousemove',  onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onDocLeave, { passive: true });
    document.addEventListener('mouseenter', onDocEnter, { passive: true });

    // ── cursor:expand / cursor:contract (clip-path sections) ──────
    const onExpand   = () => expandToEvent();
    const onContract = () => contract('event');

    window.addEventListener('cursor:expand',   onExpand);
    window.addEventListener('cursor:contract', onContract);

    // ── cursor:project / cursor:endProject (Projects section) ──────
    const onProject = () => expandToProject();
    const onEndProject = () => contract('project');

    window.addEventListener('cursor:project', onProject);
    window.addEventListener('cursor:endProject', onEndProject);

    // ── cursor:redOn / cursor:redOff (LayeredCursor section) ─────
    const onRedOn = () => {
      cursor.style.mixBlendMode = 'normal';
      gsap.to(cursor, { backgroundColor: '#e8190f', duration: 0.35, ease: EASE, overwrite: 'auto' });
    };
    const onRedOff = () => {
      gsap.to(cursor, {
        backgroundColor: '#ffffff',
        duration       : 0.35,
        ease           : EASE,
        overwrite      : 'auto',
        onComplete     : () => { cursor.style.mixBlendMode = 'difference'; },
      });
    };

    window.addEventListener('cursor:redOn',  onRedOn);
    window.addEventListener('cursor:redOff', onRedOff);

    // ── GSAP ticker — lerp position every frame ───────────────────
    gsap.ticker.lagSmoothing(0);

    const tick = () => {
      lerped.x += (mouse.x - lerped.x) * CURSOR_LERP_FACTOR;
      lerped.y += (mouse.y - lerped.y) * CURSOR_LERP_FACTOR;
      gsap.set(cursor, { x: lerped.x, y: lerped.y });
    };

    gsap.ticker.add(tick);

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mouseenter', onDocEnter);
      window.removeEventListener('cursor:expand',   onExpand);
      window.removeEventListener('cursor:contract', onContract);
      window.removeEventListener('cursor:project', onProject);
      window.removeEventListener('cursor:endProject', onEndProject);
      window.removeEventListener('cursor:redOn',  onRedOn);
      window.removeEventListener('cursor:redOff', onRedOff);
      gsap.ticker.remove(tick);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <span ref={labelRef} className={styles.label}>
        <span ref={viewRef} className={styles.view} />
        <span ref={moreRef} className={styles.more} />
      </span>
    </div>
  );
}
