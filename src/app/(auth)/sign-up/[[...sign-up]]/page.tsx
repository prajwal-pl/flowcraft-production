"use client";

import * as React from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UserIcon,
  ArrowRightIcon,
  CheckIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // Start the sign-up process using the email and password provided
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display second form
      setVerifying(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setError("Verification is incomplete. Please try again.");
      }
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(
        err.errors?.[0]?.message || "An error occurred during verification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-black p-4">
        <div className="absolute top-8 left-8">
          <Image
            src="/logo.svg"
            alt="FlowCraft Logo"
            width={150}
            height={40}
            className="h-auto w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl bg-zinc-800/90 backdrop-blur-sm text-white">
            <CardHeader className="space-y-1">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700"
              >
                <MailIcon className="h-6 w-6 text-zinc-300" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-center text-white">
                Verify your email
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                We've sent a verification code to your email. Please enter it
                below to continue.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleVerify}>
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-500/10 text-red-300 rounded-md p-3"
                  >
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="code"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="code"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="pl-10 py-6 text-lg tracking-widest bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-500"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-zinc-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pb-6">
                <Button
                  type="submit"
                  className="w-full py-6 text-base font-medium transition-all hover:shadow-md bg-zinc-700 hover:bg-zinc-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Verify Email</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-black p-4">
      <div className="absolute top-8 left-8">
        <Image
          src="/logo.svg"
          alt="FlowCraft Logo"
          width={150}
          height={40}
          className="h-auto w-auto"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl bg-zinc-800/90 backdrop-blur-sm text-white">
            <CardHeader className="space-y-1">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700"
              >
                <UserIcon className="h-8 w-8 text-zinc-300" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-center text-white">
                Create an account
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Join FlowCraft and start building powerful workflows
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-500/10 text-red-300 rounded-md p-3"
                  >
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="pl-10 py-6 bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-500"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-zinc-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 py-6 bg-zinc-700/50 border-zinc-600 text-white placeholder-zinc-500"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockIcon className="h-5 w-5 text-zinc-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-5 pb-6">
                <Button
                  type="submit"
                  className="w-full my-3 py-6 text-base font-medium transition-all hover:shadow-md bg-zinc-700 hover:bg-zinc-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Create Account</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-800 px-2 text-zinc-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 text-base font-medium border-2 border-zinc-700 text-white hover:bg-zinc-700/50 transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-sm text-center mt-6 text-zinc-400">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-zinc-300 font-medium hover:text-white hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-zinc-800 rounded-l-3xl overflow-hidden relative">
        <div className="z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold mb-6">
              Join the FlowCraft Community
            </h1>
            <p className="text-lg text-zinc-400 mb-8">
              Create automated workflows that save time and boost productivity.
              No coding required.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-700/70 backdrop-blur-sm p-4 rounded-lg">
                <div className="rounded-full bg-zinc-600/70 w-8 h-8 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Drag & Drop Interface</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Build complex flows with our intuitive visual editor
                </p>
              </div>
              <div className="bg-zinc-700/70 backdrop-blur-sm p-4 rounded-lg">
                <div className="rounded-full bg-zinc-600/70 w-8 h-8 flex items-center justify-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Instant Deployment</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Deploy your workflows instantly with one click
                </p>
              </div>
              <div className="bg-zinc-700/70 backdrop-blur-sm p-4 rounded-lg col-span-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="rounded-full bg-zinc-600/70 w-8 h-8 flex items-center justify-center mb-3">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Free to Start</h3>
                    <p className="text-zinc-400 text-sm mt-1">
                      Get started today with our free tier - no credit card
                      required
                    </p>
                  </div>
                  <div className="bg-white text-zinc-800 px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
