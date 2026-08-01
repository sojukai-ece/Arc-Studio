'use client';

import { useAppStore } from '@/lib/store';
import { InquiryFeed } from './InquiryFeed';
import { QuoteCard } from './QuoteCard';
import { ScheduleDensity } from './ScheduleDensity';
import { DecisionBadge } from './DecisionBadge';
import { Brain, Lock, WifiOff } from 'lucide-react';

export function Dashboard() {
  const decisions = useAppStore((s) => s.decisions);
  const latestDecision = decisions[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Arc.Studio</h1>
          </div>
          <p className="text-zinc-500 text-sm">The Offline Service Strategist</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-900/50">
            <WifiOff className="w-3 h-3" />
            Local AI Active
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
            <Lock className="w-3 h-3" />
            End-to-End Encrypted
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <InquiryFeed />
        </div>
        
        <div className="lg:col-span-8 space-y-6">
          {latestDecision ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-200">Decision for Latest Inquiry</h2>
                <DecisionBadge decision={latestDecision} />
              </div>
              <QuoteCard decision={latestDecision} />
            </>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
              <Brain className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Submit a client inquiry to generate your first AI-powered decision.</p>
            </div>
          )}
          
          <ScheduleDensity />
        </div>
      </main>
    </div>
  );
}