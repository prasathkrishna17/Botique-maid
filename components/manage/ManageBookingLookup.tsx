"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Loader2, Search, MapPin, CreditCard, AlertCircle, 
  Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, 
  ArrowRight, ShieldCheck, Lock
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"; 
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox"; 

// Stripe Imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "@/components/manage/StripePaymentForm";

// Initialize Stripe (Must be outside component)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- SCHEMAS ---
const lookupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  bookingRef: z.string().min(1, "Booking Reference is required"),
});

// --- MOCK DATA ---
const MOCK_SLOTS = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

export default function ManageBookingLookup() {
  const [loading, setLoading] = useState(false);
  
  // VIEW STATE: Defines which screen is visible
  const [view, setView] = useState<'lookup' | 'dashboard' | 'schedule' | 'summary' | 'payment'>('lookup');
  
  const [booking, setBooking] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Stripe Client Secret
  const [clientSecret, setClientSecret] = useState("");

  const form = useForm<z.infer<typeof lookupSchema>>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { email: "", bookingRef: "" },
  });

  // Helper: Is this a Reschedule or New Schedule?
  const isReschedule = booking?.service_date !== null && booking?.service_date !== undefined;

  // --- 1. LOOKUP BOOKING ---
  const onSubmit = async (values: z.infer<typeof lookupSchema>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/booking-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error || "Booking not found");
      
      setBooking(result.booking);
      setView('dashboard'); 
      toast.success("Booking found!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. PREPARE PAYMENT ---
  // Calculates Total (Mock calculation for demo - normally from DB)
  const total = booking ? parseFloat(booking.total_price) : 0;
  const hst = total - (total / 1.13); 
  const subtotal = total - hst;

  const handleProceedToPayment = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    
    setLoading(true);

    try {
      // Create Payment Intent on Backend to get Client Secret
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }), 
      });

      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      setView('payment'); // Go to Payment View

    } catch (error: any) {
      toast.error(error.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. PAYMENT SUCCESS HANDLER ---
  const handlePaymentSuccess = async () => {
    toast.success("Payment Successful!");

    // Update Booking in Database
    try {
      const response = await fetch('/api/reschedule-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          newDate: date?.toISOString(),
          newTime: selectedTime,
          status: 'confirmed'
        }),
      });
      
      const result = await response.json();
      setBooking(result.booking);
      setView('dashboard'); // Go back to Dashboard
      
      // Cleanup
      setClientSecret("");
      setSelectedTime(null);
      setDate(undefined);
      setTermsAccepted(false);
      
    } catch (error) {
      console.error("Failed to update booking after payment");
      toast.error("Payment received but booking update failed. Contact support.");
    }
  };

  // --- 4. CANCEL BOOKING ---
  const handleCancel = async () => {
    if(!confirm("Are you sure you want to cancel? This cannot be undone.")) return;
    setLoading(true);
    try {
      const response = await fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      toast.success("Booking Cancelled");
      setBooking({ ...booking, status: 'cancelled' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to handle back button logic
  const handleBack = () => {
    if (view === 'schedule') setView('dashboard');
    if (view === 'summary') setView('schedule');
    if (view === 'payment') setView('summary');
    if (view === 'dashboard') setView('lookup');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-slate-100 shadow-xl rounded-2xl overflow-hidden min-h-[600px] flex flex-col">
      
      {/* HEADER */}
      <div className="text-center py-6 px-6 bg-white border-b border-slate-50 relative shrink-0">
        {view !== 'lookup' && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black rounded-full hover:bg-slate-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
          {view === 'lookup' && "Manage Booking"}
          {view === 'dashboard' && "Booking Details"}
          {view === 'schedule' && (isReschedule ? "Reschedule" : "Schedule Service")}
          {view === 'summary' && "Review Service"}
          {view === 'payment' && "Secure Payment"}
        </h1>
      </div>

      {/* CONTENT AREA */}
      <div className="p-6 flex-1 flex flex-col">
        
        {/* --- VIEW 1: LOOKUP FORM --- */}
        {view === 'lookup' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col justify-center">
              <div className="text-center mb-2">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 border border-slate-200 mb-4 shadow-sm">
                   <Search className="h-7 w-7 text-slate-900" />
                </div>
                <p className="text-slate-500 font-medium text-sm px-4 leading-relaxed">
                  Enter the email and booking reference from your confirmation receipt.
                </p>
              </div>

              <div className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wide">Email Address</label>
                    <FormControl><Input placeholder="name@example.com" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="bookingRef" render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-wide">Booking Reference (ID)</label>
                    <FormControl><Input placeholder="e.g. 15" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black rounded-lg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white shadow-lg mt-4" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Find My Booking"}
              </Button>
            </form>
          </Form>
        )}

        {/* --- VIEW 2: DASHBOARD --- */}
        {view === 'dashboard' && booking && (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between items-start">
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{booking.cleaning_type} Clean</h2>
                   <p className="text-sm text-slate-500 font-medium mt-1">Ref: <span className="text-slate-900 font-bold">#{booking.id}</span></p>
                 </div>
                 <Badge className={`uppercase px-3 py-1.5 text-xs font-bold tracking-wide ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                   {booking.status}
                 </Badge>
              </div>

              <div className="space-y-5 border-2 rounded-xl p-5 border-slate-100 bg-slate-50/50">
                 <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-slate-900 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        {booking.street_address} {booking.unit_number && `#${booking.unit_number}`}<br/>
                        <span className="font-medium text-slate-500">{booking.city}, {booking.postal_code}</span>
                      </p>
                    </div>
                 </div>
                 <Separator className="bg-slate-200" />
                 <div className="flex items-start gap-4">
                    <CalendarIcon className="h-5 w-5 text-slate-900 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Schedule</p>
                      <p className="text-sm font-bold text-slate-900">
                        {booking.service_date ? format(new Date(booking.service_date), "MMMM dd, yyyy") : "Date Not Set"}
                      </p>
                      <p className="text-sm font-medium text-slate-500">{booking.service_time || "Time Not Set"}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-3 pt-2">
                {booking.status !== 'cancelled' ? (
                  <>
                    <Button onClick={() => setView('schedule')} className="w-full h-14 text-lg font-bold bg-black text-white shadow-md">
                      <CalendarIcon className="mr-2 h-5 w-5" /> {isReschedule ? "Reschedule" : "Schedule Service"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="w-full h-14 font-bold border-2 border-slate-200 text-slate-900 hover:text-red-600">
                      Cancel Booking
                    </Button>
                  </>
                ) : (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center text-sm font-bold border border-red-100">Booking Cancelled</div>
                )}
              </div>
           </div>
        )}

        {/* --- VIEW 3: SCHEDULE --- */}
        {view === 'schedule' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex-1 flex flex-col">
            <div className="flex justify-center border-2 border-slate-100 rounded-xl p-2 mb-6 shadow-sm bg-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </div>
            {date ? (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 flex-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <Clock className="h-4 w-4" /> Available Slots
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`text-xs font-bold py-3 px-2 rounded-lg border-2 transition-all ${selectedTime === time ? "bg-black text-white border-black shadow-lg" : "bg-white text-slate-600 border-slate-200"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="pt-4 mt-auto">
                  <Button onClick={() => setView('summary')} disabled={!selectedTime} className="w-full h-14 text-lg font-bold bg-black text-white shadow-lg">
                    Review Changes <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic">Select a date above.</div>
            )}
          </div>
        )}

        {/* --- VIEW 4: SUMMARY & CONFIRMATION --- */}
        {view === 'summary' && date && selectedTime && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 flex flex-col">
            
            <div className="bg-slate-50 border-2 border-slate-100 rounded-xl p-6 space-y-4">
               <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide text-sm">
                 <ShieldCheck className="h-5 w-5" /> Service Summary
               </h3>
               
               <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service</span>
                    <span className="font-bold text-slate-900 capitalize">{booking.cleaning_type} Clean</span>
                  </div>
                  <Separator />
                  
                  {isReschedule && (
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Old Date</span>
                       <span className="text-slate-400 line-through">
                         {booking.service_date ? format(new Date(booking.service_date), "MMM dd") : "N/A"}
                       </span>
                     </div>
                  )}

                  <div className="flex justify-between text-sm bg-green-50 p-2 -mx-2 rounded-md">
                    <span className="text-green-700 font-bold">{isReschedule ? "New Date" : "Scheduled Date"}</span>
                    <span className="font-black text-green-700">
                      {format(date, "MMM dd")} • {selectedTime}
                    </span>
                  </div>
                  <Separator />
                  
                  {/* PRICE BREAKDOWN */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Service Price</span>
                      <span className="text-slate-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">HST (13%)</span>
                      <span className="text-slate-900 font-medium">${hst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-dashed border-slate-200">
                      <span className="text-slate-900 font-bold">Total</span>
                      <span className="text-slate-900 font-black">${total.toFixed(2)}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex items-start space-x-3 px-1">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1 border-2 border-slate-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-relaxed text-slate-600 cursor-pointer"
                >
                  I accept the <span className="underline text-slate-900">Terms and Conditions</span>.
                </label>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button 
                onClick={handleProceedToPayment} 
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white shadow-xl transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                   <span className="flex items-center gap-2">Proceed to Payment <ArrowRight className="h-5 w-5" /></span>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* --- VIEW 5: STRIPE PAYMENT --- */}
        {view === 'payment' && clientSecret && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 flex-1 p-2">
             <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <StripePaymentForm amount={total} onSuccess={handlePaymentSuccess} />
             </Elements>
          </div>
        )}

      </div>
    </div>
  );
}