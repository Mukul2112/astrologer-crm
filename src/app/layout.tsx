import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import { LayoutContent } from "@/components/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AstroCRM — Astrologer CRM",
  description:
    "Premium CRM for Astrologers to manage clients, appointments, and consultations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force recompile for CSS changes (cache bust 2)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)] relative">
          <Sidebar />
          <LayoutContent>{children}</LayoutContent>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--card-bg)",
              color: "var(--foreground)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px var(--shadow-color)",
            },
          }}
        />
      </body>
    </html>
  );
}
