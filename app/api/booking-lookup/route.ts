import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with SERVICE ROLE KEY (Admin access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, bookingRef } = body;

    console.log("🔍 Looking up:", { email, bookingRef });

    // Clean the input (remove '#' if user typed it)
    const cleanId = bookingRef.toString().replace('#', '').trim();

    // Query the database
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email)
      .eq('id', cleanId)
      .single();

    if (error || !data) {
      console.error("❌ Lookup Failed:", error?.message);
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    console.log("✅ Booking Found:", data.id);
    return NextResponse.json({ success: true, booking: data });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}