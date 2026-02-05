import * as motion from "motion/react-client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <Image
          src="/fitness-hero.jpeg"
          alt="Fitness Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 text-white text-center px-4 max-w-4xl">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-6xl md:text-6xl font-black font-heading mb-6 leading-tighter"
          >
            Botique, Owner-Led Home Cleaning
          </motion.h1>

           <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-4xl md:text-4xl font-black font-heading mb-6 leading-tighter"
          >
            for Homes That Deserve{" "} 
            <span className="text-primary">Extra Care</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-xl md:text-xl mb-8 font-light leading-relaxed max-w-3xl mx-auto"
          >
            Consistent, high-standard cleaning tailored
            to your home and schedule.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={"/book"}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg font-semibold transition-transform duration-300 hover:scale-105 px-8"
            >
              Get My Instant Quote
            </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-lg font-semibold transition-transform duration-300 hover:scale-105 px-8"
            >
              Text the Owner
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
