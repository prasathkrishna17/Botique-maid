"use client";

import { useState } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft } from "lucide-react"; 

// --- COMPONENTS ---
import BookingProgressBar from "@/components/booking/BookingProgressBar"; 
import InstantQuoteStep from "@/components/booking/InstantQuoteStep";
import FinalizeBookingStep from "@/components/booking/FinalizeBookingStep";
import ConfirmationStep from "@/components/booking/ConfirmationStep";

export default function BookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { step, setStep } = useBookingStore();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setStep(1); 
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className="
        gap-0 p-0 border-0 shadow-2xl bg-white
        [&>button]:hidden 
        
        /* --- LAYOUT STRUCTURE (Fixes Scrolling) --- */
        flex flex-col
        overflow-hidden

        /* --- MOBILE SIZING --- */
        w-[95vw] max-w-[95vw] 
        h-[90vh] 
        rounded-xl
        
        /* --- DESKTOP SIZING --- */
        md:w-[60vw] md:max-w-[900px] 
        md:h-[85vh] 
      ">
        
        {/* --- 1. STICKY HEADER --- */}
        <div className="relative flex items-center justify-center py-4 border-b border-gray-100 bg-white shrink-0 z-20 min-h-[70px]">
           
           {/* Back Button (Left) */}
           {step > 1 && step < 3 && (
             <div className="absolute left-4 top-1/2 -translate-y-1/2">
               <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={() => setStep(step - 1)} 
                 className="h-9 w-9 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full"
               >
                 <ChevronLeft className="h-6 w-6" />
               </Button>
             </div>
           )}

           {/* Progress Bar (Center) */}
           <div className="w-full px-12 md:px-0 flex justify-center">
              <BookingProgressBar currentStep={step} />
           </div>

           {/* Close Button (Right) */}
           <div className="absolute right-4 top-1/2 -translate-y-1/2">
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setOpen(false)} 
               className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-full"
             >
               <X className="h-6 w-6" />
             </Button>
           </div>
           
           {/* Hidden Title for Accessibility */}
           <DialogTitle className="sr-only">Booking Step {step}</DialogTitle>
        </div>

        {/* --- 2. SCROLLABLE CONTENT --- */}
        <div 
           /* KEYBOARD SUPPORT: Makes div focusable so arrow keys work */
           tabIndex={0}         
           className="
             flex-1             /* Takes up all remaining height */
             min-h-0            /* CRITICAL FIX: Allows scrolling within Flexbox */
             overflow-y-auto    /* Enables vertical scrolling */
             p-4 md:p-8 
             outline-none       /* Removes blue focus border */
             
             /* HIDE SCROLLBARS (Cross-Browser) */
             [&::-webkit-scrollbar]:hidden 
             [-ms-overflow-style:none] 
             [scrollbar-width:none]
           "
        >
           <div className="mx-auto w-full max-w-4xl pb-10">
              {step === 1 && <InstantQuoteStep />}
              {step === 2 && <FinalizeBookingStep />}
              {step === 3 && <ConfirmationStep />}
           </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}