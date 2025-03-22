import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/redux/provider';
import { Toaster } from 'sonner';
import ClientSessionProvider from "./providers/ClientSessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clashing App",
  description: "Get your Audince Thoughts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 antialiased`}
      >
        <ClientSessionProvider> <Providers>{children}</Providers></ClientSessionProvider>

      

       <Toaster richColors position="top-right" />

      </body>
    </html>
  );
}

