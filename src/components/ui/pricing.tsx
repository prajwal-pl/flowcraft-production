"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "./button";
import { CheckIcon } from "lucide-react";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  index: number;
}

const PricingTier = ({
  name,
  price,
  description,
  features,
  highlight,
  index,
}: PricingTierProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl border ${
        highlight
          ? "border-zinc-400 bg-gradient-to-b from-zinc-800/60 to-zinc-900/60"
          : "border-zinc-700 bg-zinc-800/30"
      } p-8 backdrop-blur-sm`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
          <div className="bg-gradient-to-r from-zinc-200 to-zinc-400 text-zinc-900 text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        {price !== "Custom" && <span className="text-zinc-400 ml-1">/mo</span>}
      </div>

      <div className="mb-8">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 text-zinc-100 flex-shrink-0 mt-1">
                <CheckIcon className="w-4 h-4" />
              </span>
              <span className="text-zinc-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={highlight ? "default" : "outline"}
        className={`w-full ${
          highlight
            ? "bg-white hover:bg-zinc-200 text-zinc-900"
            : "border-zinc-600 text-white hover:bg-zinc-700"
        }`}
      >
        Get Started
      </Button>
    </motion.div>
  );
};

export function PricingSection() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Great for individuals to get started with basic workflows",
      features: [
        "3 active workflows",
        "Basic integrations",
        "1,000 runs per month",
        "Community support",
        "7-day history",
      ],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For professionals with advanced workflow needs",
      features: [
        "Unlimited workflows",
        "Advanced integrations",
        "20,000 runs per month",
        "Priority support",
        "30-day history",
        "Team collaboration",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations with complex workflow requirements",
      features: [
        "Unlimited everything",
        "Custom integrations",
        "Dedicated account manager",
        "SLA agreement",
        "Unlimited history",
        "SSO & advanced security",
        "Custom reporting",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 relative">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700/20 via-zinc-900/10 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Choose the plan that's right for your workflow needs, with no hidden
            fees
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <PricingTier
              key={tier.name}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlight={tier.highlight}
              index={index}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-zinc-400"
        >
          Need a custom solution?{" "}
          <a
            href="#contact"
            className="text-white underline hover:text-zinc-300"
          >
            Contact us
          </a>{" "}
          for tailored pricing.
        </motion.p>
      </div>
    </section>
  );
}
