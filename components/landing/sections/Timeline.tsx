'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    id: 'step-input',
    number: '01',
    title: 'Input',
    subtitle: 'Feed the Engine',
    description:
      'Drop in raw client texts, voice memos, inquiry emails, or calendar data. Arc.Studio\'s local parser instantly structures unstructured information—no formatting required.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    color: '#00E5FF',
  },
  {
    id: 'step-analyze',
    number: '02',
    title: 'Analyze',
    subtitle: 'AI Calculates Everything',
    description:
      'The local LLM cross-references scope complexity, your burnout risk index, schedule density, profit margin thresholds, and historical job performance. All computed in seconds, on-device.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: '#7B2CBF',
  },
  {
    id: 'step-execute',
    number: '03',
    title: 'Execute',
    subtitle: 'A Decisive Business Answer',
    description:
      'Receive a binary, unambiguous output: a custom optimized quote with line-item justifications, or a clear recommendation to pass on the gig—with the financial reasoning to back it up.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: '#00E5FF',
  },
];

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="section"
      aria-labelledby="timeline-heading"
      style={{
        background: 'linear-gradient(180deg, #0D0D12 0%, #0A0A0A 100%)',
        position: 'relative',
      }}
    >
      {/* Decorative vertical line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: 160,
          bottom: 80,
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.3) 20%, rgba(123,44,191,0.3) 80%, transparent)',
          display: 'block',
        }}
        aria-hidden="true"
      />

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: '#00E5FF', letterSpacing: '0.2em' }}
          >
            How It Works
          </span>
          <h2
            id="timeline-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            From Inquiry to{' '}
            <span className="gradient-text">Optimized Decision</span>
          </h2>
          <p className="mt-4 mx-auto" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 480, fontSize: '0.95rem' }}>
            Three steps. No cloud calls. Full strategic clarity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col gap-0" style={{ maxWidth: 760, margin: '0 auto' }}>
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={step.id}
                id={step.id}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + idx * 0.2, ease: 'easeOut' }}
                className="relative grid mb-16"
                style={{
                  gridTemplateColumns: '1fr 80px 1fr',
                  alignItems: 'start',
                }}
              >
                {/* Left content */}
                <div className={isLeft ? 'pr-8' : ''}>
                  {isLeft && (
                    <div className="glass-card p-8" style={{
                      borderColor: `${step.color}20`,
                      boxShadow: `0 0 40px ${step.color}08`,
                    }}>
                      <StepContent step={step} />
                    </div>
                  )}
                </div>

                {/* Center node */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.2, type: 'spring' }}
                    className="flex items-center justify-center rounded-full w-14 h-14"
                    style={{
                      background: 'linear-gradient(135deg, #141414, #1a1a1a)',
                      border: `2px solid ${step.color}`,
                      boxShadow: `0 0 20px ${step.color}40, 0 0 60px ${step.color}15`,
                      color: step.color,
                    }}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </motion.div>
                  <span
                    className="font-bold text-xs"
                    style={{ color: step.color, opacity: 0.7, letterSpacing: '0.1em' }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Right content */}
                <div className={!isLeft ? 'pl-8' : ''}>
                  {!isLeft && (
                    <div className="glass-card p-8" style={{
                      borderColor: `${step.color}20`,
                      boxShadow: `0 0 40px ${step.color}08`,
                    }}>
                      <StepContent step={step} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: typeof steps[0] }) {
  return (
    <>
      <div
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: step.color, letterSpacing: '0.15em' }}
      >
        {step.subtitle}
      </div>
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
        {step.title}
      </h3>
      <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem' }}>
        {step.description}
      </p>
    </>
  );
}