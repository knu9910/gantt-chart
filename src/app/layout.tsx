import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "@/config/tanstack-provider";
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
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
      </body>
    </html>
  );
}
