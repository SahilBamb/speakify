import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Speakify — Turn anything into audio",
  description: "Upload PDFs, generate books with AI, and listen with real-time text highlighting. Your personal text-to-speech reader.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
