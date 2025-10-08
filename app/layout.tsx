import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Research Canvas - AI-Powered Research Tool",
  description: "An infinite canvas for organizing and connecting research insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
