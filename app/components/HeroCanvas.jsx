'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * HeroCanvas
 *
 * Full-bleed Three.js canvas that sits behind Hero content.
 * • 800 drifting particles — subtle grey, alpha canvas
 * • GSAP ticker drives the render loop (no manual rAF)
 * • Smooth mouse-parallax on camera position
 * • Pointer-events disabled — all cursor/hover logic passes through
 */
export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0); // fully transparent background
    mount.appendChild(renderer.domElement);

    // ── Particles ────────────────────────────────────────────────
    const PARTICLE_COUNT = 800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds    = new Float32Array(PARTICLE_COUNT);       // per-particle y-drift speed

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;     // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;     // z
      speeds[i]             = 0.002 + Math.random() * 0.003;  // drift speed
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // ── Circular sprite texture (canvas → radial gradient) ───────
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width  = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.PointsMaterial({
      color          : 0x888888,
      size           : 0.12,
      map            : spriteTexture,
      sizeAttenuation: true,
      transparent    : true,
      opacity        : 0,            // starts invisible; GSAP fades in
      depthWrite     : false,
      alphaTest      : 0.01,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Fade-in ──────────────────────────────────────────────────
    gsap.to(material, {
      opacity : 0.55,
      duration: 2.5,
      delay   : 1.2,
      ease    : 'power2.out',
    });

    // ── Mouse parallax ───────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── GSAP ticker ──────────────────────────────────────────────
    let elapsed = 0;
    const tick = (time, delta) => {
      elapsed += delta * 0.001; // convert ms → seconds

      // Slow global rotation
      points.rotation.y += 0.0004;
      points.rotation.x += 0.00015;

      // Per-particle y-drift (wrap around)
      const pos = geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos.array[i * 3 + 1] += speeds[i];
        if (pos.array[i * 3 + 1] > 11) pos.array[i * 3 + 1] = -11;
      }
      pos.needsUpdate = true;

      // Smooth camera parallax toward mouse
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    gsap.ticker.add(tick);

    // ── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ──────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ pointerEvents: 'none', borderRadius: '50%' }} // subtle rounded corners to match Hero container
      aria-hidden="true"
    />
  );
}
