import * as motion from "motion/react-client";
import Image from "next/image";
import { Navigation } from "lucide-react"; // Using Navigation icon for a more modern GPS look

export default function AreasWeServe() {
  return (
    <section className="relative py-32 flex items-center justify-center overflow-hidden">
      
      {/* 1. BACKGROUND: BLURRED TORONTO MAP */}
      <div className="absolute inset-0 z-0">
        {/* IMPORTANT: Place an image named 'toronto-map.png' inside your /public folder. 
           If you don't have one yet, it will show a placeholder or blank space.
        */}
        <Image
          src="/canada.jpg" 
          alt="Blurred Map of Toronto"
          fill
          // opacity-50 + blur-[6px] creates the soft background effect
          className="object-cover object-center opacity-50 blur-[6px]"
        />
        {/* White Overlay to match Hero Section theme and ensure text pops */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-md"></div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight"
        >
          Areas <span className="text-blue-600">We Serve</span>
        </motion.h2>

        {/* Paragraph with inline GPS Icon */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          // Using large, bold text for impact
          className="text-2xl md:text-4xl text-slate-800 font-extrabold leading-tight max-w-3xl mx-auto"
        >
          {/* The GPS Icon matching the Hero CTA color (blue-600) */}
          <Navigation className="inline-block w-8 h-8 md:w-10 md:h-10 text-blue-600 mr-3 -mt-2 animate-pulse" />
          We proudly serving <span className="text-blue-600 underline decoration-4 decoration-blue-600/30 underline-offset-4">Toronto & Surrounding areas</span> for past 10 years. 
        </motion.p>

      </div>
    </section>
  );
}