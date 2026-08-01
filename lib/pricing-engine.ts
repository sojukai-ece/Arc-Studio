import { ClientInquiry, Booking, OperationalCosts, QuoteDecision } from './types';
import { parseISO, isSameMonth, addMonths, differenceInDays } from 'date-fns';

export function calculateQuoteDecision(
  inquiry: ClientInquiry,
  bookings: Booking[],
  costs: OperationalCosts
): QuoteDecision {
  // Schedule density analysis
  const targetMonth = parseISO(inquiry.dateRequested);
  const monthBookings = bookings.filter((b) =>
    isSameMonth(parseISO(b.date), targetMonth)
  );
  
  const currentMonthHours = monthBookings.reduce((sum, b) => sum + b.hours, 0);
  const maxCapacity = 160; // 40hr weeks
  const currentLoad = Math.min(currentMonthHours / maxCapacity, 1);
  const postBookingLoad = Math.min(
    (currentMonthHours + inquiry.estimatedHours) / maxCapacity,
    1
  );

  // Seasonal demand multiplier
  const month = targetMonth.getMonth();
  const seasonalMultipliers = [0.8, 0.85, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 1.1, 0.9, 0.85];
  const seasonalMultiplier = seasonalMultipliers[month];

  // Urgency premium
  const urgencyMultipliers = { low: 1.0, normal: 1.1, high: 1.25, rush: 1.5 };
  const urgencyMultiplier = urgencyMultipliers[inquiry.urgency];

  // Cost calculation
  const variableCost = 
    inquiry.estimatedHours * costs.hourlyRate +
    costs.travelPerJob +
    (inquiry.estimatedHours * 0.3) * costs.editingHourlyRate; // 30% editing time
  
  const monthlyFixedAllocation = costs.fixedMonthly / 4; // per week approx
  const totalCost = variableCost + monthlyFixedAllocation;

  // Base price with margins
  const targetMargin = 0.4; // 40%
  const basePrice = totalCost / (1 - targetMargin);
  
  // Final recommended price
  const recommendedPrice = Math.round(
    basePrice * seasonalMultiplier * urgencyMultiplier
  );
  
  const minimumViablePrice = Math.round(totalCost * 1.15); // 15% minimum margin

  // Decision logic
  let decision: 'accept' | 'negotiate' | 'decline' = 'accept';
  let burnoutRisk: 'low' | 'medium' | 'high' = 'low';
  const riskFactors: string[] = [];

  if (postBookingLoad > 0.9) {
    burnoutRisk = 'high';
    riskFactors.push('Schedule approaching capacity');
    decision = 'decline';
  } else if (postBookingLoad > 0.75) {
    burnoutRisk = 'medium';
    riskFactors.push('Heavy month ahead');
  }

  if (inquiry.urgency === 'rush' && currentLoad > 0.6) {
    riskFactors.push('Rush job during busy period');
    decision = 'negotiate';
  }

  if (recommendedPrice < minimumViablePrice * 1.2) {
    riskFactors.push('Thin margin on this scope');
  }

  // Historical pricing context
  const similarBookings = bookings.filter(
    (b) => Math.abs(differenceInDays(parseISO(b.date), targetMonth)) < 90
  );
  const avgSimilarRevenue = similarBookings.length
    ? similarBookings.reduce((s, b) => s + b.revenue, 0) / similarBookings.length
    : recommendedPrice;

  if (recommendedPrice < avgSimilarRevenue * 0.8) {
    riskFactors.push('Priced below recent comparable jobs');
  }

  const confidence = Math.max(
    0.5,
    1 - (riskFactors.length * 0.15) - (burnoutRisk === 'high' ? 0.2 : 0)
  );

  const reasoning = generateReasoning(
    decision,
    recommendedPrice,
    burnoutRisk,
    seasonalMultiplier,
    urgencyMultiplier
  );

  return {
    inquiryId: inquiry.id,
    recommendedPrice,
    minimumViablePrice,
    confidence,
    decision,
    reasoning,
    riskFactors,
    scheduleImpact: {
      currentLoad: Math.round(currentLoad * 100) / 100,
      postBookingLoad: Math.round(postBookingLoad * 100) / 100,
      burnoutRisk,
    },
  };
}

function generateReasoning(
  decision: string,
  price: number,
  burnoutRisk: string,
  seasonal: number,
  urgency: number
): string {
  const parts = [];
  if (decision === 'decline') {
    parts.push('Decline this inquiry to protect schedule capacity.');
  } else if (decision === 'negotiate') {
    parts.push('Accept only at premium pricing due to tight timeline.');
  } else {
    parts.push('Healthy margin and schedule fit. Proceed with confidence.');
  }
  
  parts.push(`Seasonal factor: ${seasonal}x. Urgency premium: ${urgency}x.`);
  
  if (burnoutRisk !== 'low') {
    parts.push(`Burnout risk: ${burnoutRisk}.`);
  }
  
  return parts.join(' ');
}