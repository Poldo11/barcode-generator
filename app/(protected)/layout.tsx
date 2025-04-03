"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { SignInOverlay } from "@/components/sign-in-overlay";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        setHasSession(!!user);
      } catch (error) {
        console.error("Error checking session:", error);
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasSession) {
    return <SignInOverlay />;
  }

  return <>{children}</>;
}
