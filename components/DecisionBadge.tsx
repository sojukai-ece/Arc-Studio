'use client';

import { QuoteDecision } from '@/lib/types';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export function DecisionBadge({ decision }: { decision: QuoteDecision }) {
  const configs = {
    accept: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    negotiate: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    decline: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
  };

  const config = configs[decision.decision];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.border}`}>
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className={`font-semibold uppercase tracking-wider text-sm ${config.color}`}>
        {decision.decision}
      </span>
      <span className="text-zinc-500 text-sm ml-2">
        {Math.round(decision.confidence * 100)}% confidence
      </span>
    </div>
  );
}