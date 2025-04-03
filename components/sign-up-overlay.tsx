"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { createAccount } from "@/lib/actions/user.actions";
import OtpModal from "@/components/OTPModal";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export function SignUpOverlay() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await createAccount({
        fullName: values.fullName,
        email: values.email,
      });

      if (result.accountId) {
        setAccountId(result.accountId);
        toast.success("Verification code sent to your email!");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="size-6" />
              </div>
              <h1 className="form-title text-2xl font-semibold tracking-tight">
                Sign Up
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to create your account
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="shad-input"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="form-submit-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              {errorMessage && (
                <p className="error-message text-center text-sm text-red-500">
                  *{errorMessage}
                </p>
              )}

              <div className="body-2 flex justify-center">
                <p className="text-light-100">Already have an account?</p>
                <Link href="/sign-in" className="ml-1 font-medium text-brand">
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </div>
  );
}
