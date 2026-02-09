import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your Secret Key (Get this from Stripe Dashboard)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use latest version
});

export async function POST(request: Request) {
  try {
    const { amount, currency = "cad" } = await request.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents (e.g., $10.00 = 1000)
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}