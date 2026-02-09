"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CreditCard, Banknote, MessageSquare, Tag } from "lucide-react";
import { toast } from "sonner";
import { useBookingStore } from "@/store/useBookingStore";
import { usePricing } from "@/hooks/usePricing";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Helper to format phone as ###-###-####
const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

export default function FinalizeBookingStep() {
  const { anchors, formData: step1Data, setStep, updateFormData } = useBookingStore();
  const pricing = usePricing(); 
  const [loading, setLoading] = useState(false);

  // LOGIC: Check if Unit is required (Condo/Townhome)
  const isUnitRequired = ["condo", "townhome"].includes(step1Data.propertyType || "");
  
  // LOGIC: Check if Recurring (Hide Coupon)
  const isRecurring = step1Data.frequency !== "one-time";

  // --- VALIDATION SCHEMA ---
  const finalizeSchema = z.object({
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(12, "Invalid format (###-###-####)"), // 10 digits + 2 dashes
    
    street1: z.string().min(5, "Required"),
    street2: z.string().optional(),
    // Conditional Validation for Unit
    unit: isUnitRequired ? z.string().min(1, "Unit # is required for Condos/Townhomes") : z.string().optional(),
    
    city: z.string().min(2, "Required"),
    province: z.literal("Ontario"),
    postalCode: z.string(),

    discountCode: z.string().optional(),
    specialInstructions: z.string().optional(),
    paymentMethod: z.enum(["credit_card", "etransfer"], {
      required_error: "Please select a payment method",
    }),
    
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
  });

  const form = useForm<z.infer<typeof finalizeSchema>>({
    resolver: zodResolver(finalizeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street1: "",
      street2: "",
      unit: "",
      city: anchors?.city || "Toronto", 
      province: "Ontario",
      postalCode: step1Data.postalCode || anchors?.postal_code || "",
      discountCode: "",
      specialInstructions: "",
      paymentMethod: "credit_card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: string) => void) => {
    onChange(formatPhone(e.target.value));
  };

  const onSubmit = async (values: z.infer<typeof finalizeSchema>) => {
    setLoading(true);

    try {
      // 1. Prepare Data for API
      const fullCustomerData = {
        customer: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
        address: {
          street1: values.street1,
          street2: values.street2,
          unit: values.unit,
          city: values.city,
          province: values.province,
          postalCode: values.postalCode,
        },
        service: {
          ...step1Data, 
          specialInstructions: values.specialInstructions,
        },
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discountAmount,
          hst: pricing.hst,
          total: pricing.total,
        },
        payment: {
          method: values.paymentMethod,
        }
      };

      console.log("🚀 SENDING TO SERVER:", fullCustomerData);

      // 2. Call API
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullCustomerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      const result = await response.json();
      console.log("✅ SERVER RESPONSE:", result);

      // 3. SUCCESS! Save ID to Store so Confirmation Page can see it
      updateFormData({
        ...values,
        id: result.bookingId // <--- CRITICAL FIX: Save the Real ID
      }); 
      
      toast.success("Booking confirmed!", { description: `Ref: ${result.bookingId}` });
      setStep(3); 

    } catch (error: any) {
      console.error("❌ SUBMIT ERROR:", error);
      toast.error("Booking failed. Please try again.", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* --- 1. DETAILS --- */}
            <div className="space-y-4">
               <h3 className="text-lg font-bold text-slate-900">Contact Info</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="firstName" render={({ field }) => (
                   <FormItem><FormControl><Input placeholder="First Name" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
                 <FormField control={form.control} name="lastName" render={({ field }) => (
                   <FormItem><FormControl><Input placeholder="Last Name" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* PHONE WITH AUTO-FORMAT */}
                 <FormField control={form.control} name="phone" render={({ field }) => (
                   <FormItem>
                     <FormControl>
                       <Input 
                         placeholder="Phone (e.g. 416-555-0199)" 
                         className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black" 
                         {...field}
                         onChange={(e) => handlePhoneChange(e, field.onChange)}
                         maxLength={12}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )} />
                 <FormField control={form.control} name="email" render={({ field }) => (
                   <FormItem><FormControl><Input placeholder="Email Address" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
               </div>
            </div>

            {/* --- 2. ADDRESS --- */}
            <div className="space-y-4">
               <h3 className="text-lg font-bold text-slate-900">Address</h3>
               <FormField control={form.control} name="street1" render={({ field }) => (
                 <FormItem><FormControl><Input placeholder="Street Address" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black" {...field} /></FormControl><FormMessage /></FormItem>
               )} />
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* DYNAMIC UNIT FIELD */}
                  <FormField control={form.control} name="unit" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={isUnitRequired ? "Unit # (Required)" : "Unit # (Optional)"} 
                          className={`h-12 border-2 focus-visible:ring-0 focus-visible:border-black ${isUnitRequired ? "border-slate-400" : ""}`} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="City" className="h-12 border-2 bg-slate-50" {...field} readOnly /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="postalCode" render={({ field }) => (
                    <FormItem><FormControl><Input {...field} readOnly className="h-12 border-2 bg-slate-50 font-bold" /></FormControl></FormItem>
                  )} />
               </div>
            </div>

            {/* --- 3. DISCOUNT (HIDDEN IF RECURRING) --- */}
            {!isRecurring && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Discount Code
                </h3>
                <div className="flex gap-2">
                  <FormField control={form.control} name="discountCode" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl><Input placeholder="Enter Coupon" className="h-12 uppercase focus-visible:ring-0 focus-visible:border-black" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <Button type="button" variant="secondary" className="h-12 px-6 bg-slate-800 text-white">Apply</Button>
                </div>
              </div>
            )}

            <Separator />

            {/* --- 4. SPECIAL INSTRUCTIONS --- */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Special Instructions
              </h3>
              <FormField control={form.control} name="specialInstructions" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Buzz code 1234, Key under mat, Parking at back..." 
                      className="resize-none h-24 border-2 focus-visible:ring-0 focus-visible:border-black" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            {/* --- 5. PAYMENT METHOD --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Banknote className="h-5 w-5" /> Payment Method
              </h3>
              
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      {/* OPTION A: CREDIT CARD */}
                      <FormItem className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'credit_card' ? 'border-black bg-slate-50' : 'border-slate-200'}`}>
                        <div className="flex items-center space-x-3">
                          <FormControl><RadioGroupItem value="credit_card" /></FormControl>
                          <FormLabel className="font-bold cursor-pointer flex items-center gap-2 w-full">
                             <CreditCard className="h-4 w-4" /> Credit Card
                          </FormLabel>
                        </div>
                        {paymentMethod === 'credit_card' && (
                          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                             <FormField control={form.control} name="cardNumber" render={({ field }) => (
                               <FormItem><FormControl><Input placeholder="0000 0000 0000 0000" className="h-12 bg-white" {...field} /></FormControl></FormItem>
                             )} />
                             <div className="grid grid-cols-2 gap-3">
                               <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                                 <FormItem><FormControl><Input placeholder="MM / YY" className="h-12 bg-white" {...field} /></FormControl></FormItem>
                               )} />
                               <FormField control={form.control} name="cardCvc" render={({ field }) => (
                                 <FormItem><FormControl><Input placeholder="CVC" className="h-12 bg-white" {...field} /></FormControl></FormItem>
                               )} />
                             </div>
                          </div>
                        )}
                      </FormItem>

                      {/* OPTION B: E-TRANSFER */}
                      <FormItem className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'etransfer' ? 'border-black bg-slate-50' : 'border-slate-200'}`}>
                        <div className="flex items-center space-x-3">
                          <FormControl><RadioGroupItem value="etransfer" /></FormControl>
                          <FormLabel className="font-bold cursor-pointer w-full">Pay Later (E-Transfer)</FormLabel>
                        </div>
                        {paymentMethod === 'etransfer' && (
                          <div className="mt-2 text-sm text-slate-600 pl-7">
                            You will receive payment instructions via email. Payment is due 24h before cleaning.
                          </div>
                        )}
                      </FormItem>
                      
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3 h-14 text-base font-bold border-2">
                Back
              </Button>
              <Button type="submit" className="w-2/3 h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  "COMPLETE BOOKING"
                )}
              </Button>
            </div>

          </form>
        </Form>
    </div>
  );
}