import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import MotionProvider from "@/components/motion/MotionProvider";
import ThemeProvider from "@/components/theme/ThemeProvider";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Fixora | Smart Device & Home Appliance Repair",
    template: "%s | Fixora",
  },
  description:
    "Book verified technicians, track every repair step, and pay only after the job is done.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${inter.variable}`}>
        {/* Fresh homepage loads start at the top so the transparent navbar is shown first. */}
        <Script id="home-scroll-restoration" strategy="beforeInteractive">
          {`if (location.pathname === '/' && !location.hash) history.scrollRestoration = 'manual';`}
        </Script>
        <ThemeProvider>
          <MotionProvider>{children}</MotionProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
