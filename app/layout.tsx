import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import { FloatingNav } from "@/components/ui/floating-navbar";

const inter = Inter({ subsets: ["latin"] });

const agrandir = localFont({
  src: "../public/Agrandir-Regular.otf",
  variable: "--font-secondary",
});

const melodrama = localFont({
  src: "../public/Melodrama-Regular.otf",
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "Symphony Connect",
  description: "A musical community app!",
  icons: {
    icon: "/logo.png",
  },
};

const navItems = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Feed",
    link: "/feed",
  },
  {
    name: "Profile",
    link: "/profile",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${melodrama.variable} ${agrandir.variable} ${inter.className} bg-zinc-900 text-white`}
        >
          <FloatingNav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
