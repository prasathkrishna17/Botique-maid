"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StripePaymentForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet.
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is required, but we handle success inline usually. 
        // For simple integrations, you can just point to current page.
        return_url: window.location.href, 
      },
      redirect: "if_required", // Important: Prevents redirect if not needed (e.g. credit cards)
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setLoading(false);
    } else {
      // Payment Succeeded!
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase">Total to Pay</p>
        <p className="text-3xl font-black text-slate-900">${amount.toFixed(2)}</p>
      </div>

      <div className="p-4 border border-slate-200 rounded-lg">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md font-medium">
          {errorMessage}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full h-14 text-lg font-bold bg-black hover:bg-slate-800 text-white shadow-lg"
      >
        {loading ? <Loader2 className="animate-spin" /> : `Pay $${amount.toFixed(2)}`}
      </Button>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1 mt-2">
        <Lock className="h-3 w-3" /> Payments processed securely by Stripe
      </div>
    </form>
  );
}