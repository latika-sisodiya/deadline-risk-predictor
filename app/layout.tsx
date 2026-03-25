import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deadline Risk Predictor — Lancaster",
  description: "AI-powered deadline risk estimation for university students",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
