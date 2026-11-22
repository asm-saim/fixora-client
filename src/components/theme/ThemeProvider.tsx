"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Adds the "dark" class to <html>. The choice is remembered, and "system" follows the device. */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
