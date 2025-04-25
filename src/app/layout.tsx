import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/config/tanstack-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gantt Chart",
  description: "Gantt Chart with TanStack Query",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TanstackQueryProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </Suspense>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
