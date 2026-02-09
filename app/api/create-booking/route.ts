import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 1. Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // MUST use Service Role Key, not Anon Key
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log to show we are trying to save
    console.log("📝 Attempting to save booking for:", body.customer.email);

    // 2. Format the data for Supabase
    const bookingData = {
      first_name: body.customer.firstName,
      last_name: body.customer.lastName,
      email: body.customer.email,
      phone: body.customer.phone,
      
      street_address: body.address.street1,
      unit_number: body.address.unit || null,
      city: body.address.city,
      province: body.address.province,
      postal_code: body.address.postalCode,
      
      property_type: body.service.propertyType,
      bedrooms: parseInt(body.service.bedrooms),
      bathrooms: parseInt(body.service.bathrooms),
      frequency: body.service.frequency,
      cleaning_type: body.service.cleaningType || 'standard',
      special_instructions: body.service.specialInstructions || null,
      
      subtotal: body.pricing.subtotal,
      discount: body.pricing.discount,
      hst: body.pricing.hst,
      total_price: body.pricing.total,
      
      payment_method: body.payment.method,
      status: 'pending' 
    };

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log("✅ Successfully saved to Supabase! ID:", data.id);

    return NextResponse.json({ 
      success: true, 
      bookingId: data.id, 
      message: "Booking saved" 
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}