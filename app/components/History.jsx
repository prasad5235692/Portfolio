'use client';
import { motion } from 'framer-motion';

const history = [
  {
    year: 'NOW',
    title: 'FULL STACK DEVELOPER | AI APPLICATIONS',
    company: 'APPLOOM TECHNOLOGIES'
  },
  {
    year: '2025',
    title: 'FULL STACK DEVELOPER',
    company: 'TECH MIND INFOTECH'
  },
  {
    year: '2024',
    title: 'FLASH DEVELOPER',
    company: 'TECH MIND INFOTECH'
  },
  {
    year: '2023',
    title: 'FLASH DESIGNER',
    company: 'TECH MIND INFOTECH'
  }
];

export default function History() {
  return (
    <section
      id="history"
      className="section-padding min-h-screen relative z-20"
      style={{ background: 'transparent' }}
    >
      <div className="content-container">
        <motion.p
          className="text-[14px] tracking-[0.4em] uppercase mb-12 font-bold"
          style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          HISTORY
        </motion.p>

        <div>
          {history.map((item, i) => (
            <motion.div
              key={i}
              className="history-row group grid grid-cols-[100px_1fr] sm:grid-cols-[180px_1fr] lg:grid-cols-[320px_1fr] items-center border-b gap-4 sm:gap-10 sm:gap-x-16"
              style={{
                paddingTop: '50px',
                paddingBottom: '50px',
                borderColor: 'var(--line-color)'
              }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{
                y: -6,
                borderColor: 'rgba(255, 0, 60, 0.35)',
                boxShadow: '0 20px 50px -12px rgba(0,0,0,0.6)'
              }}
              whileTap={{
                y: -4,
                borderColor: 'rgba(255, 0, 60, 0.35)',
                boxShadow: '0 20px 50px -12px rgba(0,0,0,0.6)'
              }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                default: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                borderColor: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                boxShadow: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div className="bg-hover-expand" />
              <div className="flex items-center self-start relative z-10">
                <span
                  className="history-year text-[clamp(1.5rem,4vw,3rem)] md:text-5xl tabular-nums text-white/80 group-hover:!text-black group-hover:font-medium"
                  style={{
                    fontFamily: 'var(--font-inter)',
                    transition: 'color 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {item.year}
                </span>
              </div>

              <div className="space-y-4 relative z-10">
                <h4
                  className="history-title text-[clamp(0.75rem,2vw,1.25rem)] md:text-5xl font-medium text-white/80 group-hover:!text-black group-hover:font-medium"
                  style={{ transition: 'color 0.45s cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  {item.title}
                </h4>
                <p
  className="history-company text-[clamp(1.2rem,1.8vw,2rem)] font-black leading-none tracking-[0.08em] uppercase"
>
  {item.company}
</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
