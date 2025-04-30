import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CategoriesProvider } from "@/components/context/categories";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pay Tracker",
  description: "Track your payments easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CategoriesProvider>
          <div className="p-2 bg-[#1d2041] h-full max-w-screen  text-white">
            <Navbar />
            {children}
          </div>
        </CategoriesProvider>
      </body>
    </html>
  );
}
