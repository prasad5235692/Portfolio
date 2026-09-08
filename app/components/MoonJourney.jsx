'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MOON_TEXTURES = {
  color: '/assets/image/moon/moon_color_16k.png',
  normal: '/assets/image/moon/moon_normal_16k.png',
  displacement: '/assets/image/moon/moon_disp_16k.png',
  ao: '/assets/image/moon/moon_ao_16k.png',
  roughness: '/assets/image/moon/moon_roughness_16k.png',
};

// ═══════════════════════════════════════════════════════════════════════
// OPTIMIZED LUNAR SHADER
//  • NASA textures drive all surface detail (color, normal, disp, AO)
//  • Minimal procedural dust — single 2-octave fbm2, no loops/branches
//  • NO ridged FBM, NO domain warp, NO crater loops, NO rock/pebble gen
//  • NO detail-level branching — same path for all zoom levels
//  • ~95% reduction in shader instructions vs. original
// ═══════════════════════════════════════════════════════════════════════

const VERTEX_NOISE_GLSL = `
uniform sampler2D uMoonDetailMap;

float lunarHeight(vec2 uv) {
  return texture2D(uMoonDetailMap, uv).r;
}
`;

const FRAGMENT_NOISE_GLSL = `
uniform sampler2D uMoonDetailMap;
uniform sampler2D uMoonAOMap;

float hash21(vec2 p) {
  p = fract(p * vec2(443.8975, 397.2973));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm2(vec2 p) {
  float v = 0.0, a = 0.5, ampSum = 0.0;
  for (int i = 0; i < 2; i++) {
    v += a * vnoise(p);
    ampSum += a;
    p = p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v / ampSum;
}

float lunarHeight(vec2 uv) {
  return texture2D(uMoonDetailMap, uv).r;
}
`;

const VERTEX_DISPLACEMENT = `
#ifdef USE_DISPLACEMENTMAP
  float lh = lunarHeight(uv);
  transformed += normalize(objectNormal) * (lh * displacementScale + displacementBias);
#endif
`;

const LUNAR_FRAGMENT = `
{
  vec4 colorTex = texture2D(map, vMapUv);
  vec3 baseColor = colorTex.rgb;

  float h = lunarHeight(vMapUv);
  vec2 dh = vec2(dFdx(h), dFdy(h));
  float slope = length(dh);

  float dust = fbm2(vMapUv * 40.0) * 0.006;
  float albedoVar = fbm2(vMapUv * 8.0) * 0.010;

  float slopeDark = 1.0 - slope * 0.20;
  float heightDark = 0.92 + h * 0.08;

  float ao = texture2D(uMoonAOMap, vMapUv).r;

  vec3 surface = baseColor;
  surface += albedoVar + dust;
  surface *= slopeDark;
  surface *= heightDark;
  surface = mix(surface, surface * 0.96, (1.0 - ao) * 0.5);

  diffuseColor.rgb = clamp(surface, 0.0, 1.0);
}
`;

// ═══════════════════════════════════════════════════════════════════════

