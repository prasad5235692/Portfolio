'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import s from './Clients.module.css';

/* -- Project data ---------------------------------------------- */
const projectData = [
  {
    id: '01',
    year: '2026',
    category: 'AI Platform / Full Stack / Android',
    title: 'SMART AI',
    titleAlt: 'OPEN AI',
    desc: 'A complete AI platform with an advanced web application and Android APK. Users can chat with AI, generate content, answer questions, and use multiple AI-powered tools through a modern interface.',
    tags: ['AI', 'React', 'Node.js', 'Express', 'MongoDB', 'Android APK', 'Groq AI'],
    link: 'https://smart-ai-showcase.vercel.app/',
    video: '/assets/image/moon/projects/AI.png',
    poster: '/assets/image/moon/projects/AI.png',
  },
  {
    id: '02',
    year: '2026',
    category: 'AI Powered E-Commerce',
    title: 'PICKZO',
    titleAlt: 'STORE',
    desc: 'An AI-powered e-commerce website where the AI assistant can perform real user actions including product search, create account, login, logout, add to cart, remove from cart, manage profile, update profile, place orders, cancel orders, view cart, and order history.',
    tags: ['React', 'Node.js', 'MongoDB', 'AI Assistant', 'E-Commerce', 'JWT', 'REST API'],
    link: 'https://pickzo.vercel.app/',
    video: '/assets/image/moon/projects/shop.png',
    poster: '/assets/image/moon/projects/shop.png',
  },
];

const projects = projectData;

/* -- Tunnel config (reference values, exact) ------------------ */
const CONFIG = {
  itemCount: 20,
  starCount: 150,
  zGap: 800,
  intraGap: 300,   // gap between title and its card (appear together)
  interGap: 2500,  // gap from one project's start to the next (sequential reveal)
  loopSize: 0,
  camSpeed: 2.5,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

/* -------------------------------------------------------------
   Helper: build one project card DOM node
------------------------------------------------------------- */
function buildCard(project) {
  const card = document.createElement('div');
  card.className = 'tunnel-card';

  const header = document.createElement('div');
  header.className = 'tunnel-card-header';

  const idSpan = document.createElement('span');
  idSpan.className = 'tunnel-card-id';
  idSpan.innerText = project.id;

  const yearSpan = document.createElement('span');
  yearSpan.className = 'tunnel-card-year';
  yearSpan.innerText = project.year;

  header.appendChild(idSpan);
  header.appendChild(yearSpan);
  card.appendChild(header);

  const h2 = document.createElement('h2');
  h2.innerText = project.title;

  const altSpan = document.createElement('span');
  altSpan.className = 'tunnel-title-alt';
  altSpan.innerText = project.titleAlt;
  h2.appendChild(altSpan);
  card.appendChild(h2);

  const catP = document.createElement('p');
  catP.className = 'tunnel-card-category';
  catP.innerText = project.category;
  card.appendChild(catP);

  const descP = document.createElement('p');
  descP.className = 'tunnel-card-desc';
  descP.innerText = project.desc;
  card.appendChild(descP);

  const video = document.createElement('video');
  video.src = project.video;
  video.poster = project.poster;
  video.muted = true;
  video.loop = true;
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'none');
  card.appendChild(video);

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'tunnel-card-tags';
  project.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'tunnel-card-tag';
    span.innerText = tag;
    tagsDiv.appendChild(span);
  });
  card.appendChild(tagsDiv);

  const footer = document.createElement('div');
  footer.className = 'tunnel-card-footer';

  const link = document.createElement('a');
  link.href = project.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'tunnel-card-link';
  link.innerText = 'VIEW PROJECT ?';
  footer.appendChild(link);
  card.appendChild(footer);

  return card;
}

