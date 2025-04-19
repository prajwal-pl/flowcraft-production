"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  index: number;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-zinc-900/70 opacity-0 hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </motion.div>
  );
}

interface AnimatedFeatureSectionProps {
  title: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  withImage?: boolean;
  imagePath?: string;
}

export function AnimatedFeatureSection({
  title,
  subtitle,
  features,
  withImage = false,
  imagePath,
}: AnimatedFeatureSectionProps) {
  return (
    <section className="py-16 md:py-24 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-700/20 via-zinc-900/5 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {withImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden"
            >
              <div className="relative h-full min-h-[300px] md:min-h-[400px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl overflow-hidden border border-zinc-700">
                <Image
                  src={imagePath || "/landing.png"}
                  alt="Feature visual"
                  fill
                  className="object-cover mix-blend-lighten opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-transparent opacity-40" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  index={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className="w-full h-full"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
