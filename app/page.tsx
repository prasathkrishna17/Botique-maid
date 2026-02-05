import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Programs from "@/components/Programs";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import { getGoogleReviews } from "@/lib/google-reviews";


export default async function Home() {
  
  const reviews = await getGoogleReviews();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <Programs />
      <Pricing />
      <Testimonials reviews={reviews} />
      <Footer />
    </main>
  );
}