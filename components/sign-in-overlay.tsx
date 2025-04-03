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
import { signInUser } from "@/lib/actions/user.actions";
import OtpModal from "@/components/OTPModal";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

export function SignInOverlay() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signInUser({
        email: values.email,
      });

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.accountId) {
        setAccountId(result.accountId);
        toast.success("Verification code sent to your email!");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Failed to send verification code. Please try again.");
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
                Sign In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive a verification code
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="shad-form-item">
                      <FormLabel className="shad-form-label">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="shad-input"
                          type="email"
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
                {isLoading ? "Sending code..." : "Send code"}
              </Button>

              {errorMessage && (
                <p className="error-message text-center text-sm text-red-500">
                  *{errorMessage}
                </p>
              )}

              <div className="body-2 flex justify-center">
                <p className="text-light-100">Don't have an account?</p>
                <Link href="/sign-up" className="ml-1 font-medium text-brand">
                  Sign Up
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
