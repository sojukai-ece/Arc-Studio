'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const views = {
  margin: { label: 'Margin map', score: '82%', title: 'Healthy margin. Quote with confidence.', detail: 'The scope clears your minimum profit threshold and leaves room for the unexpected.', rows: [['Labor', '$1,280', '33%'], ['Production', '$720', '18%'], ['Profit reserve', '$1,150', '29%']] },
  capacity: { label: 'Capacity map', score: '68%', title: 'One clean slot remains this week.', detail: 'The job fits your schedule without compressing prep time or recovery between commitments.', rows: [['Travel window', '1.2 hrs', 'Clear'], ['Prep buffer', '4.0 hrs', 'Safe'], ['Calendar load', '68%', 'Balanced']] },
  risk: { label: 'Risk map', score: 'Low', title: 'The scope is clear enough to pursue.', detail: 'Only one decision variable needs confirmation before you send the proposal.', rows: [['Scope clarity', 'High', 'Verified'], ['Payment terms', 'Net 14', 'Normal'], ['Revision risk', 'Low', 'Covered']] },
} as const;
type View = keyof typeof views;

export function CommandCenter() {
  const [active, setActive] = useState<View>('margin');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const current = views[active];
  return <section id="system" ref={ref} className="section command-section" aria-labelledby="command-heading"><div className="container command-grid"><motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65 }}><span className="eyebrow">One local command center</span><h2 id="command-heading" className="command-heading">Know the reason behind every <span className="gradient-text">yes, no, and not yet.</span></h2><p className="command-intro">Arc.Studio turns the information you already have into a recommendation you can inspect. There is no black box and no remote account between you and the work.</p><div className="command-points">{[['Source-aware', 'Trace every recommendation back to the signal that shaped it.'], ['Calibrated to you', 'Set your own floor, pace, capacity, and profit goals.'], ['Ready to send', 'Turn a decision into a clear proposal or a graceful decline.']].map(([title, text], index) => <div className="command-point" key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{text}</p></div>)}</div></motion.div><motion.div initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.75, delay: 0.14 }} className="command-console glass-card"><div className="console-topline"><span className="console-pulse" /> LOCAL DECISION ENGINE <span>SYNCED</span></div><div className="console-tabs" role="tablist" aria-label="Decision views">{(Object.keys(views) as View[]).map((view) => <button key={view} type="button" role="tab" aria-selected={active === view} onClick={() => setActive(view)} className={active === view ? 'is-active' : ''}>{views[view].label}</button>)}</div><div className="console-body"><div className="console-score"><span>Decision confidence</span><strong>{current.score}</strong><div><i style={{ width: active === 'margin' ? '82%' : active === 'capacity' ? '68%' : '36%' }} /></div></div><div className="console-decision"><span>Recommended move</span><h3>{current.title}</h3><p>{current.detail}</p></div><div className="console-rows">{current.rows.map(([label, value, state]) => <div key={label}><span>{label}</span><strong>{value}</strong><em>{state}</em></div>)}</div></div><div className="console-footer"><span>Last modeled just now</span><button type="button">Open decision brief <span>↗</span></button></div></motion.div></div></section>;
}
