'use client';
import { useEffect, useRef } from 'react';

// ── Shared coordinator: finds the closest magnetic element ────
const registry = new Map();
let nextId = 0;
let coordinatorAttached = false;

function onMouseMove(e) {
  let closestId = null;
  let closestDist = Infinity;
  let closestRect = null;

  for (const [id, entry] of registry) {
    if (!entry.alive) continue;
    const rect = entry.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < entry.radius && dist < closestDist) {
      closestDist = dist;
      closestId = id;
      closestRect = rect;
    }
  }

  for (const [id, entry] of registry) {
    if (!entry.alive) continue;
    if (id === closestId && closestRect) {
      const pull = (1 - closestDist / entry.radius) * entry.strength;
      entry.tx = (e.clientX - closestRect.left - closestRect.width / 2) * pull;
      entry.ty = (e.clientY - closestRect.top - closestRect.height / 2) * pull;
    } else {
      entry.tx = 0;
      entry.ty = 0;
    }
  }
}

// ── Hook ──────────────────────────────────────────────────────
export function useMagnetic(ref, { strength = 0.25, radius = 200, enabled = true } = {}) {
  const entryRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const id = nextId++;
    const entry = { el, strength, radius, tx: 0, ty: 0, cx: 0, cy: 0, alive: true };
    registry.set(id, entry);
    entryRef.current = entry;

    if (!coordinatorAttached) {
      coordinatorAttached = true;
      document.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    let frameId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      if (!entry.alive) return;
      entry.cx = lerp(entry.cx, entry.tx, 0.12);
      entry.cy = lerp(entry.cy, entry.ty, 0.12);

      if (Math.abs(entry.cx) > 0.01 || Math.abs(entry.cy) > 0.01) {
        el.style.transform = `translate(${entry.cx.toFixed(2)}px, ${entry.cy.toFixed(2)}px)`;
      } else if (el.style.transform) {
        el.style.transform = '';
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    const onLeave = () => {
      entry.tx = 0;
      entry.ty = 0;
    };
    el.addEventListener('mouseleave', onLeave);

    return () => {
      entry.alive = false;
      registry.delete(id);
      cancelAnimationFrame(frameId);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';

      if (registry.size === 0 && coordinatorAttached) {
        coordinatorAttached = false;
        document.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [ref, strength, radius, enabled]);
}

// ── Wrapper component for non-fixed elements ──────────────────
export default function Magnetic({ children, strength, radius, style, className }) {
  const ref = useRef(null);
  useMagnetic(ref, { strength, radius });

  return (
    <span ref={ref} style={{ display: 'inline-flex', ...style }} className={className}>
      {children}
    </span>
  );
}
