"use client";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const authRoutes = ["/auth/sign-in", "/auth/sign-up"];

  const isAuthPage = authRoutes.includes(pathname);
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {!isAuthPage && <Navbar />}

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
