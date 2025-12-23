import { create } from 'zustand';
import type { Service, Barber } from './data';

interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  setStep: (step: number) => void;
  setService: (service: Service | null) => void;
  setBarber: (barber: Barber | null) => void;
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  setCustomerInfo: (info: Partial<BookingState['customerInfo']>) => void;
  reset: () => void;
  canProceed: () => boolean;
}

const initialCustomerInfo = {
  name: '',
  email: '',
  phone: '',
  notes: '',
};

export const useBookingStore = create<BookingState>((set, get) => ({
  step: 1,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  customerInfo: initialCustomerInfo,

  setStep: (step) => set({ step }),
  
  setService: (service) => set({ selectedService: service }),
  
  setBarber: (barber) => set({ selectedBarber: barber }),
  
  setDate: (date) => set({ selectedDate: date, selectedTime: null }),
  
  setTime: (time) => set({ selectedTime: time }),
  
  setCustomerInfo: (info) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    })),

  reset: () =>
    set({
      step: 1,
      selectedService: null,
      selectedBarber: null,
      selectedDate: null,
      selectedTime: null,
      customerInfo: initialCustomerInfo,
    }),

  canProceed: () => {
    const state = get();
    switch (state.step) {
      case 1:
        return state.selectedService !== null;
      case 2:
        return state.selectedBarber !== null;
      case 3:
        return state.selectedDate !== null && state.selectedTime !== null;
      case 4:
        return (
          state.customerInfo.name.trim() !== '' &&
          state.customerInfo.email.trim() !== '' &&
          state.customerInfo.phone.trim() !== ''
        );
      default:
        return false;
    }
  },
}));
