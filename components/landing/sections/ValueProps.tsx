'use client';

import { useRef, useState, MouseEvent } from 'react';
import { motion, useInView } from 'framer-motion';

interface CardProps {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  accentColor: string;
  glowColor: string;
  span?: 'col' | 'row';
  delay?: number;
}

function TiltCard({ id, icon, tag, title, description, accentColor, glowColor, span, delay = 0 }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x, y });
  };

  const reset = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      className={`glass-card tilt-card p-8 relative overflow-hidden cursor-default ${
        span === 'col' ? 'md:col-span-2' : ''
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease' : 'transform 0.5s ease',
        boxShadow: isHovered
          ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${glowColor}22`
          : '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Glow blob in corner */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none"
        style={{ background: glowColor, opacity: isHovered ? 0.15 : 0.07, transition: 'opacity 0.4s' }}
      />

      {/* Tag */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5"
        style={{
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          color: accentColor,
          letterSpacing: '0.08em',
        }}
      >
        {tag}
      </div>

      {/* Icon */}
      <div className="mb-5 text-4xl">{icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3" style={{ color: '#FFFFFF' }}>
        {title}
      </h3>

      {/* Description */}
      <p className="leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
        {description}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          width: isHovered ? '100%' : '30%',
        }}
      />
    </motion.div>
  );
}

export function ValueProps() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="value-props"
      className="section"
      aria-labelledby="value-props-heading"
      style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0D0D12 100%)' }}
    >
      <div className="container">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: '#7B2CBF', letterSpacing: '0.2em' }}
          >
            Why Arc.Studio
          </span>
          <h2
            id="value-props-heading"
            className="font-bold"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            Engineered for{' '}
            <span className="gradient-text">Sovereignty & Profit</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridTemplateRows: 'auto',
          }}
        >
          {/* Large card — Security */}
          <TiltCard
            id="card-security"
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            }
            tag="100% OFFLINE"
            title="Your Data Never Leaves."
            description="No cloud. No data leaks. Your client contracts, financials, and strategic intelligence stay strictly on your local device. Arc.Studio operates with complete network isolation—by design, not by policy."
            accentColor="#00E5FF"
            glowColor="#00E5FF"
            span="col"
            delay={0}
          />

          {/* Card 2 — Quantized Power */}
          <TiltCard
            id="card-llm"
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7B2CBF" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h4" />
                <circle cx="17" cy="16" r="1.5" fill="#7B2CBF" />
              </svg>
            }
            tag="QUANTIZED LLM"
            title="Lightweight Intelligence."
            description="Runs natively on your tablet or laptop. A precision-quantized language model that needs no internet, no GPU cloud, and no subscription—just raw local compute."
            accentColor="#7B2CBF"
            glowColor="#7B2CBF"
            delay={0.1}
          />

          {/* Card 3 — Smart Quoting */}
          <TiltCard
            id="card-quoting"
            icon={
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            tag="PROFIT OPTIMIZER"
            title="Maximize Every Quote."
            description="Instantly cross-references your operational costs, schedule density, and historical data to output the perfect quote—or a decisive pass recommendation. Stop leaving money on the table."
            accentColor="#00E5FF"
            glowColor="#00E5FF"
            delay={0.2}
          />
        </div>

        {/* Bottom trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-10 mt-16 flex-wrap"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40 }}
        >
          {[
            'No Subscription',
            'No Usage Limits',
            'Military-Grade Isolation',
            'Works Offline',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <div className="w-1 h-1 rounded-full" style={{ background: '#00E5FF' }} />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}