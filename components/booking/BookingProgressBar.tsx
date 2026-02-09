"use client";

import { Check } from "lucide-react";

interface BookingProgressBarProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: "Instant Quote" },
  { id: 2, label: "Finalize Booking" },
  { id: 3, label: "Confirmation" },
];

export default function BookingProgressBar({ currentStep }: BookingProgressBarProps) {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="inline-flex items-center bg-slate-100 rounded-full p-2 px-6 shadow-sm border border-slate-200">
        
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.id} className="flex items-center">
              
              {/* STEP ITEM */}
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${isActive || isCompleted ? "opacity-100" : "opacity-40"}`}>
                
                {/* ICON CIRCLE */}
                <div
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-300 flex-shrink-0
                    ${(isCompleted || isActive)
                      ? "bg-black text-white" 
                      : "bg-slate-300 text-slate-600"}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>

                {/* LABEL */}
                {/* Logic: Always show on Desktop. On Mobile, hide label if it's a future step to save space. */}
                <span 
                  className={`
                    text-xs md:text-sm font-bold whitespace-nowrap
                    ${isActive ? "text-black" : "text-slate-500"}
                    ${!isActive && !isCompleted ? "hidden md:block" : "block"} 
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* SEPARATOR (Arrow) */}
              {!isLast && (
                // Fixed width (w-8) prevents the arrow from squishing or overlapping
                <div className="w-8 md:w-12 flex justify-center text-slate-300 text-[10px]">
                  ❯
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}