"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OtpModal from "@/components/OTPModal";
import { Package } from "lucide-react";
import { toast } from "sonner";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email("Invalid email"),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, "Full name must be at least 2 characters")
            .max(50, "Full name must be less than 50 characters")
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.accountId) {
        setAccountId(result.accountId);
        toast.success("Verification code sent to your email!");
      }
    } catch (error) {
      console.error(
        `Error ${type === "sign-up" ? "creating account" : "signing in"}:`,
        error
      );
      setErrorMessage(
        `Failed to ${
          type === "sign-up" ? "create account" : "send verification code"
        }. Please try again.`
      );
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
                {type === "sign-in" ? "Sign In" : "Sign Up"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {type === "sign-in"
                  ? "Enter your email to receive a verification code"
                  : "Enter your details to create your account"}
              </p>
            </div>

            <div className="space-y-4">
              {type === "sign-up" && (
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
              )}

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
                {isLoading ? (
                  <>
                    {type === "sign-in"
                      ? "Sending code..."
                      : "Creating account..."}
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="ml-2 animate-spin"
                    />
                  </>
                ) : type === "sign-in" ? (
                  "Send code"
                ) : (
                  "Create account"
                )}
              </Button>

              {errorMessage && (
                <p className="error-message text-center text-sm text-red-500">
                  *{errorMessage}
                </p>
              )}

              <div className="body-2 flex justify-center">
                <p className="text-light-100">
                  {type === "sign-in"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <Link
                  href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                  className="ml-1 font-medium text-brand"
                >
                  {type === "sign-in" ? "Sign Up" : "Sign In"}
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
};

export default AuthForm;
