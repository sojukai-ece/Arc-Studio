'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const DEPLOY_BTN_ID = 'hero-deploy-btn';
const LEARN_MORE_ID = 'hero-learn-more';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="hero"
      className="section bg-grid relative flex items-center justify-start min-h-screen"
      aria-labelledby="hero-headline"
    >
      {/* Radial glow behind 3D model */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 65% 50%, rgba(0,229,255,0.06) 0%, rgba(123,44,191,0.04) 50%, transparent 70%)',
        }}
      />

      <div className="container relative z-10" style={{ maxWidth: 700, paddingLeft: 48 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-6"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }}
          />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#00E5FF', letterSpacing: '0.2em' }}
          >
            AI-Powered · 100% Local · Zero Cloud
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-headline"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="font-bold leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)' }}
        >
          Your Business.
          <br />
          Your Data.{' '}
          <span className="gradient-text">Your Rules.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mb-10 leading-relaxed font-light"
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 560,
          }}
        >
          Meet Arc.Studio. The offline, localized AI decision engine that turns raw
          inquiries into optimized profits—without ever connecting to the cloud.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex items-center gap-4 flex-wrap"
        >
          <button
            id={DEPLOY_BTN_ID}
            className="btn-deploy"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Deploy Arc.Studio locally"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Deploy Locally
          </button>

          <a
            id={LEARN_MORE_ID}
            href="#value-props"
            className="font-medium text-sm flex items-center gap-2 transition-all duration-300"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            aria-label="Learn more about Arc.Studio"
          >
            Learn more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex items-center gap-8 mt-14 pt-8 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {[
            { value: '0ms', label: 'Cloud Latency' },
            { value: '100%', label: 'Data Privacy' },
            { value: '<4GB', label: 'RAM Required' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold glow-cyan" style={{ fontSize: '1.6rem' }}>{stat.value}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.25)' }}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}