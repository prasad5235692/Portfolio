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

          .hero-left  { justify-content: flex-start; }
          .hero-right { justify-content: flex-end; }

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
            color: rgba(255, 255, 255, 0.92);
            margin: 0;
            max-width: 7ch;
          }

          .hero-heading span {
            display: block;
            color: rgba(255, 255, 255, 0.5);
          }

          /* Centre column: transparent spacer — MoonJourney canvas shows through */
          .hero-canvas-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          /* Transparent placeholder — reserves layout space for the moon */
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
            color: rgba(255, 255, 255, 0.64);
            margin: 0;
            max-width: 28ch;
            text-wrap: balance;
          }

          .hero-body strong {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
          }

          @media (max-width: 1024px) {
            .hero-grid {
              grid-template-columns: minmax(0, 1fr) minmax(280px, 380px) minmax(0, 1fr);
            }
            .hero-left,
            .hero-right { min-height: 360px; }
          }

          @media (max-width: 860px) {
            .hero-grid {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 1.5rem;
              min-height: auto;
              padding: 2rem 0;
            }

            .hero-left,
            .hero-right {
              min-height: auto;
              justify-content: center;
              text-align: center;
              width: 100%;
            }

            .hero-copy-block {
              align-items: center;
              gap: 0.75rem;
            }

            .hero-kicker {
              font-size: 11px;
              letter-spacing: 0.35em;
            }

            .hero-heading {
              font-size: clamp(2.5rem, 14vw, 4rem);
              text-align: center;
              max-width: none;
            }

            .hero-canvas-column {
              order: 3;
              width: 100%;
            }

            .hero-canvas-mount {
              width: min(70vw, 280px);
              margin: 0 auto;
            }

            .hero-right {
              order: 4;
            }

            .hero-body {
              font-size: 0.95rem;
              line-height: 1.65;
              max-width: 32ch;
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
            }
          }

          @media (max-width: 480px) {
            .hero-grid {
              gap: 1.25rem;
              padding: 1rem 0;
            }

            .hero-heading {
              font-size: clamp(2.2rem, 13vw, 3.5rem);
            }

            .hero-canvas-mount {
              width: min(60vw, 220px);
            }

            .hero-body {
              font-size: 0.9rem;
              max-width: 30ch;
              padding: 0 1rem;
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
