import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Deadline Risk Predictor — Lancaster",
  description: "AI-powered deadline risk estimation for university students",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
