'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MarqueeText({ text = '', speed = 30 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate content so the loop is seamless
    const clone = track.firstElementChild?.cloneNode(true);
    if (clone) track.appendChild(clone);

    const totalWidth = track.firstElementChild?.offsetWidth ?? 0;
    if (totalWidth === 0) return;

    const duration = totalWidth / speed;

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -totalWidth,
        duration,
        ease: 'none',
        repeat: -1,
      }
    );

    return () => {
      tween.kill();
      if (clone && track.contains(clone)) track.removeChild(clone);
    };
  }, [text, speed]);

  return (
    <div
      className="w-full overflow-hidden border-t border-white/10 py-3"
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <span className="pr-16 text-[10px] tracking-[0.4em] uppercase text-white/40">
          {text}&nbsp;&nbsp;—&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
