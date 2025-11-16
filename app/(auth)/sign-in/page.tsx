"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OtpModal from "@/components/OTPModal";
import { signInUser } from "@/lib/actions/user.actions";
import Logo from "@/components/ui/logo";

const schema = z.object({ email: z.string().email({ message: "Enter a valid email" }) });

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await signInUser({ email: values.email });
      if (result?.error) {
        setErrorMessage(result.error);
        setAccountId(null);
      } else {
        setAccountId(result?.accountId ?? null);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || "Failed to sign in. Please try again.");
      setAccountId(null);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left coral panel */}
      <div className="w-[90%] relative md:min-h-screen p-8 pl-0 md:p-28 bg-primary">
        <div className="text-white flex flex-col gap-6">
          {/* Logo */}
          <Logo textColor="text-pink-100 pb-3"></Logo>

          {/* Headline */}
          <h1 className="text-white text-3xl md:text-3xl font-bold leading-tight pt-4">
            Manage your files the
            <br />
            best way
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm max-w-[320px]">
            This is a place where you can store all your
            <br />
            documents.
          </p>

          {/* Illustration */}
          <div className="">
            <Image src="/images/files.png" alt="illustration" width={280} height={280} className="mx-auto md:mx-0" />
          </div>
        </div>

        {/* Full-height vertical alignment divider to mirror the reference */}
        <div className="hidden md:block absolute inset-y-0 right-[-1px] w-[1px] bg-primary" />
      </div>

      {/* Right white panel with form */}
      <div className="bg-white flex items-center justify-center py-10 md:py-0">
        <div className="w-full max-w-md px-6">
          <h2 className="text-[26px] font-bold text-neutral-900 mb-6">Sign In</h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Card-like email input container */}
            <div className="rounded-2xl border border-neutral-200 shadow p-4">
              <label htmlFor="email" className="text-[13px] text-neutral-500">Email</label>
              <div className="mt-1 flex items-center gap-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  className="flex-1 border-none focus-visible:ring-0 px-0 text-[14px]"
                />
                <button
                  type="button"
                  aria-label="more"
                  className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center bg-primary"
                >
                  <span className="flex items-center gap-[2px]">
                    <span className="w-1 h-1 rounded-full bg-white" />
                    <span className="w-1 h-1 rounded-full bg-white" />
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </button>
              </div>
              {form.formState.errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {form.formState.errors.email.message as string}
                </p>
              )}
            </div>

            {/* Primary action button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-full text-white shadow bg-primary" 
              disabled={isLoading}
            >
              Sign In
            </Button>

            {errorMessage && (
              <p className="text-sm text-red-600">*{errorMessage}</p>
            )}

            {/* Secondary link */}
            <p className="text-center text-[13px] text-neutral-700">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-medium text-primary">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </div>
  );
}
