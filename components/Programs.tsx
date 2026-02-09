import { programs } from "@/lib/constants";
import * as motion from "motion/react-client";
import { Sparkles, Home, Building2, CalendarDays, ShieldCheck, Gem } from "lucide-react";

// Icons mapped to your services
const iconMap = [Sparkles, Home, Building2, CalendarDays, ShieldCheck, Gem];

export default function Services() {
  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* 1. HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Our <span className="text-blue-600">Services</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Comprehensive cleaning solutions tailored to your needs.
          </motion.p>
        </div>

        {/* 2. RESPONSIVE GRID */}
        {/* grid-cols-1 (Mobile) -> grid-cols-2 (Tablet) -> grid-cols-3 (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {programs.map((program, index) => {
            // Cycle through icons if you have more programs than icons
            const Icon = iconMap[index % iconMap.length];
            
            // Highlight the first card (Index 0)
            const isFeatured = index === 0; 

            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`
                  relative p-6 md:p-8 rounded-[2rem] shadow-xl transition-all duration-300
                  ${isFeatured 
                    ? "bg-blue-600 text-white shadow-blue-600/20" 
                    : "bg-white text-slate-900 shadow-slate-200/50 hover:shadow-2xl border border-slate-100"}
                `}
              >
                {/* ICON CIRCLE */}
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center mb-6 text-xl shadow-sm
                  ${isFeatured 
                    ? "bg-white/20 text-white" 
                    : "bg-blue-50 text-blue-600"}
                `}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* TEXT CONTENT */}
                <h3 className={`text-2xl font-bold mb-3 ${isFeatured ? "text-white" : "text-slate-900"}`}>
                  {program.title}
                </h3>
                
                <p className={`leading-relaxed text-sm font-medium mb-8 ${isFeatured ? "text-blue-100" : "text-slate-500"}`}>
                  {program.description}
                </p>

                {/* "Learn More" Link */}
                <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase cursor-pointer group mt-auto">
                  <span>Learn More</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isFeatured ? "text-white" : "text-blue-600"}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}