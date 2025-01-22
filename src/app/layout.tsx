import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIFY",
  description: "Social app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} min-h-screen bg-black text-white antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
