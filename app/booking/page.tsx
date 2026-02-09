"use client";

import { useBookingStore } from '@/store/useBookingStore';
import { Progress } from '@/components/ui/progress';
import InstantQuoteStep from '@/components/booking/InstantQuoteStep';
import FinalizeBookingStep from '@/components/booking/FinalizeBookingStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';
import QuoteSummary from '@/components/booking/QuoteSummary';

export default function BookingPage() {
  const { step } = useBookingStore();

  // Progress Bar Logic [cite: 58-60]:
  // Step 1: Quote (33%)
  // Step 2: Details (66%)
  // Step 3: Confirm (100%)
  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- PROGRESS BAR --- */}
        <div className="space-y-2 max-w-3xl mx-auto">
          <div className="flex justify-between text-sm font-medium text-gray-500">
            <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Quote</span>
            <span className={step >= 2 ? "text-primary font-bold" : ""}>2. Details</span>
            <span className={step >= 3 ? "text-primary font-bold" : ""}>3. Confirm</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Interaction Area (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="transition-all duration-300">
              
              {/* Step 1: Get Quote */}
              {step === 1 && <InstantQuoteStep />}
              
              {/* Step 2: Enter Details */}
              {step === 2 && <FinalizeBookingStep />}
              
              {/* Step 3: Success! */}
              {step === 3 && <ConfirmationStep />}
              
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Summary (1/3 width) */}
          {/* We hide the sidebar on Step 3 because the confirmation page has its own summary [cite: 114] */}
          {step !== 3 && (
            <div className="lg:col-span-1 hidden lg:block sticky top-6">
               <QuoteSummary />
            </div>
          )}

          {/* Mobile Helper Text (Only for Step 1 & 2) */}
          {step !== 3 && (
            <div className="lg:hidden block text-center text-sm text-muted-foreground">
               Scroll up to see your price breakdown.
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
}