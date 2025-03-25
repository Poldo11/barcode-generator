import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { AnimalBanner } from "@/components/animal-banner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Facilitadores da Aboio",
  description:
    "Gere código de barras pros seus livros e também calcule o valor da lombada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
                <div className="ml-2 text-lg font-semibold">Controle Aboio</div>
              </header>
              <main className="flex-1 p-4">{children}</main>
              <div className="border-t flex  self-center gap-20">
                <div className="flex-1 justify-center items-center">
                  <AnimalBanner type="cat" />
                </div>
                <div className="flex-1 justify-center items-center">
                  <AnimalBanner type="dog" />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
