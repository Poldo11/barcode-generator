import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import { AnimalBanner } from "@/components/animal-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aboio App",
  description: "Aboio App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col min-h-screen w-full bg-gray-50">
            <div className="flex-1">{children}</div>
            <div className="flex justify-center self-center">
              <AnimalBanner type="cat" />
              <AnimalBanner type="dog" />
            </div>
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
