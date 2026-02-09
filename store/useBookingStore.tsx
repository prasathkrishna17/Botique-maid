import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Update the Type Definition
interface BookingFormData {
  id?: string | number; // <--- ADD THIS LINE
  
  postalCode?: string;
  propertyType?: string;
  // ... (keep your other fields)
  city?: string;
  bedrooms?: string;
  bathrooms?: string;
  frequency?: string;
  cleaningType?: string;
  addOns?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  unit?: string;
  province?: string;
  specialInstructions?: string;
  paymentMethod?: string;
}

interface BookingStore {
  step: number;
  anchors: any; // or your specific type
  formData: BookingFormData;
  setStep: (step: number) => void;
  setAnchors: (anchors: any) => void;
  updateFormData: (data: Partial<BookingFormData>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      step: 1,
      anchors: null,
      formData: {}, // Initial empty state

      setStep: (step) => set({ step }),
      setAnchors: (anchors) => set({ anchors }),
      
      // 2. Ensure this merges correctly
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetBooking: () => set({ step: 1, anchors: null, formData: {} }),
    }),
    {
      name: "booking-storage", // local storage key
    }
  )
);