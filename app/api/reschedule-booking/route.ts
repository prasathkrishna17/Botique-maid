import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with SERVICE ROLE KEY (Bypasses security)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, newDate, newTime } = body;

    console.log("📅 Rescheduling:", { bookingId, newDate, newTime });

    // 1. Validate
    if (!bookingId || !newDate || !newTime) {
      return NextResponse.json({ success: false, error: "Missing details" }, { status: 400 });
    }

    // 2. Update the Booking in Supabase
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        service_date: newDate,
        service_time: newTime,
        status: 'rescheduled' // Optional: Track that it was changed
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, booking: data });

  } catch (error: any) {
    console.error("❌ Reschedule Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}