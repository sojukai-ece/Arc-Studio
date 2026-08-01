export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  scope: string;
  dateRequested: string;
  estimatedHours: number;
  urgency: 'low' | 'normal' | 'high' | 'rush';
  deliverables: string[];
  budgetHint?: string;
  receivedAt: string;
}

export interface Booking {
  id: string;
  clientName: string;
  date: string;
  hours: number;
  revenue: number;
  costs: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  type: string;
}

export interface OperationalCosts {
  hourlyRate: number;
  fixedMonthly: number;
  equipmentDepreciation: number;
  travelPerJob: number;
  editingHourlyRate: number;
}

export interface QuoteDecision {
  inquiryId: string;
  recommendedPrice: number;
  minimumViablePrice: number;
  confidence: number;
  decision: 'accept' | 'negotiate' | 'decline';
  reasoning: string;
  riskFactors: string[];
  scheduleImpact: {
    currentLoad: number; // 0-1
    postBookingLoad: number;
    burnoutRisk: 'low' | 'medium' | 'high';
  };
}

export interface AppState {
  inquiries: ClientInquiry[];
  bookings: Booking[];
  costs: OperationalCosts;
  decisions: QuoteDecision[];
  addInquiry: (i: ClientInquiry) => void;
  setBookings: (b: Booking[]) => void;
  setCosts: (c: OperationalCosts) => void;
  setDecisions: (d: QuoteDecision[]) => void;
}