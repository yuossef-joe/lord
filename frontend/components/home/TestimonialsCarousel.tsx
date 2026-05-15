"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/common/ScrollReveal";
import { fetchTestimonials } from "@/lib/api";
import { Testimonial } from "@/types/inquiry";

interface TestimonialsCarouselProps {
  title?: string;
}

export default function TestimonialsCarousel({ title }: TestimonialsCarouselProps) {
  const { t, localize } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials()
      .then((data: unknown) => {
        const res = data as { data: Testimonial[] };
        setTestimonials(res.data ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-lord-navy py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">
            {title || t("home.testimonials.title")}
          </h2>
        </ScrollReveal>

        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".swiper-prev",
              nextEl: ".swiper-next",
            }}
            className="testimonials-swiper pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._id}>
                <div className="rounded-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 h-full">
                  <Quote className="h-8 w-8 text-lord-teal/20 mb-3" />

                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          delay: i * 0.1,
                          stiffness: 300,
                        }}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "text-warning fill-warning"
                              : "text-white/20"
                          }`}
                        />
                      </motion.span>
                    ))}
                  </div>

                  <p className="mb-4 text-sm italic text-white/80 leading-relaxed line-clamp-4">
                    &ldquo;{localize(testimonial.quote, testimonial.quoteAr)}&rdquo;
                  </p>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {testimonial.customerName}
                    </p>
                    {testimonial.location && (
                      <p className="text-xs text-white/50">
                        {localize(testimonial.location, testimonial.locationAr)}
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors hidden lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
