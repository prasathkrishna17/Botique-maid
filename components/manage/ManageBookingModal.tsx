"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Search, X, ArrowRight, MapPin, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

const lookupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  bookingRef: z.string().min(1, "Booking Reference is required"),
});

export default function ManageBookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(null);

  const form = useForm<z.infer<typeof lookupSchema>>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { email: "", bookingRef: "" },
  });

  const onSubmit = async (values: z.infer<typeof lookupSchema>) => {
    setLoading(true);
    
    try {
      // --- THE FIX: CALL OUR NEW API ROUTE ---
      const response = await fetch('/api/booking-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Booking not found");
      }

      setBooking(result.booking); 
      toast.success("Booking loaded");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if(!confirm("Are you sure you want to cancel?")) return;
    setLoading(true);
    
    // NOTE: For security, cancellation should ALSO be an API route, 
    // but for now, we just want to get the data loading.
    toast.info("Please contact support to cancel (Security Restriction)");
    setLoading(false);
  };

  const resetModal = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setBooking(null);
        form.reset();
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      <DialogContent className="
        z-[100] 
        gap-0 p-0 border-0 shadow-2xl bg-white
        [&>button]:hidden 
        w-[90vw] max-w-[90vw] md:w-[480px] md:max-w-[480px] rounded-xl overflow-hidden
      ">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
             <div className="bg-slate-100 p-1.5 rounded-full">
               <Search className="h-4 w-4 text-slate-900" />
             </div>
             <DialogTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">
               {booking ? "Your Booking" : "Manage Booking"}
             </DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => resetModal(false)} className="rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-400 hover:text-red-500" />
          </Button>
        </div>

        {/* CONTENT */}
        <div className="bg-white min-h-[300px]">
          
          {booking ? (
             /* DASHBOARD VIEW */
             <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start">
                   <div>
                     <h2 className="text-xl font-bold text-slate-900 capitalize">{booking.cleaning_type} Clean</h2>
                     <p className="text-sm text-slate-500">Ref: #{booking.id}</p>
                   </div>
                   <Badge className={`uppercase px-3 py-1 ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                     {booking.status}
                   </Badge>
                </div>

                <div className="space-y-4 border rounded-lg p-4 border-slate-100 bg-slate-50/50">
                   <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase">Address</p>
                        <p className="text-sm text-slate-600">
                          {booking.street_address} {booking.unit_number}<br/>
                          {booking.city}, {booking.postal_code}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase">Total</p>
                        <p className="text-sm font-bold text-slate-900">${booking.total_price}</p>
                      </div>
                   </div>
                </div>

                {booking.status !== 'cancelled' ? (
                  <Button onClick={handleCancel} variant="destructive" className="w-full h-12 font-bold" disabled={loading}>
                    Cancel Booking
                  </Button>
                ) : (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> This booking has been cancelled.
                  </div>
                )}
             </div>
          ) : (
            /* LOGIN FORM */
            <div className="p-6">
              <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">
                Enter your email and the <strong>Booking Reference</strong> (ID) to manage your appointment.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase">Email Address</label>
                        <FormControl><Input placeholder="name@example.com" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />

                  <FormField control={form.control} name="bookingRef" render={({ field }) => (
                      <FormItem>
                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase">Booking Reference</label>
                        <FormControl><Input placeholder="e.g. 12" className="h-12 border-2 focus-visible:ring-0 focus-visible:border-black rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white rounded-lg mt-2" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Find My Booking <ArrowRight className="h-5 w-5" /></span>}
                  </Button>
                </form>
              </Form>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}