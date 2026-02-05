"use client";

import * as motion from "motion/react-client"; 
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";

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
    <section className="py-20 bg-foreground/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black font-heading mb-4 text-foreground"
          >
            What <span className="text-primary">People Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
             Real feedback from our Google Reviews.
          </motion.p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((t, index) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} // Fixed: This is now single (duplicate removed)
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.2,
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3, delay: 0 },
              }}
              key={index}
              className="group h-full"
            >
              <Card className="hover:shadow-2xl transition-shadow duration-300 h-full">
                <CardContent className="p-8 text-center flex flex-col h-full">
                  
                  {/* Profile Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                    className="relative mb-6 h-20 w-20 mx-auto"
                  >
                    <Image
                      src={t.profile_photo_url}
                      alt={t.author_name}
                      fill
                      className="rounded-full object-cover border-4 border-primary/20 group-hover:border-primary transition-colors duration-300"
                    />
                  </motion.div>

                  {/* Star Rating */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                    className="flex justify-center mb-4 gap-1"
                  >
                    {Array.from({ length: MAX_STARS }).map((_, i) => {
                      const filled = i < t.rating;
                      return (
                        <Star
                          key={i}
                          className={filled ? "w-5 h-5 text-yellow-300" : "w-5 h-5 text-neutral-300"}
                          fill={filled ? "currentColor" : "none"}
                        />
                      );
                    })}
                  </motion.div>

                  {/* Review Text */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                    className="text-lg font-semibold font-heading text-foreground mb-4 flex-grow"
                  >
                    &quot;{t.text.length > 150 ? `${t.text.slice(0, 150)}...` : t.text}&quot;
                  </motion.blockquote>

                  {/* Date */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                    className="text-sm text-muted-foreground mb-4"
                  >
                    {t.relative_time_description}
                  </motion.p>

                  {/* Author Name */}
                  <motion.cite
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                    className="font-bold text-primary italic not-italic"
                  >
                    - {t.author_name}
                  </motion.cite>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}