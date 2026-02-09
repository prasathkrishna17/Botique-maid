import { useMemo } from 'react';
import { useBookingStore } from '@/store/useBookingStore';

// Pricing Constants (In a real build, fetch these from Supabase 'pricing_master' & 'discounts')
const PRICING = {
  property: { condo: 100, house: 150, townhome: 125 },
  bedroom: 20,
  bathroom: 25,
  cleaningType: { regular: 0, deep: 50, move: 100 },
  addons: { fridge: 30, oven: 30, windows: 40 },
};

const DISCOUNTS = {
  weekly: 0.20,   // 20% off
  biweekly: 0.15, // 15% off
  monthly: 0.10,  // 10% off
};

const HST_RATE = 0.13;

export function usePricing() {
  const { formData, anchors } = useBookingStore();

  const pricing = useMemo(() => {
    // 1. Inputs
    const propertyType = formData.propertyType || 'condo';
    const bedrooms = parseInt(formData.bedrooms || '1');
    const bathrooms = parseInt(formData.bathrooms || '1');
    const type = formData.cleaningType || 'regular';
    const frequency = formData.frequency || 'one-time';
    
    // 2. Base Calculation
    const basePrice = PRICING.property[propertyType as keyof typeof PRICING.property] || 100;
    const roomFees = (bedrooms * PRICING.bedroom) + (bathrooms * PRICING.bathroom);
    const serviceFee = PRICING.cleaningType[type as keyof typeof PRICING.cleaningType] || 0;
    
    let subtotal = basePrice + roomFees + serviceFee;

    // 3. Recurring Discount
    let discountAmount = 0;
    if (frequency !== 'one-time') {
      const discountRate = DISCOUNTS[frequency as keyof typeof DISCOUNTS] || 0;
      discountAmount = subtotal * discountRate;
      subtotal = subtotal - discountAmount;
    }

    // 4. Travel Fee (Hidden Internal Fee)
    const travelFee = anchors?.travel_fee_internal || 0;

    // 5. Total
    // Note: Usually tax is applied on (Subtotal + TravelFee)
    const taxableAmount = subtotal + travelFee;
    const hst = taxableAmount * HST_RATE;
    const total = taxableAmount + hst;

    return {
      subtotal,
      discountAmount,
      hst,
      total,
      travelFee // Exposed for debugging, but UI hides it
    };
  }, [formData, anchors]);

  return pricing;
}