'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * GSAP Preloader — "PRASAD K" → PK monogram → fade out → diagonal split
 *
 * Timeline (≈ 6.9 s total):
 *   0.15 s  Progress counter fades in
 *   0.20 s  Counter 00→100 + progress bar fill (2.33 s → ends 2.53 s)
 *   0.30 s  "RASAD" rises in (staggered letters)
 *   0.50 s  P flips from rotateY -90° → 0° (power4.out)
 *   0.68 s  K flips from rotateY +90° → 0° (power4.out, ends 1.68 s)
 *   [natural 0.85 s hold while counter reaches 100 — no explicit tl.to needed]
 *   2.53 s  tl.call → counter/bar dissolve, RASAD dissolves, P+K converge,
 *            PK logo + underline + tagline appear (longest sub-tween: 1.8 s)
 *   4.43 s  Hold — PK + "FULL STACK DEVELOPER" visible
 *   5.18 s  tl.call → tagline fades out, PK logo fades + scales down
 *   5.88 s  Content layer fades out + diagonal split begins
 *   6.98 s  onComplete → hero revealed, navbar appears
 */
export default function  Preloader({ onComplete }) {
  const containerRef    = useRef(null);
  const topPanelRef     = useRef(null);
  const bottomPanelRef  = useRef(null);
  const contentRef      = useRef(null);
  const letterPRef      = useRef(null);
  const midTextRef      = useRef(null);
  const letterKRef      = useRef(null);
  const logoRef         = useRef(null);
  const underlineRef    = useRef(null);
  const taglineRef      = useRef(null);
  const counterWrapRef  = useRef(null);
  const counterRef      = useRef(null);
  const progressBarRef  = useRef(null);
  const shimmerRef      = useRef(null);
  const particleRingRef = useRef(null);

  // Store callback in a ref so the effect never re-runs when the parent re-renders
  const onCompleteRef   = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    document.body.classList.add('no-scroll');

    // ── Initial GSAP states ──────────────────────────────────
    // FIX: gsap.set owns all transforms from the start — no inline CSS transform
    // on any animated element so GSAP never has to parse & merge with existing values.
    gsap.set(letterPRef.current, {
      opacity: 0,
      rotationY: -90,
      transformPerspective: 1200,   // perspective applied per-element (no parent CSS perspective)
      transformOrigin: 'center center',
    });
    gsap.set(letterKRef.current, {
      opacity: 0,
      rotationY: 90,
      transformPerspective: 1200,
      transformOrigin: 'center center',
    });
    gsap.set(midTextRef.current,     { opacity: 0 });
    gsap.set(midTextRef.current.children, { y: 28 });
    gsap.set(logoRef.current,        { opacity: 0, scale: 0.85 });
    gsap.set(underlineRef.current,   { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(taglineRef.current,     { opacity: 0, y: 12 });
    gsap.set(counterWrapRef.current, { opacity: 0 });
    gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

    // Object interpolated by the counter tween (avoids DOM thrash in onUpdate)
    const counterObj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('no-scroll');
        gsap.set(container, { display: 'none' });
        document.dispatchEvent(new Event('preloader-done'));
        onCompleteRef.current?.();
      },
    });

    // ── 0 · Counter + progress bar appear ───────────────────
    tl.to(counterWrapRef.current, { opacity: 1, duration: 0.3, ease: 'none' }, 0.15);

    // Counter counts 00 → 100 in sync with progress bar (both 2.33 s)
    // This naturally creates the 0.85 s "hold" on PRASAD K:
    //   K finishes at 0.68 + 1.0 = 1.68 s; counter ends at 0.2 + 2.33 = 2.53 s
    tl.to(counterObj, {
      val: 100,
      duration: 2.33,
      ease: 'power1.inOut',
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counterObj.val)).padStart(2, '0');
        }
      },
    }, 0.2);

    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 2.33,
      ease: 'power1.inOut',
    }, 0.2);

    // Subtle shimmer sweep across the progress bar
    tl.to(shimmerRef.current, {
      left: '125%',
      duration: 1.8,
      ease: 'sine.inOut',
    }, 0.25);

    // ── 1 · "RASAD" rises in (staggered letters) ────────────
    tl.to(midTextRef.current, { opacity: 1, duration: 0.01, ease: 'none' }, 0.3);
    tl.fromTo(midTextRef.current.children, {
      opacity: 0, y: 28,
    }, {
      opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: 'power3.out',
    }, 0.3);

    // ── 2 · P 3D flip from left (-90° → 0°) ─────────────────
    tl.to(letterPRef.current, {
      opacity: 1,
      rotationY: 0,
      duration: 1.0,
      ease: 'power4.out',
    }, 0.5);

    // ── 3 · K 3D flip from right (+90° → 0°) ────────────────
    tl.to(letterKRef.current, {
      opacity: 1,
      rotationY: 0,
      duration: 1.0,
      ease: 'power4.out',
    }, 0.68);

    // No explicit hold needed — the timeline's end advances to 2.53 s
    // because the counter/bar tweens (added at t=0.2, duration 2.33) are the
    // longest. K ends at 1.68 s, giving exactly 0.85 s of natural hold on
    // the full "PRASAD K" while the counter climbs to 100.

    // ── 4 · Converge P & K, reveal PK monogram ───────────────
    // tl.call fires at the current end of the timeline (2.53 s).
    // Sub-tweens are standalone but bounded by the buffer below.
    tl.call(() => {
      const p   = letterPRef.current;
      const k   = letterKRef.current;
      const mid = midTextRef.current;
      const logo = logoRef.current;
      const ul   = underlineRef.current;
      const tag  = taglineRef.current;
      const ctrW = counterWrapRef.current;
      const bar  = progressBarRef.current;
      if (!p || !k) return;

      const pR = p.getBoundingClientRect();
      const kR = k.getBoundingClientRect();
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;

      // Each letter converges to ±half-letter-width from screen centre
      const hw  = pR.width * 0.45;
      const pDx = cx - (pR.left + pR.width  / 2) - hw;
      const pDy = cy - (pR.top  + pR.height / 2);
      const kDx = cx - (kR.left + kR.width  / 2) + hw;
      const kDy = cy - (kR.top  + kR.height / 2);

      // Counter + bar dissolve as letters start moving
      gsap.to([ctrW, bar], { opacity: 0, duration: 0.3, ease: 'power2.in' });

      // Middle letters dissolve upward
      gsap.to(mid, { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' });

      // P and K glide toward each other
      gsap.to(p, { x: pDx, y: pDy, duration: 0.75, ease: 'power4.inOut', delay: 0.15 });
      gsap.to(k, { x: kDx, y: kDy, duration: 0.75, ease: 'power4.inOut', delay: 0.15 });

      // P and K fade out, then PK logo materialises
      gsap.to([p, k], { opacity: 0, duration: 0.22, delay: 0.72 });
      // Fully invisible at 0.72 + 0.22 = 0.94 s — logo starts at 0.97 s
      gsap.to(logo, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', delay: 0.97 });

      // Underline draws left → right
      gsap.to(ul, { scaleX: 1.1, duration: 0.5, ease: 'power3.inOut', delay: 1.1 });

      // Role tagline rises in below the monogram
      gsap.to(tag, { opacity: 0.55, y: 0, duration: 0.45, ease: 'power3.out', delay: 1.35 });
    });

    // Buffer covers all sub-tweens above.
    // Longest path: tagline delay 1.35 + duration 0.45 = 1.80 s → buffer 1.9 s
    tl.to({}, { duration: 1.9 });

    // ── 5 · Hold on PK monogram + tagline ────────────────────
    // Subtle breathing pulse on the logo during the hold
    tl.to(logoRef.current, { scale: 1.015, duration: 0.35, yoyo: true, repeat: 0, ease: 'sine.inOut' }, 4.43);
    tl.to({}, { duration: 0.75 });

    // ── 6 · Fade out tagline + PK logo ────────────────────────
    tl.call(() => {
      const logoEl = logoRef.current;
      const tagEl  = taglineRef.current;

      // Tagline fades up and out
      gsap.to(tagEl, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' });

      // PK logo fades out with a slight scale down
      gsap.to(logoEl, {
        opacity: 0,
        scale: 0.7,
        duration: 0.55,
        ease: 'power3.in',
        delay: 0.1,
      });
    });

    // Buffer covers the logo fade: 0.1 delay + 0.55 dur = 0.65 s → 0.7 s
    tl.to({}, { duration: 0.7 });

    // ── 7 · Content fade + diagonal split exit ───────────────
    // Content layer fades quickly so the flying logo doesn't "float" over
    // the retreating panels during the split.
    tl.to(contentRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' });
    tl.to(topPanelRef.current, {
      y: '-105%',
      x: '-8%',
      duration: 1.1,
      ease: 'power4.inOut',
    }, '<'); // same start as content fade
    tl.to(bottomPanelRef.current, {
      y: '105%',
      x: '8%',
      duration: 1.1,
      ease: 'power4.inOut',
    }, '<'); // same start

    return () => {
      // Kill the main timeline on unmount (covers Strict Mode double-invoke
      // and hot-reload). Sub-tweens from tl.call() will stop automatically
      // because the targets are gone or their values are already set.
      tl.kill();
      document.body.classList.remove('no-scroll');
    };
  }, []); // empty — onComplete is accessed via ref

  const letterStyle = {
    fontFamily:  'var(--font-inter)',
    fontSize:    'clamp(3.5rem, 9vw, 7.5rem)',
    fontWeight:  700,
    color:       '#000000',
    display:     'inline-block',
    lineHeight:  1,
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 100 }}
      aria-hidden="true"
    >
      {/* ── Top half panel ─────────────────────────────────── */}
      <div
        ref={topPanelRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '50%',
          background: '#ffffff',
          willChange: 'transform',
        }}
      />

      {/* ── Bottom half panel ──────────────────────────────── */}
      <div
        ref={bottomPanelRef}
        style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: '100%', height: '50%',
          background: '#ffffff',
          willChange: 'transform',
        }}
      />

      {/* ── Progress counter (bottom-left, above panels) ───── */}
      <div
        ref={counterWrapRef}
        style={{
          position: 'absolute',
          bottom: '2.25rem',
          left: '2.5rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.2rem',
          pointerEvents: 'none',
        }}
      >
        <span
          ref={counterRef}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize:   'clamp(2.25rem, 5.5vw, 3.75rem)',
            fontWeight: 700,
            color:      '#000000',
            lineHeight: 1,
            minWidth:   '3ch',
          }}
        >
          00
        </span>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize:   'clamp(0.9rem, 1.8vw, 1.35rem)',
            fontWeight: 400,
            color:      '#000000',
            opacity:    0.4,
            lineHeight: 1,
          }}
        >
          %
        </span>
      </div>

      {/* ── Progress bar (bottom edge, above panels) ────────── */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          width:      '100%',
          height:     '2px',
          background: 'rgba(0,0,0,0.1)',
          zIndex:     20,
          pointerEvents: 'none',
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            width:      '100%',
            height:     '100%',
            background: '#000000',
            position:   'relative',
            overflow:   'hidden',
          }}
        >
          <div
            ref={shimmerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: '-25%',
              width: '25%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
        </div>
      </div>

      {/* ── Content layer (above both panels) ──────────────── */}
      <div
        ref={contentRef}
        style={{
          position:        'absolute',
          inset:           0,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          zIndex:          10,
          pointerEvents:   'none',
        }}
      >
        {/* ── Letter row: P  RASAD  K ── */}
        {/* FIX: removed CSS `perspective` from this container.
            GSAP's transformPerspective on each letter is sufficient.
            Having both stacks two perspective transforms and distorts the flip. */}
        <div
          style={{
            display:     'flex',
            alignItems:  'center',
          }}
        >
          {/* P — 3D flip from left */}
          <span
            ref={letterPRef}
            style={{ ...letterStyle, transformStyle: 'preserve-3d' }}
          >
            P
          </span>

          {/* RASAD (middle letters) — staggered individually */}
          <span
            ref={midTextRef}
            style={{ ...letterStyle, letterSpacing: '-0.02em', display: 'inline-flex' }}
          >
            {'RASAD'.split('').map((ch, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{ch}</span>
            ))}
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          </span>

          {/* K — 3D flip from right */}
          <span
            ref={letterKRef}
            style={{ ...letterStyle, transformStyle: 'preserve-3d' }}
          >
            K
          </span>
        </div>

        {/* ── PK monogram logo (revealed in step 4, Flipped in step 6) ── */}
        <div
          ref={logoRef}
          style={{
            position:        'absolute',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                ...letterStyle,
                letterSpacing: '-0.04em',
                display:       'block',
              }}
            >
              PK
            </span>

            {/* Underline — draws left → right via gsap scaleX 0 → 1.
                FIX: no inline transform; gsap.set() owns the scaleX from init. */}
            <div
              ref={underlineRef}
              style={{
                position:   'absolute',
                bottom:     '-5px',
                left:       0,
                right:      0,
                height:     '3px',
                background: '#000000',
              }}
            />
          </div>
        </div>

        {/* ── Role tagline — appears under monogram in step 4 ── */}
        {/* Sibling of logoRef so it isn't included in the Flip target bounds */}
        <div
          style={{
            position:      'absolute',
            top:           'calc(50% + clamp(3rem, 5vw, 5rem))',
            left:          0,
            right:         0,
            display:       'flex',
            justifyContent:'center',
            pointerEvents: 'none',
          }}
        >
          <span
            ref={taglineRef}
            style={{
              fontFamily:    'var(--font-inter)',
              fontSize:      'clamp(0.5rem, 1.1vw, 0.75rem)',
              fontWeight:    400,
              letterSpacing: '0.38em',
              color:         '#000000',
              textTransform: 'uppercase',
              whiteSpace:    'nowrap',
            }}
          >
            Full Stack Developer
          </span>
        </div>

        {/* ── Particle ring (bursts outward on PK reveal) ───── */}
        <div ref={particleRingRef} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: 0, height: 0,
          pointerEvents: 'none',
          zIndex: 11,
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 5, height: 5,
              borderRadius: '50%',
              background: '#000',
              marginLeft: -2.5, marginTop: -2.5,
              opacity: 0,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
