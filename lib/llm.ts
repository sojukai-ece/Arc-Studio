// This calls your local Ollama instance. All data stays offline.
export async function analyzeWithLocalLLM(
  inquiryText: string,
  context: string
): Promise<{ scope: string; hours: number; urgency: string }> {
  const prompt = `You are a business intake analyst. Extract from this client inquiry:
1. Project scope (brief)
2. Estimated hours (number)
3. Urgency level (low/normal/high/rush)

Inquiry: "${inquiryText}"

Context about my business: ${context}

Respond ONLY in JSON: {"scope": "...", "hours": number, "urgency": "..."}`;

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2', // or mistral, phi3, etc.
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    const data = await res.json();
    return JSON.parse(data.response);
  } catch (e) {
    // Fallback if Ollama isn't running
    console.warn('Local LLM unavailable, using heuristic parser');
    return fallbackParse(inquiryText);
  }
}

function fallbackParse(text: string) {
  const lower = text.toLowerCase();
  let urgency: 'low' | 'normal' | 'high' | 'rush' = 'normal';
  if (lower.includes('asap') || lower.includes('urgent') || lower.includes('tomorrow')) urgency = 'rush';
  else if (lower.includes('soon') || lower.includes('next week')) urgency = 'high';
  
  const hours = Math.ceil(text.length / 200); // naive heuristic
  
  return {
    scope: text.slice(0, 100),
    hours: Math.max(hours, 2),
    urgency,
  };
}