import * as motion from "motion/react-client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/booking/BookingModal";
import { Zap, MessageCircle } from "lucide-react"; 

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-visible pt-32 pb-20 md:pt-40">
       
       {/* 1. BACKGROUND IMAGE */}
       <div className="absolute inset-0 z-0">
         <Image
           src="/hero.jpeg" 
           alt="Cleaning Service"
           fill
           className="object-cover object-center"
           priority
         />
         <div className="absolute inset-0 bg-white/90 md:bg-white/80"></div>
       </div>

       {/* 2. MAIN CONTENT */}
       <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
          >
            Professional Cleaning Services
          </motion.h1>
          
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.6 }}
             className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium"
          >
            Experience spotless spaces with our expert cleaning solutions. 
            We deliver quality, reliability, and satisfaction with every service.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
          >
             {/* Quote Button */}
             <BookingModal>
               <Button className="w-full md:w-72 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 rounded-lg transition-transform hover:scale-105">
                 <Zap className="mr-2 h-5 w-5 fill-current" /> Get Instant Quotes
               </Button>
             </BookingModal>

             {/* Connect Button */}
             <Button className="w-full md:w-72 h-14 text-lg font-bold bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-200 rounded-lg transition-transform hover:scale-105">
               <MessageCircle className="mr-2 h-5 w-5" /> Connect with Owner
             </Button>
          </motion.div>

       </div>

    </section>
  );
}