export default function MoonJourney() {
  const mountRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mount = mountRef.current;
    if (!mount) return;

    // ── Device detection ──────────────────────────────────────────────────────
    const isMobile = typeof navigator !== 'undefined' &&
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isLowEnd = isMobile ||
      (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4);

    // ── Scale multiplier — slightly smaller moon on tablet / mobile ───────────
    const vw = window.innerWidth;
    const moonScaleMul = vw >= 1025 ? 1.0 : vw >= 768 ? 0.85 : 0.75;

    // ── Renderer — optimized settings ─────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = false;
    Object.assign(renderer.domElement.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block',
    });
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      1200,
    );
    camera.position.set(0, 0.1, 4.45);
    camera.lookAt(0, 0, 0);

    // ── Stars ────────────────────────────────────────────────────────────────
    const starPositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 220 + Math.random() * 180;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starPositions, 3),
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ── Moon textures — mipmapped with device-adaptive anisotropy ─────────────
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const useAnisotropy = isMobile
      ? Math.min(maxAnisotropy, 2)
      : Math.min(maxAnisotropy, 4);

    const loadTexture = (path) => {
      const tex = textureLoader.load(path);
      tex.anisotropy = useAnisotropy;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const moonColorTexture = loadTexture(MOON_TEXTURES.color);
    const moonNormalTexture = loadTexture(MOON_TEXTURES.normal);
    const moonDispTexture = loadTexture(MOON_TEXTURES.displacement);
    const moonAOTexture = loadTexture(MOON_TEXTURES.ao);
    const moonRoughnessTexture = loadTexture(MOON_TEXTURES.roughness);
    moonColorTexture.colorSpace = THREE.SRGBColorSpace;

    // ── Moon geometry — adaptive resolution ───────────────────────────────────
    const segments = isMobile ? 96 : isLowEnd ? 128 : 256;
    const planetGeometry = new THREE.SphereGeometry(1.28, segments, segments);
    planetGeometry.setAttribute('uv2', planetGeometry.attributes.uv.clone());

    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: moonColorTexture,
      normalMap: moonNormalTexture,
      normalScale: new THREE.Vector2(1.0, 1.0),
      displacementMap: moonDispTexture,
      displacementScale: 0.02,
      displacementBias: -0.01,
      aoMap: moonAOTexture,
      aoMapIntensity: 1.0,
      roughnessMap: moonRoughnessTexture,
      roughness: 1.0,
      metalness: 0.0,
    });

    // ── Shader injection — NASA-driven, ~95% fewer instructions ──────────────
    planetMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uMoonDetailMap = { value: moonDispTexture };
      shader.uniforms.uMoonAOMap = { value: moonAOTexture };

      shader.vertexShader = VERTEX_NOISE_GLSL + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <displacementmap_vertex>',
        VERTEX_DISPLACEMENT,
      );

      shader.fragmentShader = FRAGMENT_NOISE_GLSL + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        LUNAR_FRAGMENT,
      );
    };
    planetMaterial.customProgramCacheKey = () => 'moon-nasa-v4';

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.rotation.x = THREE.MathUtils.degToRad(10);
    planet.rotation.z = THREE.MathUtils.degToRad(5);
    scene.add(planet);

    // ── Lighting — single Sun, no shadow pass ────────────────────────────────
    const keyLight = new THREE.DirectionalLight(0xf5f7ff, 2.6);
    keyLight.position.set(-3.4, 1.3, 3.3);
    keyLight.target.position.set(0, 0, 0);
    scene.add(keyLight, keyLight.target);

    // ── State object (GSAP tweens these properties) ──────────────────────────
    const state = {
      scale: 0.47 * moonScaleMul,
      posX: 0,
      lightX: -3.4,
      lightY: 1.3,
      lightZ: 3.3,
      rotY: 0,
      opacity: 1.0,
    };

    // ── Resize ────────────────────────────────────────────────────────────────
    const resizeRenderer = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    // ── Half-viewport width helper ────────────────────────────────────────────
    const getHalfWidth = () =>
      Math.tan(THREE.MathUtils.degToRad(19)) * 4.45 * camera.aspect;

    let hw = getHalfWidth();

    const ctx = gsap.context(() => {
      // Continuous slow auto-rotation
      gsap.to(state, {
        rotY: Math.PI * 200,
        duration: 2400,
        ease: 'none',
        repeat: -1,
      });

      // ── Phase 2 — Hero → About: zoom in, drift right ─────────────────────────
      gsap.fromTo(
        state,
        {
          scale: 0.47 * moonScaleMul,
          posX: 0,
          lightX: -3.4,
          lightY: 1.3,
          lightZ: 3.3,
        },
        {
          scale: 1.14 * moonScaleMul,
          posX: hw * 0.88,
          lightX: -3.9,
          lightY: 1.5,
          lightZ: 3.0,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'top 20%',
            scrub: 1.8,
          },
        },
      );

      // ── Phase 3 — About → Services: back to normal size, centred ────────────
      gsap.fromTo(
        state,
        { scale: 1.14 * moonScaleMul, posX: hw * 0.88, lightX: -3.9 },
        {
          scale: 0.47 * moonScaleMul,
          posX: 0,
          lightX: -3.4,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#services',
            start: 'top bottom',
            end: 'top 30%',
            scrub: 1.8,
          },
        },
      );

      // ── Phase 4a — Services → Projects: become smaller, centred ──────────────
      gsap.fromTo(
        state,
        { scale: 0.47 * moonScaleMul, posX: 0, lightX: -3.4 },
        {
          scale: 0.25 * moonScaleMul,
          posX: 0,
          lightX: -3.4,
          ease: 'power1.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#work',
            start: 'top bottom',
            end: 'top 40%',
            scrub: 1.2,
          },
        },
      );

      // ── Phase 4b — Projects: continuous cinematic zoom ──────────────────────
      gsap.fromTo(
        state,
        { scale: 0.25 * moonScaleMul, posX: 0, lightX: -3.4 },
        {
          scale: 1.2 * moonScaleMul,
          posX: 0,
          lightX: -3.9,
          ease: 'power1.in',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#work',
            start: 'top 40%',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        },
      );

      // ── Phase 5 — Experience: left half-moon (shadow stays on right) ─────────
      gsap.fromTo(
        state,
        { scale: 1.2 * moonScaleMul, posX: 0, lightX: -3.9, lightY: 1.5, lightZ: 3.0 },
        {
          scale: 1.14 * moonScaleMul,
          posX: -hw * 0.88,
          lightX: -3.9,
          lightY: 1.5,
          lightZ: 3.0,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#experience',
            start: 'top bottom',
            end: 'top 30%',
            scrub: 1.5,
          },
        },
      );

      // ── Phase 6 — History: back to normal centre ────────────────────────────
      gsap.fromTo(
        state,
        { scale: 1.14 * moonScaleMul, posX: -hw * 0.88, lightX: -3.9 },
        {
          scale: 0.47 * moonScaleMul,
          posX: 0,
          lightX: -3.4,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#history',
            start: 'top bottom',
            end: 'top 40%',
            scrub: 1.5,
          },
        },
      );

      setTimeout(() => ScrollTrigger.refresh(), 150);
    });

    // ── Resize — recalculate hw & refresh triggers ────────────────────────────
    const onResize = () => {
      hw = getHalfWidth();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      planet.scale.setScalar(state.scale);
      planet.position.x = state.posX;
      planet.rotation.y = state.rotY;
      planet.rotation.x =
        THREE.MathUtils.degToRad(10) + Math.sin(elapsed * 0.2) * 0.015;

      keyLight.position.set(state.lightX, state.lightY, state.lightZ);
      keyLight.target.position.set(0, 0, 0);

      stars.rotation.y = elapsed * 0.01;

      renderer.domElement.style.opacity = state.opacity;
      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeRenderer);
      window.removeEventListener('resize', onResize);
      ctx.revert();
      scene.remove(stars, planet, keyLight, keyLight.target);
      planetGeometry.dispose();
      planetMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      moonColorTexture.dispose();
      moonNormalTexture.dispose();
      moonDispTexture.dispose();
      moonAOTexture.dispose();
      moonRoughnessTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}
