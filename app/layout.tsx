import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CategoriesProvider } from "@/components/context/categories";

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
        <CategoriesProvider>{children}</CategoriesProvider>
      </body>
    </html>
  );
}
