import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Prets - Training Logger",
  description:
    "Track your training with emoji-powered visual logs, custom tags, and share them with your fellow athletes.",
};

export const viewport: Viewport = {
  themeColor: "#0a0e14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(220, 18%, 7%)",
              border: "1px solid hsl(220, 14%, 14%)",
              color: "hsl(210, 20%, 95%)",
            },
          }}
        />
      </body>
    </html>
  );
}
