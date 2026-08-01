import { create } from 'zustand';
import { AppState } from './types';

export const useAppStore = create<AppState>((set) => ({
  inquiries: [],
  bookings: [],
  costs: {
    hourlyRate: 150,
    fixedMonthly: 800,
    equipmentDepreciation: 200,
    travelPerJob: 50,
    editingHourlyRate: 75,
  },
  decisions: [],
  addInquiry: (inquiry) =>
    set((state) => ({ inquiries: [inquiry, ...state.inquiries] })),
  setBookings: (bookings) => set({ bookings }),
  setCosts: (costs) => set({ costs }),
  setDecisions: (decisions) => set({ decisions }),
}));