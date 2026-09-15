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
 * - Explicit `landingVisible` gate: audio becomes audible ONLY after the
 *   loading screen is completely finished AND the landing (#home) is actually
 *   visible. It stays SILENT during the preloader.
 * - Native `loop` => continuous playback without interruption at track end.
 * - Toggle pauses/resumes (preserves currentTime) so state stays consistent
 *   across sections. Default ON.
 *
 * ONE normal automatic playback path (no competing play() calls):
 *   Phase 1 (preloader): the <audio> is rendered ALREADY muted (+ autoPlay),
 *     so the browser's native muted autoplay starts silent playback on its
 *     own. JS only enforces the silent state (muted=true, volume=0). If the
 *     native autoplay has not started, ONE guarded ensureMutedPlayback()
 *     issues the single muted play() — never while another is in flight.
 *   Phase 2 (landing): the already-playing element is ONLY unmuted + faded
 *     to TARGET_VOLUME via goAudible(). No play() call, no currentTime
 *     reset, no audio.load() on this transition.
 *   Fallback only: keyboard/click/touch unlock listeners + a canplay
 *     re-prime (muted, silent) for browsers/networks where even muted
 *     playback was blocked. They must NOT be the normal fresh-load path.
 *
 * TEMPORARY diagnostics: AUDIO_DEBUG + dlog() trace mount / play() resolve /
 * reject / preloader-done / landing-ready / goAudible / pause / error so a
 * fresh-load failure can be pinpointed. Delete the block and all dlog calls
 * once automatic playback is confirmed.
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
  const primedPlaybackRef = useRef(false);
  const primeInflightRef = useRef(false);
  const audibleStartedRef = useRef(false);
  const landingRetryTimeoutsRef = useRef([]);

  // TEMPORARY development diagnostics — delete this block and every dlog()
  // call below once automatic fresh-load playback is confirmed in-browser.
  const AUDIO_DEBUG = true;
  const dlog = useCallback(
    (phase) => {
      if (!AUDIO_DEBUG) return;
      const audio = audioRef.current;
      try {
        console.log('[BackgroundAudio]', {
          phase,
          paused: audio ? audio.paused : 'no-el',
          muted: audio ? audio.muted : 'no-el',
          volume: audio ? audio.volume : 'no-el',
          readyState: audio ? audio.readyState : 'no-el',
          currentTime: audio ? audio.currentTime : 'no-el',
          error: audio && audio.error ? audio.error.code : null,
          landingVisible: landingVisibleRef.current,
          hasStarted: hasStartedRef.current,
          primed: primedPlaybackRef.current,
          primeInflight: primeInflightRef.current,
        });
      } catch {
        /* logging must never break playback */
      }
    },
    [AUDIO_DEBUG],
  );

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    landingVisibleRef.current = landingVisible;
  }, [landingVisible]);

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

  const clearLandingRetries = useCallback(() => {
    const list = landingRetryTimeoutsRef.current;
    landingRetryTimeoutsRef.current = [];
    list.forEach((t) => {
      try {
        clearTimeout(t);
      } catch {
        /* noop */
      }
    });
  }, []);

  // Central landing transition: the element is ALREADY playing (muted) from
  // the preloader phase — so this NEVER calls play(). Unmuting an
  // already-playing element requires no user gesture. Just unmute + fade
  // to the existing target volume. currentTime is preserved so the same
  // audio instance continues seamlessly.
  const goAudible = useCallback(
    (reason) => {
      const audio = audioRef.current;
      if (!audio) return;
      dlog(`goAudible:${reason}:before`);
      try {
        audio.muted = false;
      } catch {
        /* noop */
      }
      audibleStartedRef.current = true;
      primedPlaybackRef.current = false;
      setPlaybackPending(false);
      fadeTo(TARGET_VOLUME);
      detachUnlock();
      clearLandingRetries();
      dlog(`goAudible:${reason}:after`);
    },
    [clearLandingRetries, detachUnlock, dlog, fadeTo],
  );

  const attachUnlock = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (unlockAttachedRef.current) return;
    unlockAttachedRef.current = true;
    const unlock = () => {
      const audio = audioRef.current;
      if (!audio) return;
      // Fallback only: the automatic landing transition (goAudible) is the
      // normal path. This runs solely if even muted playback was blocked.
      dlog('unlock:gesture-fired');
      if (
        !hasStartedRef.current ||
        !landingVisibleRef.current ||
        !soundOnRef.current
      ) {
        dlog('unlock:ignored-pre-landing');
        return;
      }
      if (!audio.paused) {
        // Already playing (muted phase survived) — unmute + fade, no play()
        // call, and preserve currentTime (no restart of the instance).
        goAudible('unlock');
        return;
      }
      // Element is paused (muted playback was blocked) — a muted play() here
      // runs inside a real user gesture; unmute only after it resolves.
      try {
        audio.loop = true;
        audio.volume = 0;
        audio.muted = true;
        dlog('unlock:reprime-play-call');
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            dlog('unlock:reprime-play-resolved');
            if (landingVisibleRef.current && soundOnRef.current) {
              goAudible('unlock-reprime');
            } else {
              detachUnlock();
            }
          }).catch((err) => {
            dlog(`unlock:reprime-play-rejected:${err && err.name ? err.name : err}`);
            try {
              audio.muted = true;
              audio.volume = 0;
            } catch {
              /* noop */
            }
            setPlaybackPending(true);
            /* still blocked — keep waiting for next gesture */
          });
        } else if (landingVisibleRef.current && soundOnRef.current) {
          goAudible('unlock-reprime-sync');
        } else {
          detachUnlock();
        }
      } catch {
        dlog('unlock:reprime-play-threw');
        try {
          audio.muted = true;
          audio.volume = 0;
        } catch {
          /* noop */
        }
        setPlaybackPending(true);
        /* keep waiting */
      }
    };
    unlockFnRef.current = unlock;
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('touchstart', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('click', unlock);
  }, [detachUnlock, dlog, goAudible]);

  // THE single function that guarantees muted (silent, gesture-free) playback.
  // Native muted autoplay (muted + autoPlay attributes) is the initiator and
  // is always given the chance to start first: if the element is already
  // playing, this is a no-op mark. Otherwise it issues the ONE muted play()
  // — never while another is in flight, never after a pause/load, and never
  // unmuting. No competing play() calls can exist: mount, canplay re-prime
  // and the landing re-prime all funnel through here.
  const ensureMutedPlayback = useCallback(
    (reason) => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        audio.loop = true;
      } catch {
        /* noop */
      }

      // Already playing (native muted autoPlay beat us to it, or a previous
      // ensure succeeded): mark primed, never play() again here.
      if (!audio.paused || primedPlaybackRef.current) {
        primedPlaybackRef.current = true;
        dlog(`ensure:${reason}:already-playing`);
        return;
      }
      // A muted play() attempt is already in flight — never stack play()
      // calls while the first promise is pending.
      if (primeInflightRef.current) {
        dlog(`ensure:${reason}:inflight-skip`);
        return;
      }
      primeInflightRef.current = true;

      try {
        audio.volume = 0;
        audio.muted = true;
        try {
          audio.defaultMuted = true;
        } catch {
          /* noop */
        }
        dlog(`ensure:${reason}:play-call`);
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            primeInflightRef.current = false;
            primedPlaybackRef.current = true;
            dlog(`ensure:${reason}:play-resolved`);
            // Slow-network edge: muted playback began only after landing
            // already became visible — transition automatically (unmute +
            // fade). Preserve currentTime: no restart of the instance.
            if (
              hasStartedRef.current &&
              landingVisibleRef.current &&
              soundOnRef.current
            ) {
              goAudible('late-resolve');
            }
          }).catch((err) => {
            primeInflightRef.current = false;
            primedPlaybackRef.current = false;
            dlog(
              `ensure:${reason}:play-rejected:${err && err.name ? err.name : err}`,
            );
            // Stay silent — keep muted so a later muted re-prime can still
            // succeed without a user gesture.
            try {
              audio.muted = true;
              audio.volume = 0;
            } catch {
              /* noop */
            }
            attachUnlock();
          });
        } else {
          primeInflightRef.current = false;
          primedPlaybackRef.current = true;
          dlog(`ensure:${reason}:play-sync`);
          if (
            hasStartedRef.current &&
            landingVisibleRef.current &&
            soundOnRef.current
          ) {
            goAudible('late-resolve-sync');
          }
        }
      } catch {
        primeInflightRef.current = false;
        primedPlaybackRef.current = false;
        dlog(`ensure:${reason}:play-threw`);
        try {
          audio.muted = true;
          audio.volume = 0;
        } catch {
          /* noop */
        }
        attachUnlock();
      }
    },
    [attachUnlock, dlog, goAudible],
  );

  // Landing transition — automatic, no gesture needed.
  // The element has been playing (muted, volume 0) since the preloader, so
  // the normal path ONLY unmutes + fades the existing instance. There is
  // deliberately NO play() call on this tick: re-calling play() re-enters
  // the browser autoplay check and can reject, forcing a gesture fallback.
  // Bounded automatic retries of the SAME muted ensure (same path, no
  // gesture): covers policies where muted play() is rejected early but
  // allowed seconds later with no interaction. Stops once audible.
  const scheduleLandingRetries = useCallback(() => {
    clearLandingRetries();
    [1500, 3000, 6000].forEach((ms, i) => {
      try {
        landingRetryTimeoutsRef.current.push(
          setTimeout(() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (audibleStartedRef.current) return;
            if (
              !hasStartedRef.current ||
              !landingVisibleRef.current ||
              !soundOnRef.current
            )
              return;
            if (
              !audio.paused ||
              primedPlaybackRef.current ||
              primeInflightRef.current
            )
              return;
            dlog(`landing-retry:${i + 1}`);
            ensureMutedPlayback(`landing-retry-${i + 1}`);
          }, ms),
        );
      } catch {
        /* noop */
      }
    });
  }, [clearLandingRetries, dlog, ensureMutedPlayback]);

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

    dlog('attemptPlay:landing-transition');
    if (!audio.paused) {
      // Already-playing muted phase: just unmute + fade. Same instance,
      // same currentTime — no restart, no gesture.
      goAudible('landing');
      return;
    }

    // Muted phase didn't survive (blocked/stalled): a muted re-prime needs
    // no gesture; it auto-unmutes via goAudible when it resolves. Unlock
    // listeners remain attached as fallback if even muted playback is
    // blocked.
    setPlaybackPending(true);
    ensureMutedPlayback('landing-reprime');
    scheduleLandingRetries();
  }, [dlog, ensureMutedPlayback, goAudible, scheduleLandingRetries]);

  // NOTE: landing visibility is a DOM fact and is deliberately NOT gated on
  // audio buffering. If the element is already playing (muted), unmuting +
  // fading immediately is correct even while stalled — the fade completes
  // and the track is audible at TARGET_VOLUME as soon as data arrives.
  // Gating landing on canplaythrough would delay the automatic transition
  // (up to seconds on slow networks) and let a user gesture win the race,
  // making the fallback look like the normal path. Buffering retries are
  // owned by the canplay re-prime effect below — never by the landing gate.

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
    dlog('landing:ready-marked');
    setLandingVisible(true);
  }, [dlog]);

  // Mount: enforce the silent preloader state, attach the fallback unlock
  // listeners, then let native muted autoplay win — only ensure (ONE muted
  // play()) if the element is still paused.
  useEffect(() => {
    dlog('mount');
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.loop = true;
        audio.volume = 0;
        audio.muted = true;
        audio.defaultMuted = true;
      } catch {
        /* noop */
      }
    }
    attachUnlock();
    if (audio && !audio.paused) {
      primedPlaybackRef.current = true;
      dlog('mount:native-autoplay-active');
    } else {
      dlog('mount:native-not-playing');
      ensureMutedPlayback('mount');
    }
    return () => {
      detachUnlock();
    };
  }, [attachUnlock, detachUnlock, dlog, ensureMutedPlayback]);

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

    const onPlayEvt = () => {
      dlog('event:play');
      syncPlaybackState();
    };
    const onPauseEvt = () => {
      dlog('event:pause');
      syncPlaybackState();
    };
    const onErrorEvt = () => {
      dlog('event:error');
    };

    audio.addEventListener('play', onPlayEvt);
    audio.addEventListener('pause', onPauseEvt);
    audio.addEventListener('volumechange', syncPlaybackState);
    audio.addEventListener('error', onErrorEvt);

    return () => {
      audio.removeEventListener('play', onPlayEvt);
      audio.removeEventListener('pause', onPauseEvt);
      audio.removeEventListener('volumechange', syncPlaybackState);
      audio.removeEventListener('error', onErrorEvt);
    };
  }, [dlog]);

  // Buffering safety net: funnel through the single ensureMutedPlayback()
  // when the element is found paused — both while still in the preloader
  // (so a slow network can't leave it paused before landing) and after
  // landing (the ensure auto-unmutes via goAudible on success). Never
  // unmutes here. Skipped once audible, and skipped when the user toggled
  // sound OFF so we never revive audio the user silenced.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onReady = () => {
      if (!soundOnRef.current) return;
      if (audibleStartedRef.current) return;
      if (audio.paused && !primedPlaybackRef.current) {
        dlog('canplay:reprime-check');
        ensureMutedPlayback('canplay');
      }
    };
    try {
      audio.addEventListener('canplay', onReady);
      audio.addEventListener('canplaythrough', onReady);
    } catch {
      return undefined;
    }
    return () => {
      try {
        audio.removeEventListener('canplay', onReady);
        audio.removeEventListener('canplaythrough', onReady);
      } catch {
        /* noop */
      }
    };
  }, [dlog, ensureMutedPlayback]);

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
          // Landing visibility is a DOM fact — mark ready immediately so the
          // automatic unmute+fade is never delayed behind audio buffering.
          if (entry && entry.isIntersecting) {
            dlog('signal:observer-home-visible');
            markLandingReady();
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
      // Already started — ignore duplicate preloader-done/active triggers.
      if (hasStartedRef.current) return;
      clearSettle();
      settleTimeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (cancelled) return;
            if (isLandingActuallyVisible()) {
              // Mark ready immediately — no audio-buffering gate, so the
              // automatic unmute+fade fires on time without any gesture.
              dlog('signal:settle-landing-visible');
              markLandingReady();
            } else {
              // Loader finished but hero not yet in view — wait for it
              dlog('signal:settle-waiting-observer');
              observeHomeUntilVisible();
            }
          }),
        );
      }, SETTLE_DELAY);
    };

    const onPreloaderDone = () => {
      dlog('signal:preloader-done');
      runSettledCheck();
    };

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
  }, [active, dlog, isLandingActuallyVisible, markLandingReady]);

  // React to confirmed landing visibility / toggle — unmute/fade or
  // fade-out only, never reload src.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!landingVisible) {
      // Preloader phase: the muted phase owns playback. Enforce silence
      // here but NEVER pause and NEVER call play() from this effect —
      // pausing aborts the gesture-free muted playback, and a second
      // concurrent play() would abort the in-flight one. The single muted
      // play() (if needed at all) is owned solely by ensureMutedPlayback().
      clearFade();
      try {
        audio.volume = 0;
        audio.muted = true;
      } catch {
        /* noop */
      }
      dlog('phase:preloader-silent-enforced');
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
  }, [landingVisible, soundOn, attemptPlay, clearFade, dlog, fadeTo]);

  // Cleanup timers + gesture listeners on unmount
  useEffect(() => {
    return () => {
      clearFade();
      detachUnlock();
      clearLandingRetries();
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
  }, [clearFade, clearLandingRetries, detachUnlock]);

  const handleToggle = useCallback(() => {
    setSoundOn((prev) => !prev);
  }, []);

  const fullLabel = soundOn ? 'Sound ON' : 'Sound OFF';

  return (
    <>
      {/* Single persistent element — loop keeps it playing without interruption.
          Rendered ALREADY muted (+ autoPlay): the browser starts silent
          playback on its own during the preloader, no gesture needed. JS
          only enforces the muted prime, then unmutes + fades at landing. */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      />

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
