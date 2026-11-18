import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Fixora | Smart Device & Home Appliance Repair",
    template: "%s | Fixora",
  },
  description:
    "Book verified technicians, track every repair step, and pay only after the job is done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable}`}>
        <MotionProvider>{children}</MotionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
