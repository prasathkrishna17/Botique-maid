"use client";

import * as motion from "motion/react-client";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface TestimonialsProps {
  reviews: GoogleReview[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  const MAX_STARS = 5;

  // Don't render anything if there are no reviews
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            What <span className="text-blue-600">People Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
             Real feedback from our happy clients on Google Reviews.
          </motion.p>
        </div>

        {/* TESTIMONIALS GRID */}
        {/* Changed to grid-cols-3 to perfectly fit the slice(0,3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }} // Float up effect
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative flex flex-col h-full"
            >
              
              {/* DECORATIVE QUOTE ICON */}
              <div className="absolute top-6 right-8 text-blue-100">
                <Quote className="w-12 h-12 fill-current opacity-50" />
              </div>

              {/* PROFILE HEADER */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="relative h-14 w-14 shrink-0">
                  <Image
                    src={t.profile_photo_url}
                    alt={t.author_name}
                    fill
                    className="rounded-full object-cover border-2 border-slate-100 shadow-sm"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.author_name}</h4>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    {t.relative_time_description}
                  </p>
                </div>
              </div>

              {/* STAR RATING */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: MAX_STARS }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`}
                  />
                ))}
              </div>

              {/* REVIEW TEXT */}
              <blockquote className="text-slate-600 leading-relaxed font-medium flex-grow relative z-10">
                "{t.text.length > 150 ? `${t.text.slice(0, 150)}...` : t.text}"
              </blockquote>

              {/* GOOGLE BADGE (Optional Footer) */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 opacity-60">
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                <span className="text-xs font-bold text-slate-400">Google Review</span>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}