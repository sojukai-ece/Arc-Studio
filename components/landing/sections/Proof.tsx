'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const principles = [['Private by architecture', 'Your inquiry history, pricing logic, and client details remain on the machine where you work.'], ['Built for the real week', 'Capacity, travel, prep, follow-up, and energy all belong in a good business decision.'], ['Clarity over busywork', 'Get a defensible recommendation, then move. No dashboard theater or endless configuration.']];

export function Proof() {
  const ref = useRef<HTMLElement>(null); const inView = useInView(ref, { once: true, margin: '-100px' });
  return <section id="decision" ref={ref} className="section proof-section" aria-labelledby="proof-heading"><div className="container"><motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65 }} className="proof-header"><span className="eyebrow">Built around the work</span><h2 id="proof-heading">A decision engine that respects <span className="gradient-text">your operating reality.</span></h2></motion.div><div className="proof-grid">{principles.map(([title, copy], index) => <motion.article key={title} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.12 }} className="proof-card glass-card"><span className="proof-index">0{index + 1}</span><h3>{title}</h3><p>{copy}</p><div className="proof-line" /></motion.article>)}</div></div></section>;
}
