  'use client';

  /* ── Hero — layout only; moon rendered by <MoonJourney /> fixed canvas ────── */
  export default function Hero() {
    return (
      <>
       <style>{`
  .hero-shell {
    position: relative;
    min-height: 100vh;
    background: transparent !important;
  }

  .hero-grid {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 420px) minmax(0, 1fr);
    align-items: center;
    gap: clamp(1.5rem, 4vw, 5rem);
    min-height: 85vh;
  }

  .hero-copy-block {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .hero-left,
  .hero-right {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .hero-left {
    justify-content: flex-start;
  }

  .hero-right {
    justify-content: flex-end;
  }

  .hero-kicker {
    font-family: var(--font-inter);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--accent-red);
  }

  .hero-heading {
    font-family: var(--font-inter);
    font-size: clamp(2.2rem, 5vw, 5rem);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.92);
    margin: 0;
    max-width: 7ch;
  }

  .hero-heading span {
    display: block;
    color: rgba(255,255,255,0.5);
  }

  .hero-canvas-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .hero-canvas-mount {
    width: min(100%, 420px);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }

  .hero-body {
    font-family: var(--font-inter);
    font-size: clamp(0.95rem, 1.05vw, 1.05rem);
    font-weight: 400;
    line-height: 1.8;
    letter-spacing: 0.01em;
    color: rgba(255,255,255,0.64);
    margin: 0;
    max-width: 28ch;
    text-wrap: balance;
  }

  .hero-body strong {
    color: rgba(255,255,255,0.9);
    font-weight: 400;
  }

  @media (max-width: 1024px) {
    .hero-grid {
      grid-template-columns:
        minmax(0, 1fr)
        minmax(280px, 380px)
        minmax(0, 1fr);
    }

    .hero-left,
    .hero-right {
      min-height: 360px;
    }
  }

  /* ── Mobile: fluid 3-zone grid layout (title → moon → body) ── */
  @media (max-width: 860px) {

    .hero-shell {
      position: relative;
      width: 100%;
      min-height: 100svh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 0 !important;
    }

    .hero-grid {
      position: relative;
      width: 100%;
      min-height: 100svh;
      min-height: 100dvh;

      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 1fr;

      padding: 0 !important;
      margin: 0 !important;

      overflow: hidden;
    }

    /* ── TOP ZONE: title ── */

    .hero-left {
      position: relative;
      width: 100%;
      min-height: 0 !important;

      display: flex;
      align-items: center;
      justify-content: center;

      text-align: center;
      z-index: 10;

      padding-top: clamp(72px, 10svh, 90px);
      padding-bottom: clamp(12px, 2svh, 24px);
    }

    .hero-copy-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-align: center;
    }

    .hero-kicker {
      display: block;
      font-size: clamp(9px, 2.8vw, 12px);
      line-height: 1;
      letter-spacing: clamp(0.25em, 1vw, 0.4em);
      text-align: center;
      white-space: nowrap;
    }

    .hero-heading {
      width: 100%;
      max-width: none;
      margin: 0;
      font-size: clamp(2.45rem, 13.5vw, 3.8rem);
      line-height: 0.9;
      letter-spacing: 0;
      text-align: center;
    }

    .hero-heading span {
      display: block;
      text-align: center;
    }

    /* ── CENTER ZONE: moon ── */

    .hero-canvas-column {
      position: relative;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 2;
      pointer-events: none;

      margin: 0 !important;
    }

    .hero-canvas-mount {
      width: clamp(250px, 70vw, 330px);
      height: clamp(250px, 70vw, 330px);

      min-width: 240px;
      min-height: 240px;
      max-width: 330px;
      max-height: 330px;

      aspect-ratio: 1 / 1;
      flex-shrink: 0;
      margin: 0 auto;
    }

    /* ── BOTTOM ZONE: body ── */

    .hero-right {
      position: relative;
      width: 100%;
      min-height: 0 !important;

      display: flex;
      align-items: flex-start;
      justify-content: center;

      margin: 0 !important;
      padding: clamp(4px, 1svh, 12px) 16px 0;
      padding-bottom: max(clamp(12px, 2svh, 24px), env(safe-area-inset-bottom));

      text-align: center;
      z-index: 10;
    }

    .hero-body {
      width: min(88vw, 330px);
      max-width: 330px;
      padding: 0;
      margin: 0 auto;
      font-size: clamp(0.86rem, 3.6vw, 0.92rem);
      line-height: 1.65;
      text-align: center;
      text-wrap: balance;
      color: rgba(255, 255, 255, 0.72);
    }
  }
`}</style>
        <section id="home" className="hero-shell section-padding">
          <div className="hero-grid">

            {/* Left — title copy */}
            <div className="hero-left">
              <div className="hero-copy-block">
                <span className="hero-kicker">Creative Direction</span>
                <h1 className="hero-heading">
                  Creative
                  <span>Developer</span>
                </h1>
              </div>
            </div>

            <div className="hero-canvas-column">
                <div className="hero-canvas-mount" aria-hidden="true" />

            </div>

            {/* Right — body copy */}
            <div className="hero-right">
              <p className="hero-body">
                Hi! I am <strong>Prasad K</strong>, a full stack developer and app
                developer. I have <strong>2 years of experience</strong> in backend
                development and also work with 3D elements, animations, and modern
                creative UI on the frontend.
              </p>
            </div>

          </div>
        </section>
      </>
    );
  }
