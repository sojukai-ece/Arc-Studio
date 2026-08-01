'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ClientInquiry } from '@/lib/types';
import { calculateQuoteDecision } from '@/lib/pricing-engine';
import { Inbox, Send, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function InquiryFeed() {
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const { inquiries, addInquiry, bookings, costs, decisions, setDecisions } = useAppStore();

  const handleSubmit = async () => {
    if (!rawText.trim()) return;
    setAnalyzing(true);

    // Call local LLM for structured extraction
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inquiryText: rawText,
        businessContext: 'Event photography, $150/hr base rate, based in Austin TX',
      }),
    });
    
    const extracted = await res.json();

    const inquiry: ClientInquiry = {
      id: uuidv4(),
      name: extractName(rawText) || 'Unknown Client',
      email: extractEmail(rawText) || '',
      scope: extracted.scope,
      dateRequested: extractDate(rawText) || new Date().toISOString(),
      estimatedHours: extracted.hours,
      urgency: extracted.urgency,
      deliverables: [],
      receivedAt: new Date().toISOString(),
    };

    addInquiry(inquiry);
    
    const decision = calculateQuoteDecision(inquiry, bookings, costs);
    setDecisions([decision, ...decisions]);
    
    setRawText('');
    setAnalyzing(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Inbox className="w-5 h-5 text-zinc-400" />
        <h3 className="text-zinc-100 font-semibold">New Inquiry</h3>
      </div>
      
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste client email or inquiry text here..."
        className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none text-sm leading-relaxed"
      />
      
      <button
        onClick={handleSubmit}
        disabled={analyzing || !rawText.trim()}
        className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {analyzing ? 'Analyzing with Local AI...' : 'Analyze Inquiry'}
      </button>

      {inquiries.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Recent Inquiries</p>
          {inquiries.slice(0, 5).map((inq) => (
            <div key={inq.id} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm">
              <p className="text-zinc-300 font-medium truncate">{inq.name}</p>
              <p className="text-zinc-500 text-xs mt-1">{inq.scope.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Naive extractors (LLM handles the real work)
function extractName(text: string): string | null {
  const match = text.match(/(?:Hi|Hello|Hey)\s+([A-Z][a-z]+)/);
  return match?.[1] || null;
}

function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match?.[0] || null;
}

function extractDate(text: string): string | null {
  const match = text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?\b/);
  return match ? new Date(match[0] + ' 2024').toISOString() : null;
}