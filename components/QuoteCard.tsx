'use client';

import { QuoteDecision } from '@/lib/types';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';

export function QuoteCard({ decision }: { decision: QuoteDecision }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          Quote Recommendation
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Recommended</p>
          <p className="text-2xl font-bold text-emerald-400">${decision.recommendedPrice}</p>
        </div>
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Floor Price</p>
          <p className="text-2xl font-bold text-zinc-300">${decision.minimumViablePrice}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <TrendingUp className="w-4 h-4" />
          <span>Schedule load: {(decision.scheduleImpact.postBookingLoad * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Shield className="w-4 h-4" />
          <span>Burnout risk: {decision.scheduleImpact.burnoutRisk}</span>
        </div>
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed">{decision.reasoning}</p>

      {decision.riskFactors.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3">
          <p className="text-rose-400 text-xs font-semibold uppercase mb-2">Risk Factors</p>
          <ul className="space-y-1">
            {decision.riskFactors.map((risk, i) => (
              <li key={i} className="text-rose-300 text-sm flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}