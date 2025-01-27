import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const geistSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TIFY.dev",
  description: "Social app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const currentUser = session?.user;

  if (currentUser) {
    const { name, email, image } = currentUser;
    // console.log(id);
    ///cb76056c-6dc7-4cd9-82eb-6b70aa7a5fdc
    await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        name: name,
        email: email,
        image: image,
        username: "",
      },
      update: {
        name: name,
        image: image,
      },
    });
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} min-h-screen bg-black text-white antialiased `}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
