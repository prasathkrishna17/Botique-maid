"use client";

import Link from "next/link";
import { useBookingStore } from "@/store/useBookingStore";
import { usePricing } from "@/hooks/usePricing";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Calendar, CreditCard, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function ConfirmationStep() {
  const { formData } = useBookingStore();
  const { subtotal, discountAmount, hst, total } = usePricing();

  // --- THE FIX: NO FAKE IDs ---
  // If formData.id exists, show it. Otherwise show "Processing..."
  const bookingRef = formData.id; 

  const copyToClipboard = () => {
    if (bookingRef) {
      navigator.clipboard.writeText(String(bookingRef));
      toast.success("Reference copied!");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-4">
      
      {/* HEADER */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center p-3 bg-black rounded-full shadow-lg ring-4 ring-slate-100">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Booking Confirmed</h1>
          <p className="text-slate-500 text-lg">
            Thanks, {formData.firstName}. Receipt sent to <span className="font-bold text-black">{formData.email}</span>.
          </p>
          
          {/* REFERENCE ID BOX */}
          {bookingRef ? (
            <div onClick={copyToClipboard} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 cursor-pointer px-4 py-2 rounded-full text-sm font-bold text-slate-700 transition-colors border border-slate-200">
              <span>Ref: <span className="text-black text-base">#{bookingRef}</span></span>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full text-sm font-bold text-yellow-700 border border-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span>Generating Reference...</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIONS */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 uppercase">What Happens Next?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                <span className="text-slate-600 font-medium">Our team is preparing for your <strong>{formData.frequency}</strong> cleaning.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                <span className="text-slate-600 font-medium">You'll receive a text reminder 24h before your appointment.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            
            {/* LINK TO MANAGE BOOKING */}
            <Link 
              href="/manage-booking" 
              target="_blank" 
              className={`w-full ${!bookingRef ? 'pointer-events-none opacity-50' : ''}`} // Disable if no ID
            >
              <Button className="w-full h-14 bg-black hover:bg-slate-800 text-white font-bold text-lg rounded-md shadow-md transition-transform hover:scale-[1.01]">
                Manage My Booking
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-14 border-2 border-slate-200 text-slate-900 font-bold text-lg rounded-md hover:bg-slate-50">
              Connect with Owner
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="border-2 border-slate-100 rounded-lg p-6 space-y-6 bg-white shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 uppercase border-b border-slate-100 pb-3">Booking Summary</h3>
          <div className="space-y-4 text-sm">
             <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 uppercase text-xs mb-0.5">Service Address</p>
                  <p className="text-slate-600 uppercase font-medium">
                    {formData.street1} {formData.unit && `#${formData.unit}`}<br/>
                    {formData.city}, ON, {formData.postalCode}
                  </p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 uppercase text-xs mb-0.5">Service Details</p>
                  <p className="text-slate-600 capitalize font-medium">
                    {formData.propertyType} • {formData.bedrooms} Bed, {formData.bathrooms} Bath
                  </p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 uppercase text-xs mb-0.5">Payment Method</p>
                  <p className="text-slate-600 capitalize font-medium">
                    {formData.paymentMethod === 'credit_card' ? 'Credit Card (Paid)' : 'E-Transfer (Pending)'}
                  </p>
                </div>
             </div>
          </div>
          <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between text-lg font-black text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}