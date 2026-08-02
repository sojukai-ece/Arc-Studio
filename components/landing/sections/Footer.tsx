'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const targets = [
    'Event Photographers',
    'Elite Freelancers',
    'Local Contractors',
    'Private Consultants',
  ];

  return (
    <footer
      id="enterprise-cta"
      ref={ref}
      className="section"
      aria-labelledby="footer-headline"
      style={{
        background: 'transparent',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 80,
      }}
    >
      <div className="container">
        {/* Main CTA grid */}
        <div className="grid items-center gap-16" style={{ gridTemplateColumns: '1fr auto' }}>
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-5 h-px" style={{ background: '#7B2CBF' }} />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: '#7B2CBF', letterSpacing: '0.2em' }}
              >
                Enterprise Trust
              </span>
            </motion.div>

            <motion.h2
              id="footer-headline"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
            >
              Stop Guessing.
              <br />
              <span className="gradient-text">Start Strategizing.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-10 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', maxWidth: 520 }}
            >
              Built for event photographers, elite freelancers, and local contractors
              who value privacy and profit above all else.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {targets.map((t) => (
                <div
                  key={t}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(123,44,191,0.08)',
                    border: '1px solid rgba(123,44,191,0.25)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {t}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <button
                id="footer-deploy-btn"
                className="btn-deploy"
                aria-label="Deploy Arc.Studio locally"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Deploy Locally
              </button>

              <button
                id="footer-docs-btn"
                className="text-sm font-medium px-6 py-3.5 rounded-md transition-all duration-300"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(123,44,191,0.5)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                }}
                aria-label="View documentation"
              >
                View Docs
              </button>
            </motion.div>
          </div>

          {/* Right: Empty Placeholder for Global 3D Microchip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="hidden md:flex flex-col items-center gap-3"
          >
            <div
              className="relative flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                padding: 20,
                width: 280,
                height: 280,
              }}
            >
              {/* The main 3D scene will overlay its microchip directly into this empty space */}
            </div>
            <span
              className="text-xs font-medium tracking-widest"
              style={{ color: 'rgba(0,229,255,0.4)', letterSpacing: '0.25em' }}
            >
              ARC STUDIO CORE
            </span>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-between flex-wrap gap-4 mt-20 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#00E5FF', boxShadow: '0 0 6px #00E5FF' }}
            />
            <span className="font-bold text-sm" style={{ letterSpacing: '0.08em' }}>ARC.STUDIO</span>
          </div>

          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © 2025 Arc Studio. All rights reserved. Fully local. Fully private.
          </p>

          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Docs'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-xs transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#00E5FF')}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.25)')}
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}