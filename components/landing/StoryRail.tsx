'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

const chapters = [
  { label: 'Signal', at: 0.04 },
  { label: 'System', at: 0.3 },
  { label: 'Decision', at: 0.58 },
  { label: 'Deploy', at: 0.85 },
];

export function StoryRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <aside className="story-rail" aria-label="Page progress"><div className="story-rail__label">Story mode</div><div className="story-rail__track" aria-hidden="true"><motion.span className="story-rail__progress" style={{ scaleY }} /></div><div className="story-rail__chapters">{chapters.map((chapter) => <a key={chapter.label} href={`#${chapter.label.toLowerCase()}`} className="story-rail__chapter"><span>{chapter.label}</span><small>{String(Math.round(chapter.at * 100)).padStart(2, '0')}</small></a>)}</div></aside>;
}
