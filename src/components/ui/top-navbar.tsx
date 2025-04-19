"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./button";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { User } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Documentation", href: "/#docs" },
];

interface TopNavbarProps {
  user?: User | null;
}

export function TopNavbar({ user }: TopNavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isSignedIn = !!user;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-900/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center">
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 to-white">
              FlowCraft
            </span>
          </div>
        </Link>

        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <span
                className={`text-sm transition-colors hover:text-white ${
                  pathname === item.href
                    ? "text-white font-medium"
                    : "text-zinc-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex space-x-4">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden text-zinc-300"
              size="icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] bg-zinc-900 border-zinc-800 text-white"
          >
            <div className="flex flex-col mt-8 space-y-4">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  onClick={() => setIsOpen(false)}
                >
                  <span
                    className={`text-base transition-colors hover:text-white block py-2 ${
                      pathname === item.href
                        ? "text-white font-medium"
                        : "text-zinc-400"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="border-t border-zinc-800 my-4 pt-4">
                {isSignedIn ? (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                      >
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
}
