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
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await verifySecret({ accountId, password });

      if (result?.sessionId) {
        toast.success("Successfully signed in!");
        router.push("/");
        router.refresh();
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendEmailOTP({ email });
      toast.success("New verification code sent!");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to send new code. Please try again.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Enter Verification Code</AlertDialogTitle>
          <AlertDialogDescription>
            We've sent a code to <span className="font-medium">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-center py-6">
          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
          <AlertDialogAction
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading || password.length !== 6}
          >
            {isLoading ? (
              <>
                Verifying...
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={20}
                  height={20}
                  className="ml-2 animate-spin"
                />
              </>
            ) : (
              "Verify"
            )}
          </AlertDialogAction>

          <div className="text-center">
            <Button
              variant="link"
              className="text-xs text-muted-foreground"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Didn't receive a code? Click to resend
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
