'use client';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Michael Glass',
    title: 'Group Design Director',
    company: 'Fantasy Interactive',
    parts: [
      { text: '"Minh is ', highlight: false },
      { text: 'seriously ', highlight: true },
      { text: 'the best and ', highlight: false },
      { text: 'he never ', highlight: true },
      { text: 'complains', highlight: false },
    ],
    initial: 'MG',
  },
  {
    name: 'Peter Smart',
    title: 'Head of Product',
    company: 'Fantasy Interactive',
    parts: [
      { text: '"This looks ', highlight: false },
      { text: 'amazing. ', highlight: true },
      { text: 'Great work!', highlight: false },
    ],
    initial: 'PS',
  },
  {
    name: 'Linh Le',
    title: 'Project Manager',
    company: 'Interactive Labs',
    parts: [
      { text: '"He\'s a ', highlight: false },
      { text: 'beast. ', highlight: true },
      { text: 'His skills are ', highlight: false },
      { text: 'insane!', highlight: true },
    ],
    initial: 'LL',
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding min-h-screen" style={{ background: 'transparent' }}>
      <motion.p
        className="text-[14px] tracking-[0.4em] uppercase mb-12"
        style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-inter)' }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        WHAT THEY SAID
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-[1100px]">
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl p-7 md:p-8 space-y-6"
            style={{ borderColor: 'rgba(0,243,255,0.10)', background: 'rgba(10,10,10,0.4)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ borderColor: 'rgba(255,0,60,0.35)', boxShadow: '0 0 30px rgba(255,0,60,0.10)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: i * 0.12,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(0,243,255,0.06)', border: '1px solid rgba(0,243,255,0.15)' }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: '#00f3ff', fontFamily: 'var(--font-inter)' }}
              >
                {item.initial}
              </span>
            </div>

            {/* Quote */}
            <p
              className="text-xl md:text-2xl leading-snug"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 300 }}
            >
              {item.parts.map((part, j) => (
                <span
                  key={j}
                  className={part.highlight ? 'quote-highlight' : 'quote-dim'}
                >
                  {part.text}
                </span>
              ))}
            </p>

            {/* Author */}
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.title}</p>
              <p className="text-xs" style={{ color: 'rgba(0,243,255,0.40)' }}>{item.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
          