/* -------------------------------------------------------------
   Component
------------------------------------------------------------- */
export default function Clients() {
  const sectionRef  = useRef(null);
  const viewportRef = useRef(null);
  const worldRef    = useRef(null);
  const fpsRef      = useRef(null);
  const velRef      = useRef(null);
  const coordRef    = useRef(null);

  const stateRef = useRef({
    scroll: 0,
    smoothedScroll: 0,
    velocity: 0,
    targetSpeed: 0,
    mouseX: 0,
    mouseY: 0,
    activeProject: -1,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const world    = worldRef.current;
    const fpsEl    = fpsRef.current;
    const velEl    = velRef.current;
    const coordEl  = coordRef.current;
    const section  = sectionRef.current;

    if (!viewport || !world || !section) return;

    const st    = stateRef.current;
    const items = [];

    const totalTunnelLength = (projects.length - 1) * CONFIG.interGap + CONFIG.intraGap + 500;

    projects.forEach((project, i) => {
      const headEl = document.createElement('div');
      headEl.className = 'tunnel-item';
      const txt = document.createElement('div');
      txt.className = 'tunnel-big-text';
      txt.innerText = project.title;
      headEl.appendChild(txt);
      items.push({ el: headEl, type: 'text', projectIdx: i, x: 0, y: 0, rot: 0, baseZ: -(i * CONFIG.interGap) });
      world.appendChild(headEl);

      const cardEl = document.createElement('div');
      cardEl.className = 'tunnel-item';
      const cardInner = buildCard(project);
      cardEl.appendChild(cardInner);

      const angle = (i / projects.length) * Math.PI * 6;
      const x     = Math.cos(angle) * (window.innerWidth  * 0.3);
      const y     = Math.sin(angle) * (window.innerHeight * 0.3);
      const rot   = (Math.random() - 0.5) * 30;
      items.push({ el: cardEl, type: 'card', projectIdx: i, x, y, rot, baseZ: -(i * CONFIG.interGap + CONFIG.intraGap), cardInner });
      world.appendChild(cardEl);

      cardEl.addEventListener('mouseenter', () => cardInner.classList.add('hover-active'), { passive: true });
      cardEl.addEventListener('mouseleave', () => cardInner.classList.remove('hover-active'), { passive: true });
    });

    // Devices without real hover (touch) can't trigger mouseenter/mouseleave,
    // so the active project is emphasized automatically as it becomes centered.
    const supportsHover = typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const scrollNeeded = (totalTunnelLength + 1000) / CONFIG.camSpeed;
    section.style.height = `${window.innerHeight + scrollNeeded}px`;

    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div');
      el.className = 'tunnel-star';
      world.appendChild(el);
      items.push({
        el,
        type: 'star',
        x:     (Math.random() - 0.5) * 3000,
        y:     (Math.random() - 0.5) * 3000,
        baseZ: -Math.random() * (totalTunnelLength + 1000),
      });
    }

    /* -- Mouse tracking ---------------------------------------- */
    const onMouseMove = (e) => {
      st.mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      st.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* -- Click handler — open active project ------------------- */
    const onClick = () => {
      const idx = st.activeProject;
      if (idx >= 0 && idx < projects.length) {
        const link = projects[idx].link;
        if (link && link !== '#') {
          window.open(link, '_blank');
        }
      }
    };
    section.addEventListener('click', onClick);

    /* -- Cursor events — enlarge only while pointer is inside -- */
    const onEnter = () => window.dispatchEvent(new CustomEvent('cursor:project'));
    const onLeave = () => window.dispatchEvent(new CustomEvent('cursor:endProject'));
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);

    /* -- RAF loop ---------------------------------------------- */
    let lastTime       = 0;
    let prevRawScroll  = 0;
    let rafId;
    let mounted        = true;

    function loop(time) {
      if (!mounted) return;

      const delta = time - lastTime;
      lastTime = time;
      if (delta > 0 && fpsEl && time % 10 < 1) {
        fpsEl.innerText = Math.round(1000 / delta);
      }

      const sectionAbsTop = section.getBoundingClientRect().top + window.scrollY;
      const rawScroll     = Math.max(0, window.scrollY - sectionAbsTop);

      const scrollDelta  = rawScroll - prevRawScroll;
      prevRawScroll      = rawScroll;
      st.scroll          = rawScroll;
      st.targetSpeed     = scrollDelta * 0.15;
      st.velocity       += (st.targetSpeed - st.velocity) * 0.1;

      st.smoothedScroll += (rawScroll - st.smoothedScroll) * 0.05;

      if (velEl)   velEl.innerText   = Math.abs(st.velocity).toFixed(2);
      if (coordEl) coordEl.innerText = st.smoothedScroll.toFixed(0);

      const tiltX = st.mouseY * 5 - st.velocity * 0.5;
      const tiltY = st.mouseX * 5;
      world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      const baseFov = 1000;
      const fov     = baseFov - Math.min(Math.abs(st.velocity) * 10, 600);
      viewport.style.perspective = `${fov}px`;

      const cameraZ = st.smoothedScroll * CONFIG.camSpeed;
      const t       = time * 0.001;

      items.forEach((item) => {
        const relZ = item.baseZ + cameraZ;
        const vizZ = relZ;

        let alpha = 1;
        if (vizZ < -3000) {
          alpha = 0;
        } else if (vizZ < -2000) {
          alpha = (vizZ + 3000) / 1000;
        }
        if (vizZ > 100 && item.type !== 'star') {
          alpha = 1 - (vizZ - 100) / 400;
        }
        if (alpha < 0) alpha = 0;

        item.el.style.opacity = alpha;

        if (alpha > 0) {
          let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;

          if (item.type === 'star') {
            const stretch = Math.max(1, Math.min(1 + Math.abs(st.velocity) * 0.1, 10));
            trans += ` scale3d(1, 1, ${stretch})`;
          } else if (item.type === 'text') {
            trans += ` rotateZ(${item.rot}deg)`;
            if (Math.abs(st.velocity) > 1) {
              const offset = st.velocity * 2;
              item.el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 white`;
            } else {
              item.el.style.textShadow = 'none';
            }
          } else {
            const floatY = Math.sin(t + item.x) * 10;
            trans += ` rotateZ(${item.rot}deg) rotateY(${floatY}deg)`;
          }

          item.el.style.transform = trans;
        }
      });

      /* -- Active project detection ---------------------------- */
      {
        let minDist = Infinity;
        let activeIdx = -1;
        items.forEach((item) => {
          if (item.type === 'card') {
            const relZ = item.baseZ + cameraZ;
            const dist = Math.abs(relZ);
            if (dist < minDist) {
              minDist = dist;
              activeIdx = item.projectIdx;
            }
          }
        });
        st.activeProject = activeIdx;

        if (!supportsHover) {
          items.forEach((item) => {
            if (item.type === 'card') {
              item.cardInner.classList.toggle('hover-active', item.projectIdx === activeIdx);
            }
          });
        }
      }

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('click', onClick);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      window.dispatchEvent(new CustomEvent('cursor:endProject'));
      while (world.firstChild) world.removeChild(world.firstChild);
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className={s.section}>
      <div className={s.sticky}>
        <motion.p
          className={`${s.projectsLabel} text-[14px] tracking-[0.4em] uppercase font-bold`}
          style={{
            color: 'var(--accent-red)',
            fontFamily: 'var(--font-inter)',
          }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: -2 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          PROJECTS
        </motion.p>

        <div className={s.scanlines} />
        <div className={s.vignette} />
        <div className={s.noise} />

        <div className={s.hud}>
        </div>

        <div className={s.viewport} ref={viewportRef}>
          <div className={s.world} ref={worldRef} />
        </div>

      </div>
    </section>
  );
}
