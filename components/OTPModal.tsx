"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { verifyEmailOtp, sendEmailOTP } from "@/lib/actions/user.actions";

import { useRouter } from "next/navigation";

const OtpModal = ({
  accountId,
  email,
  fullName,
}: {
  accountId: string;
  email: string;
  fullName?: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await verifyEmailOtp({ email, token: password, fullName });
      if (result?.user) {
        router.push("/");
      } else {
        setErrorMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.log("Failed to verify OTP", error);
      setErrorMessage("Verification failed. Please try again.");
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    const r = await sendEmailOTP({ email });
    if (r.success) {
      setNotice("OTP sent. Check your inbox.");
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      setErrorMessage(r.error || "Failed to resend OTP");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center !font-bold">
            Enter Your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="font-medium text-center text-sm text-black/80">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-bold text-primary">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword} className="my-8">
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12 rounded-full"
              type="button"
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            {errorMessage && (
              <div className="text-red-600 text-sm text-center font-medium">{errorMessage}</div>
            )}
            {notice && (
              <div className="text-green-600 text-sm text-center font-medium">{notice}</div>
            )}

            <div className="text-black/80 text-sm mt-2 text-center font-medium">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-primary"
                onClick={handleResendOtp}
                disabled={cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Click to resend"}
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
