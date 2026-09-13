'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const AUDIO_SRC = '/assets/image/moon/background-audio/audio.mp3';
const TARGET_VOLUME = 0.5;
// Settle delay lets the diagonal split finish + landing paint before audio starts
const SETTLE_DELAY = 500;

/**
 * BackgroundAudio — persistent looping background music + vertical ON/OFF toggle.
 *
 * - Mounted once (in page.js) so the same <audio> survives scroll navigation
 *   between sections without restarting.
 * - Explicit `landingVisible` gate: audio starts ONLY after the loading screen
 *   is completely finished AND the landing (#home) is actually visible.
 * - Native `loop` => continuous playback without interruption at track end.
 * - Toggle pauses/resumes (preserves currentTime) so state stays consistent
 *   across sections. Default ON.
 * - Autoplay policies: gesture unlock listeners attach on mount (not only after
 *   a failed play), plus a canplaythrough retry, so the first available user
 *   interaction starts audio while state remains ON.
 */
function SoundFlipLabel({ text }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group relative block h-[1.05rem] overflow-hidden whitespace-nowrap text-[12px] tracking-[0.34em]"
      style={{
        fontFamily: 'var(--font-inter)',
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
    >
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="block text-white/42"
        animate={
          isHovered
            ? { rotateX: -90, y: -18, opacity: 0 }
            : { rotateX: 0, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 100%' }}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 block text-white"
        animate={
          isHovered
            ? { rotateX: 0, y: 0, opacity: 1 }
            : { rotateX: 90, y: 18, opacity: 0 }
        }
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 0%' }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

function SoundActiveLabel({ text }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[1.05rem] items-center whitespace-nowrap text-[12px] tracking-[0.34em] text-white"
      style={{ fontFamily: 'var(--font-inter)', lineHeight: 1 }}
    >
      {text}
    </span>
  );
}

export default function BackgroundAudio({ active }) {
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const unlockFnRef = useRef(null);
  const unlockAttachedRef = useRef(false);
  const settleTimeoutRef = useRef(null);
  const observerRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);
  const [landingVisible, setLandingVisible] = useState(false);
  const [playbackPending, setPlaybackPending] = useState(false);

  const soundOnRef = useRef(true);
  const landingVisibleRef = useRef(false);
  const hasStartedRef = useRef(false);
  const playbackPendingRef = useRef(false);
  const primedPlaybackRef = useRef(false);
  const audibleStartedRef = useRef(false);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    landingVisibleRef.current = landingVisible;
  }, [landingVisible]);

  useEffect(() => {
    playbackPendingRef.current = playbackPending;
  }, [playbackPending]);

  const clearFade = useCallback(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (target, { pauseAtEnd = false } = {}) => {
      const audio = audioRef.current;
      if (!audio) return;
      clearFade();
      // If already at target, optionally pause and bail
      if (Math.abs(audio.volume - target) < 0.01) {
        audio.volume = target;
        if (pauseAtEnd && target === 0) {
          try {
            audio.pause();
          } catch {
            /* noop */
          }
        }
        return;
      }
      const step = target > audio.volume ? 0.05 : -0.08;
      fadeTimerRef.current = setInterval(() => {
        const a = audioRef.current;
        if (!a) {
          clearFade();
          return;
        }
        let next = a.volume + step;
        const reached =
          (step > 0 && next >= target) || (step < 0 && next <= target);
        if (reached) {
          next = target;
          a.volume = next;
          clearFade();
          if (pauseAtEnd && target === 0) {
            try {
              a.pause();
            } catch {
              /* noop */
            }
          }
          return;
        }
        a.volume = Math.min(1, Math.max(0, next));
      }, 40);
    },
    [clearFade],
  );

  const detachUnlock = useCallback(() => {
    if (typeof window === 'undefined') return;
    const fn = unlockFnRef.current;
    if (fn) {
      window.removeEventListener('pointerdown', fn);
      window.removeEventListener('touchstart', fn);
      window.removeEventListener('keydown', fn);
      window.removeEventListener('click', fn);
      unlockFnRef.current = null;
    }
    unlockAttachedRef.current = false;
  }, []);

  const attachUnlock = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (unlockAttachedRef.current) return;
    unlockAttachedRef.current = true;
    const unlock = () => {
      const audio = audioRef.current;
      if (
        hasStartedRef.current &&
        landingVisibleRef.current &&
        soundOnRef.current &&
        audio
      ) {
        try {
          if (primedPlaybackRef.current && !audio.paused) {
            if (!audibleStartedRef.current) {
              try {
                audio.currentTime = 0;
              } catch {
                /* noop */
              }
            }
            audio.muted = false;
            audibleStartedRef.current = true;
            setPlaybackPending(false);
            fadeTo(TARGET_VOLUME);
            detachUnlock();
            return;
          }

          audio.muted = false;
          audio.volume = 0;
          const p = audio.play();
          if (p && typeof p.then === 'function') {
            p.then(() => {
              if (landingVisibleRef.current && soundOnRef.current) {
                audibleStartedRef.current = true;
                primedPlaybackRef.current = false;
                setPlaybackPending(false);
                fadeTo(TARGET_VOLUME);
              }
              detachUnlock();
            }).catch(() => {
              audio.muted = true;
              setPlaybackPending(true);
              /* still blocked — keep waiting for next gesture */
            });
          } else {
            audibleStartedRef.current = true;
            primedPlaybackRef.current = false;
            setPlaybackPending(false);
            fadeTo(TARGET_VOLUME);
            detachUnlock();
          }
        } catch {
          audio.muted = true;
          setPlaybackPending(true);
          /* keep waiting */
        }
      } else if (
        audio &&
        !audio.paused &&
        soundOnRef.current &&
        landingVisibleRef.current &&
        !playbackPendingRef.current
      ) {
        detachUnlock();
      }
    };
    unlockFnRef.current = unlock;
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('click', unlock);
  }, [detachUnlock, fadeTo]);

  const primeMutedPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.loop = true;
    } catch {
      /* noop */
    }

    if (!audio.paused) {
      primedPlaybackRef.current = audio.muted || primedPlaybackRef.current;
      return;
    }

    try {
      audio.volume = 0;
      audio.muted = true;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          primedPlaybackRef.current = true;
          if (hasStartedRef.current && landingVisibleRef.current && soundOnRef.current) {
            try {
              audio.currentTime = 0;
            } catch {
              /* noop */
            }
            audio.muted = false;
            audibleStartedRef.current = true;
            setPlaybackPending(false);
            fadeTo(TARGET_VOLUME);
          }
        }).catch(() => {
          primedPlaybackRef.current = false;
          audio.muted = false;
          attachUnlock();
        });
      } else {
        primedPlaybackRef.current = true;
      }
    } catch {
      primedPlaybackRef.current = false;
      audio.muted = false;
      attachUnlock();
    }
  }, [attachUnlock, fadeTo]);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasStartedRef.current) return;
    if (!landingVisibleRef.current || !soundOnRef.current) return;

    try {
      audio.loop = true;
    } catch {
      /* noop */
    }

    if (primedPlaybackRef.current && !audio.paused) {
      if (!audibleStartedRef.current) {
        try {
          audio.currentTime = 0;
        } catch {
          /* noop */
        }
      }
      audio.muted = false;
      audibleStartedRef.current = true;
      setPlaybackPending(false);
      fadeTo(TARGET_VOLUME);
      detachUnlock();
      return;
    }

    if (!audio.paused) {
      audio.muted = false;
      audibleStartedRef.current = true;
      setPlaybackPending(false);
      fadeTo(TARGET_VOLUME);
      detachUnlock();
      return;
    }

    try {
      audio.muted = false;
      audio.volume = 0;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (landingVisibleRef.current && soundOnRef.current) {
            audibleStartedRef.current = true;
            primedPlaybackRef.current = false;
            setPlaybackPending(false);
            fadeTo(TARGET_VOLUME);
          }
          detachUnlock();
        }).catch(() => {
          audio.muted = true;
          setPlaybackPending(true);
          attachUnlock();
        });
      } else {
        audibleStartedRef.current = true;
        primedPlaybackRef.current = false;
        setPlaybackPending(false);
        fadeTo(TARGET_VOLUME);
        detachUnlock();
      }
    } catch {
      audio.muted = true;
      setPlaybackPending(true);
      attachUnlock();
    }
  }, [attachUnlock, detachUnlock, fadeTo]);

  const waitForAudioReady = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    try {
      if (audio.readyState >= 3) return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try {
          audio.removeEventListener('canplaythrough', finish);
        } catch {
          /* noop */
        }
        resolve();
      };
      try {
        audio.addEventListener('canplaythrough', finish, { once: true });
      } catch {
        resolve();
        return;
      }
      // Fallback so a slow network never blocks the gate forever
      setTimeout(finish, 2500);
      try {
        audio.load();
      } catch {
        /* noop */
      }
    });
  }, []);

  const isLandingActuallyVisible = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return false;
    // Loading screen must be completely gone
    try {
      if (document.body.classList.contains('no-scroll')) return false;
    } catch {
      /* noop */
    }
    if (document.visibilityState && document.visibilityState !== 'visible')
      return false;
    // Landing section must actually be in the viewport
    const home = document.getElementById('home');
    if (!home) return true; // no hero to observe — loader-gone is sufficient
    try {
      const r = home.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    } catch {
      return false;
    }
  }, []);

  const markLandingReady = useCallback(() => {
    if (hasStartedRef.current && landingVisibleRef.current) return;
    hasStartedRef.current = true;
    setLandingVisible(true);
  }, []);

  // Attach gesture unlock on mount so the first available user interaction
  // starts audio while state remains ON (covers autoplay-blocked fresh loads).
  useEffect(() => {
    attachUnlock();
    primeMutedPlayback();
    return () => {
      detachUnlock();
    };
  }, [attachUnlock, detachUnlock, primeMutedPlayback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncPlaybackState = () => {
      if (audio.paused) {
        if (soundOnRef.current && landingVisibleRef.current) {
          setPlaybackPending(true);
        }
        return;
      }

      if (audio.muted && !audibleStartedRef.current) {
        return;
      }

      audibleStartedRef.current = true;
      setPlaybackPending(false);
    };

    audio.addEventListener('play', syncPlaybackState);
    audio.addEventListener('pause', syncPlaybackState);
    audio.addEventListener('volumechange', syncPlaybackState);

    return () => {
      audio.removeEventListener('play', syncPlaybackState);
      audio.removeEventListener('pause', syncPlaybackState);
      audio.removeEventListener('volumechange', syncPlaybackState);
    };
  }, []);

  // Retry autoplay once buffered enough (large file may not be ready at landing).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onReady = () => {
      if (
        hasStartedRef.current &&
        landingVisibleRef.current &&
        soundOnRef.current &&
        audio.paused
      ) {
        attemptPlay();
      }
    };
    try {
      audio.addEventListener('canplaythrough', onReady);
    } catch {
      return undefined;
    }
    return () => {
      try {
        audio.removeEventListener('canplaythrough', onReady);
      } catch {
        /* noop */
      }
    };
  }, [attemptPlay]);

  // ── Explicit start signal: preloader-done event + active prop + settle ──
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return undefined;
    let cancelled = false;

    const clearSettle = () => {
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }
    };

    const observeHomeUntilVisible = () => {
      const home = document.getElementById('home');
      if (!home || typeof IntersectionObserver === 'undefined') return;
      try {
        if (observerRef.current) observerRef.current.disconnect();
      } catch {
        /* noop */
      }
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (cancelled) return;
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            waitForAudioReady().then(() => {
              if (!cancelled) markLandingReady();
            });
          }
        },
        { threshold: 0.2 },
      );
      try {
        observerRef.current.observe(home);
      } catch {
        /* noop */
      }
    };

    const runSettledCheck = () => {
      clearSettle();
      settleTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (cancelled) return;
            if (isLandingActuallyVisible()) {
              waitForAudioReady().then(() => {
                if (!cancelled) markLandingReady();
              });
            } else {
              // Loader finished but hero not yet in view — wait for it
              observeHomeUntilVisible();
            }
          }),
        );
      }, SETTLE_DELAY);
    };

    const onPreloaderDone = () => runSettledCheck();

    document.addEventListener('preloader-done', onPreloaderDone);
    // Fallback path: parent state flipped (covers event timing races)
    if (active) runSettledCheck();

    return () => {
      cancelled = true;
      clearSettle();
      document.removeEventListener('preloader-done', onPreloaderDone);
      try {
        if (observerRef.current) observerRef.current.disconnect();
      } catch {
        /* noop */
      }
      observerRef.current = null;
    };
  }, [active, isLandingActuallyVisible, markLandingReady, waitForAudioReady]);

  // React to confirmed landing visibility / toggle — play or pause only, never reload src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!landingVisible) {
      clearFade();
      audio.volume = 0;
      audio.muted = true;

      if (!primedPlaybackRef.current) {
        try {
          audio.pause();
        } catch {
          /* noop */
        }
      }

      return;
    }
    if (soundOn) {
      attemptPlay();
    } else {
      setPlaybackPending(false);
      if (!audio.paused) {
        // Smooth fade-out, then pause (preserves currentTime for seamless resume)
        fadeTo(0, { pauseAtEnd: true });
      }
    }
  }, [landingVisible, soundOn, attemptPlay, clearFade, fadeTo]);

  // Cleanup timers + gesture listeners on unmount
  useEffect(() => {
    return () => {
      clearFade();
      detachUnlock();
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
        settleTimeoutRef.current = null;
      }
      try {
        if (observerRef.current) observerRef.current.disconnect();
      } catch {
        /* noop */
      }
    };
  }, [clearFade, detachUnlock]);

  const handleToggle = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const fullLabel = soundOn ? 'Sound ON' : 'Sound OFF';

  return (
    <>
      {/* Single persistent element — loop keeps it playing without interruption */}
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" aria-hidden="true" />

      <style>{`
        .sound-toggle {
          --sound-gap: 3rem;
          position: fixed;
          right: 2rem;
          bottom: calc(2rem + 54px + var(--sound-gap));
          z-index: 50;
          width: 54px;
          height: 11rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .sound-toggle:focus-visible {
          outline: 1px solid rgba(255,255,255,0.35);
          outline-offset: 2px;
          border-radius: 4px;
        }
        .sound-toggle-rotate {
          rotate: -90deg;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          font-family: var(--font-inter);
          font-size: 13px;
          letter-spacing: 0.34em;
          text-indent: 0.34em;
          text-transform: uppercase;
          white-space: nowrap;
          line-height: 1;
        }
        .sound-static {
          color: #ffffff;
          line-height: 1;
          pointer-events: none;
        }
        @media (max-width: 1024px) {
          .sound-toggle {
            --sound-gap: 2.75rem;
            right: 2rem;
          }
        }
        @media (max-width: 480px) {
          .sound-toggle {
            --sound-gap: 2.5rem;
            right: 1rem;
            bottom: calc(1rem + 50px + var(--sound-gap));
            width: 50px;
          }
        }
      `}</style>

      <motion.button
        type="button"
        onClick={handleToggle}
        aria-pressed={soundOn}
        aria-label={
          soundOn
            ? playbackPending
              ? 'Sound will start on the next interaction if autoplay is blocked'
              : 'Turn sound off'
            : 'Turn sound on'
        }
        data-cursor="pointer"
        className="sound-toggle"
        initial={{ y: 12, opacity: 0 }}
        animate={{
          y: landingVisible ? 0 : 12,
          opacity: landingVisible ? 1 : 0,
        }}
        transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: landingVisible ? 'auto' : 'none' }}
      >
        <span className="sound-toggle-rotate">
          <span className="sr-only">{fullLabel}</span>
          <span className="sound-static" aria-hidden="true">
            Sound
          </span>
          {soundOn ? (
            <SoundActiveLabel text="ON" />
          ) : (
            <SoundFlipLabel text="ON" />
          )}
          {soundOn ? (
            <SoundFlipLabel text="OFF" />
          ) : (
            <SoundActiveLabel text="OFF" />
          )}
        </span>
      </motion.button>
    </>
  );
}
