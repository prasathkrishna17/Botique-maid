"use client";

import { usePricing } from '@/hooks/usePricing';
import { useBookingStore } from '@/store/useBookingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function QuoteSummary() {
  const { anchors, formData } = useBookingStore();
  const { subtotal, discountAmount, hst, total } = usePricing();

  if (!anchors) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center text-muted-foreground text-sm">
          Enter your postal code to see pricing.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 shadow-sm sticky top-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Your Quote</span>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            {anchors.fsa} Area
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Details Summary */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="capitalize">{formData.propertyType} • {formData.bedrooms} Bed • {formData.bathrooms} Bath</p>
          <p className="capitalize">{formData.frequency === 'one-time' ? 'One-Time Clean' : `Recurring: ${formData.frequency}`}</p>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${(subtotal + discountAmount).toFixed(2)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Recurring Discount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>HST (13%)</span>
            <span>${hst.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}