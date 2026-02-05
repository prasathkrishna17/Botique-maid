import SimplyBookWidget from "@/components/SimplyBookWidget";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-center mb-2">Book Your Cleaning</h1>
          <p className="text-center text-gray-600 mb-8">Select a time that works for your schedule.</p>
          
          <SimplyBookWidget />
        </div>
      </main>
      <Footer />
    </>
  );
}