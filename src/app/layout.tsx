import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import DynamicFavicon from "@/components/DynamicFavicon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luma Dental Care – Healthy Smiles Start Here",
  description:
    "Modern dental care with advanced technology and a gentle approach. Book your appointment today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <DynamicFavicon />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
