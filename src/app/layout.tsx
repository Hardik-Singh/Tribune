import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tribune",
  description: "Self-modifying governance app",
  alternates: {
    types: {
      "application/json": "/api/schema",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const mode = cookieStore.get("tribune-mode")?.value === "ai" ? "ai" : "human";
  const isAI = mode === "ai";

  return (
    <html lang="en" className={isAI ? "" : "dark"} data-mode={mode}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased${isAI ? " bg-white text-black" : ""}`}
      >
        <Providers initialMode={mode}>
          <Navbar />
          <main className={isAI ? "p-4" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
