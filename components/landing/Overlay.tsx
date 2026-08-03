'use client';

import { Hero } from './sections/Hero';
import { ValueProps } from './sections/ValueProps';
import { Timeline } from './sections/Timeline';
import { Footer } from './sections/Footer';
import { CommandCenter } from './sections/CommandCenter';
import { Proof } from './sections/Proof';
import { StoryRail } from './StoryRail';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Overlay() {
  const { scrollYProgress } = useScroll();

  // Navbar logo opacity: visible after first section
  const navOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const navBlur = useTransform(scrollYProgress, [0, 0.05], [0, 20]);

  return (
    <>
      {/* Sticky navigation */}
      <motion.nav
        id="main-nav"
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 clamp(20px, 4vw, 56px)',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`,
          background: 'rgba(7, 9, 13, 0.56)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }}
          />
          <span className="font-bold text-sm" style={{ letterSpacing: '0.12em', color: '#FFFFFF' }}>
            ARC/STUDIO
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '#system', label: 'System' },
            { href: '#value-props', label: 'Features' },
            { href: '#decision', label: 'Principles' },
            { href: '#enterprise-cta', label: 'Deploy' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium uppercase tracking-wider transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#00E5FF')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)')}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          id="nav-deploy-btn"
          className="text-xs font-bold uppercase px-4 py-2 rounded-md"
          style={{
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.2)',
            color: '#00E5FF',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          aria-label="Deploy Arc.Studio"
        >
          Deploy Locally
        </button>
      </motion.nav>
      <StoryRail />

      {/* Scrollable overlay content */}
      <main
        role="main"
        className="relative"
        style={{ zIndex: 10, pointerEvents: 'auto' }}
      >
        <div className="landing-shell">
          <Hero />
          <CommandCenter />
          <ValueProps />
          <Timeline />
          <Proof />
          <Footer />
        </div>
      </main>
    </>
  );
}
