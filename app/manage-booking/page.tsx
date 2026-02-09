import ManageBookingLookup from "@/components/manage/ManageBookingLookup";

export default function ManageBookingPage() {
  return (
    // This layout forces the "popup" look (Centered Card) on a full page
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      
      {/* Optional: Subtle grid pattern for professional look */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <div className="relative z-10 w-full max-w-md">
         {/* This is the component we built earlier */}
         <ManageBookingLookup />
      </div>

    </main>
  );
}