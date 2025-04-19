"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote:
      "FlowCraft has transformed how we handle our data pipelines. The visual interface makes complex workflows simple to understand.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "DataStream Inc.",
  },
  {
    quote:
      "We've reduced our workflow development time by 70% since implementing FlowCraft across our teams.",
    author: "Michael Chen",
    role: "Head of Engineering",
    company: "TechNova",
  },
  {
    quote:
      "The automation capabilities in FlowCraft have eliminated countless hours of manual work for our data scientists.",
    author: "Alex Rodriguez",
    role: "Data Science Lead",
    company: "Analytix",
  },
  {
    quote:
      "I was skeptical at first, but FlowCraft's intuitive interface has made it our go-to tool for all workflow automation.",
    author: "Jamie Williams",
    role: "Product Manager",
    company: "InnovateCorp",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-zinc-700/30 via-zinc-900/10 to-transparent" />
      </motion.div>

      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Customer Stories
          </h2>
          <p className="text-zinc-400 text-lg">
            See what our customers are saying about FlowCraft
          </p>
        </motion.div>

        <div className="relative h-[320px] md:h-[240px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                scale: activeIndex === index ? 1 : 0.9,
              }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <div className="text-center mx-auto max-w-3xl">
                <div className="mb-6">
                  <svg
                    className="w-8 h-8 text-zinc-500 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-lg md:text-xl text-white mb-5 italic">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                activeIndex === index ? "bg-white" : "bg-zinc-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
