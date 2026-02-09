"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDebounce } from "use-debounce";
import { useBookingStore } from "@/store/useBookingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Added FormMessage
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// --- STYLES ---
const INPUT_STYLE = "h-12 border-2 border-slate-300 focus:border-black focus:ring-0 text-base font-medium rounded-md bg-white px-3";
const LABEL_STYLE = "text-sm md:text-base font-bold text-slate-900 mb-1.5 block";
const FREQUENCY_OPTIONS = [
  { label: "One-time", value: "one-time", discount: null },
  { label: "Weekly", value: "weekly", discount: "SAVE 20%" },
  { label: "Bi-weekly", value: "biweekly", discount: "SAVE 15%" },
  { label: "Monthly", value: "monthly", discount: "SAVE 10%" },
];

// --- STRICT REGEX PER REQUIREMENTS (Section 5.1) ---
const POSTAL_REGEX = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;

const formSchema = z.object({
  postalCode: z.string().regex(POSTAL_REGEX, {
    message: "Please enter a valid Canadian postal code (e.g., M1J 2L5)." // Exact text from Req 5.1
  }),
  propertyType: z.enum(["condo", "house", "townhome"]),
  bedrooms: z.string(),
  bathrooms: z.string(),
  frequency: z.enum(["one-time", "weekly", "biweekly", "monthly"]),
  cleaningType: z.enum(["regular", "deep", "move"]).optional(),
  addOns: z.string().optional(),
});

export default function InstantQuoteStep() {
  const { setStep, setAnchors, updateFormData, anchors } = useBookingStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postalCode: "",
      propertyType: "condo",
      bedrooms: "1",
      bathrooms: "1",
      frequency: "one-time",
      cleaningType: "regular",
      addOns: "none",
    },
  });

  const postalValue = form.watch("postalCode");
  const [debouncedPostal] = useDebounce(postalValue, 500);

  // --- AUTO-FORMATTING LOGIC (Section 5.1) ---
  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 6);
    // Reinsert space after 3rd char
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)} ${raw.slice(3)}` : raw;
    onChange(formatted);
  };
  
  // --- TIER LOOKUP (Section 5.3) ---
  useEffect(() => {
    const checkTier = async () => {
      // 1. Check strict regex first
      if (!POSTAL_REGEX.test(debouncedPostal)) return;

      // 2. Mock Lookup (Replace with real API call later)
      // Section 5.3: Lookup FSA only
      const fsa = debouncedPostal.slice(0, 3);
      if (fsa) { 
        setAnchors({ city: "Toronto", tier: "Tier 1", lockedAt: Date.now() }); 
        // If invalid, we would show: "Sorry — we don’t currently service this area."
      }
    };
    checkTier();
  }, [debouncedPostal]);

  const onSubmit = (values: any) => {
    // Final check before proceeding
    if (!anchors) {
       toast.error("Please enter a valid postal code to proceed.");
       return;
    }
    updateFormData(values);
    setStep(2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 text-left pt-2">
        
        {/* 1. POSTAL CODE (With Error Message) */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
            <label className="text-lg font-bold text-slate-900 whitespace-nowrap">Postal Code</label>
            <div className="w-[180px]">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input 
                        placeholder="M5V 2H1"
                        className="h-12 border-2 border-black bg-white text-center text-xl font-bold uppercase tracking-widest rounded-md focus-visible:ring-0 focus-visible:border-black placeholder:text-slate-300 shadow-sm"
                        maxLength={7}
                        {...field}
                        onChange={(e) => handlePostalChange(e, field.onChange)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Explicit Error Message Location */}
          <div className="px-1">
             <FormField name="postalCode" render={() => <FormMessage className="text-red-600 font-medium" />} />
          </div>
        </div>

        {/* 2. HOME DETAILS */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900">Home Details</h3>
          <div className="grid grid-cols-3 gap-3">
             <FormField control={form.control} name="propertyType" render={({ field }) => (
                <FormItem><FormLabel className={LABEL_STYLE}>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={INPUT_STYLE}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="condo">Condo</SelectItem><SelectItem value="house">House</SelectItem><SelectItem value="townhome">Town</SelectItem></SelectContent></Select></FormItem>
             )} />
             <FormField control={form.control} name="bedrooms" render={({ field }) => (
                <FormItem><FormLabel className={LABEL_STYLE}>Bedrooms</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={INPUT_STYLE}><SelectValue /></SelectTrigger></FormControl><SelectContent>{[1,2,3,4,5,6].map(n=><SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent></Select></FormItem>
             )} />
             <FormField control={form.control} name="bathrooms" render={({ field }) => (
                <FormItem><FormLabel className={LABEL_STYLE}>Bathrooms</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={INPUT_STYLE}><SelectValue /></SelectTrigger></FormControl><SelectContent>{[1,2,3,4,5,6].map(n=><SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent></Select></FormItem>
             )} />
          </div>
        </div>

        {/* 3. SCHEDULE */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900">Schedule</h3>
          <FormField control={form.control} name="frequency" render={({ field }) => (
             <FormItem>
               <div className="grid grid-cols-2 gap-3">
                 {FREQUENCY_OPTIONS.map((option) => {
                   const isSelected = field.value === option.value;
                   return (
                     <div key={option.value} onClick={() => field.onChange(option.value)} className={`cursor-pointer relative flex flex-col items-center justify-center h-16 rounded-md border-2 transition-all duration-200 ${isSelected ? "border-black bg-black text-white shadow-md transform scale-[1.02]" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"}`}>
                       <span className={`text-sm md:text-base font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{option.label}</span>
                       {option.discount && <span className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 px-1.5 py-0.5 rounded ${isSelected ? "bg-white text-black" : "bg-black text-white"}`}>{option.discount}</span>}
                     </div>
                   );
                 })}
               </div>
             </FormItem>
          )} />
        </div>

        {/* 4. EXTRAS (Hidden if Recurring per Requirement 8.5 logic applied here visually) */}
        {form.watch('frequency') === 'one-time' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-bold text-slate-900">Extras</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="cleaningType" render={({ field }) => (
                  <FormItem><FormLabel className={LABEL_STYLE}>Service</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={INPUT_STYLE}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="regular">Standard</SelectItem><SelectItem value="deep">Deep Clean</SelectItem><SelectItem value="move">Move In/Out</SelectItem></SelectContent></Select></FormItem>
              )} />
              <FormField control={form.control} name="addOns" render={({ field }) => (
                  <FormItem><FormLabel className={LABEL_STYLE}>Add-Ons</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={INPUT_STYLE}><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="appliances">Appliances</SelectItem><SelectItem value="windows">Windows</SelectItem></SelectContent></Select></FormItem>
              )} />
            </div>
          </div>
        )}

        {/* 5. BUTTON */}
        <Button type="submit" className="w-full h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white mt-6 rounded-md shadow-lg transition-transform hover:scale-[1.01]">See Your Price</Button>

      </form>
    </Form>
  );
}