'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="hero" className="section hero-section relative flex min-h-screen items-center" aria-labelledby="hero-headline">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 70% at 18% 48%, rgba(4, 12, 18, 0.92) 0%, rgba(4, 12, 18, 0.58) 55%, transparent 100%)' }} />

      <div className="container relative z-10" style={{ maxWidth: 1280 }}>
        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-7 flex items-center gap-3"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: '#00E5FF', boxShadow: '0 0 12px #00E5FF' }} />
            <span className="text-xs font-semibold uppercase" style={{ color: '#00E5FF', letterSpacing: '0.2em' }}>
              AI-powered · 100% local · zero cloud
            </span>
          </motion.div>

          <motion.h1
            id="hero-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: 'easeOut' }}
            className="mb-7 font-bold leading-[0.98] tracking-[-0.055em]"
            style={{ fontSize: 'clamp(3.2rem, 7vw, 6.8rem)' }}
          >
            Make sharper moves.
            <br />
            <span className="gradient-text">Keep the edge local.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.27, ease: 'easeOut' }}
            className="mb-10 max-w-xl font-light leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(255,255,255,0.7)' }}
          >
            Arc Studio turns the messy details behind every inquiry into an informed next move—without sending your business intelligence anywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-5"
          >
            <a href="#enterprise-cta" className="btn-deploy" aria-label="Start with Arc Studio">
              Start strategically
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#value-props" className="group flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Explore the system <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.65 }}
            className="mt-14 flex flex-wrap items-center gap-x-9 gap-y-4 border-t pt-7"
            style={{ borderColor: 'rgba(255,255,255,0.14)' }}
          >
            {[
              { value: '0', label: 'Cloud dependencies' },
              { value: '100%', label: 'Data stays yours' },
              { value: '<4GB', label: 'Memory required' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="glow-cyan text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 text-xs font-medium uppercase" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="absolute bottom-9 right-8 z-10 hidden flex-col items-end gap-2 md:flex" style={{ color: 'rgba(255,255,255,0.52)' }} aria-hidden="true">
        <span className="text-xs uppercase" style={{ letterSpacing: '0.18em' }}>Scroll to direct the story</span>
        <span className="h-10 w-px bg-cyan-300/80" />
      </motion.div>
    </section>
  );
}
