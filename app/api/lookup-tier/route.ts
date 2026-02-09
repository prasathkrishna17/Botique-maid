import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin Client
// Uses SERVICE_ROLE_KEY to bypass RLS and read the hidden 'service_areas' table
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { postalCode } = await request.json(); // Expecting "M5V 2H1"

    // 1. Validate Input Format (Server-side sanity check)
    // Regex: A1A 1A1 (Space is mandatory here as per frontend formatting)
    const regex = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;
    if (!postalCode || !regex.test(postalCode)) {
      return NextResponse.json({ error: "Invalid postal code format" }, { status: 400 });
    }

    // 2. Call Geocodio API (Private Endpoint) [cite: 71, 334]
    // This verifies if the address is real and gets City/Province
    const geoUrl = `https://api.geocod.io/v1.7/geocode?q=${encodeURIComponent(postalCode)}&country=CA&api_key=${process.env.GEOCODIO_API_KEY}`;
    
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    // Check if Geocodio found a result
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: "Address not found." }, { status: 404 });
    }

    // Extract City/Province for Session Anchor [cite: 73-75]
    const addressComponents = geoData.results[0].address_components;
    const city = addressComponents.city;
    const province = addressComponents.state;

    // 3. Check Internal Service Area (Using FSA) [cite: 53, 116]
    // We only care about the first 3 characters (FSA) for pricing
    const fsa = postalCode.split(" ")[0]; // "M5V"
    
    const { data: serviceArea, error } = await supabaseAdmin
      .from('service_areas')
      .select('tier, travel_fee_internal') 
      .eq('fsa', fsa)
      .eq('active', true)
      .single();

    if (error || !serviceArea) {
      // If FSA is valid real-world location but not in our DB
      return NextResponse.json({ error: "Sorry, we don't serve this area yet." }, { status: 404 });
    }

    // 4. Return the Payload [cite: 441]
    // This data allows the frontend to lock the session
    return NextResponse.json({
      anchors: {
        postal_code: postalCode,
        fsa: fsa,
        city: city,
        province: province,
      },
      pricing: {
        tier: serviceArea.tier,
        travel_fee_internal: serviceArea.travel_fee_internal // Internal use only
      }
    });

  } catch (err) {
    console.error("Lookup API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}