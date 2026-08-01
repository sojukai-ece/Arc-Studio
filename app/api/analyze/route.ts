import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithLocalLLM } from '@/lib/llm';

export async function POST(req: NextRequest) {
  const { inquiryText, businessContext } = await req.json();
  
  const analysis = await analyzeWithLocalLLM(inquiryText, businessContext);
  
  return NextResponse.json(analysis);
}