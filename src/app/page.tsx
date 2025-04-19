"use client";

import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { TopNavbar } from "@/components/ui/top-navbar";
import { AnimatedFeatureSection } from "@/components/ui/animated-feature-section";
import { TestimonialsSection } from "@/components/ui/testimonials";
import { PricingSection } from "@/components/ui/pricing";
import { Footer } from "@/components/ui/footer";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

const HomePage = () => {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black min-h-screen">
      {/* Top Navigation Bar */}

      <TopNavbar
        // @ts-ignore
        user={user}
      />

      {/* Hero section with container scroll animation */}
      <ContainerScroll
        titleComponent={
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 p-1.5 rounded-full"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-zinc-950 block px-4 py-1.5 rounded-full text-white font-medium"
                  >
                    Now with AI-powered workflow suggestions
                  </motion.span>
                </motion.div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Create powerful workflows with{" "}
                <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600">
                  FlowCraft
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                Build, automate, and deploy workflows visually without writing a
                single line of code
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-blue-700/20 border-0">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="flex items-center"
                    >
                      Get Started
                      <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </motion.span>
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-lg border-zinc-700 text-white hover:bg-zinc-800 rounded-full backdrop-blur-md"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="mt-10 flex flex-wrap gap-3 justify-center"
              >
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>No-code builder</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>100+ integrations</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Premium support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        }
      >
        <div className="flex items-center justify-center w-full h-full bg-zinc-900/70 rounded-xl overflow-hidden relative group">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-full"
          >
            <Image
              src="/landing.png"
              alt="FlowCraft Workflow Interface"
              width={1920}
              height={1080}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

            {/* Floating elements for visual interest */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-10 left-10 md:left-20 bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-4 border border-white/20 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div className="text-xs md:text-sm font-medium text-white">
                  Workflow Active
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute top-10 right-10 md:right-20 bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-4 border border-white/20 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="text-xs md:text-sm font-medium text-white">
                  Processing 100%
                </div>
                <div className="h-2 w-20 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </ContainerScroll>

      {/* Main Features Section */}
      <div id="features">
        <AnimatedFeatureSection
          title="Powerful Features"
          subtitle="Everything you need to build and automate your workflows"
          features={[
            {
              title: "Visual Designer",
              description:
                "Drag and drop interface to create workflow diagrams without coding.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-zinc-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                  />
                </svg>
              ),
            },
            {
              title: "API Integrations",
              description:
                "Connect to thousands of services with pre-built integrations.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-zinc-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                  />
                </svg>
              ),
            },
            {
              title: "Real-time Monitoring",
              description:
                "Monitor all your workflows with real-time metrics and alerts.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-zinc-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              ),
            },
          ]}
        />
      </div>

      {/* Advanced Features Section with Image */}
      <AnimatedFeatureSection
        title="Advanced Tools & Integrations"
        subtitle="Powerful solutions for every workflow need"
        withImage={true}
        imagePath="/landing.png"
        features={[
          {
            title: "Data Transformation",
            description:
              "Transform data between steps with a visual mapping interface.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-zinc-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
              </svg>
            ),
          },
          {
            title: "Custom Functions",
            description:
              "Create reusable functions to handle complex operations.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-zinc-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                />
              </svg>
            ),
          },
          {
            title: "Collaboration",
            description:
              "Work together in real-time with team members on shared workflows.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-zinc-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            ),
          },
          {
            title: "Version Control",
            description:
              "Track changes and roll back to previous versions of your workflows.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-zinc-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            ),
          },
        ]}
      />

      {/* Call To Action Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-black py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to streamline your workflows?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl">
              Join thousands of teams that use FlowCraft to automate their
              processes and save time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up">
                <Button className="px-8 py-6 text-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 rounded-full">
                  Start for free
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demos">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-zinc-700 text-white hover:bg-zinc-800 rounded-full"
                >
                  View demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
