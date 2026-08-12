import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "Velora — Shop Smarter. Live Better.",
    template: "%s | Velora",
  },

  description:
    "Velora is a modern e-commerce experience for discovering quality products at great prices.",

  applicationName: "Velora",

  keywords: [
    "Velora",
    "e-commerce",
    "online shopping",
    "online store",
    "shopping",
    "products",
  ],

  authors: [
    {
      name: "Velora",
    },
  ],

  creator: "Velora",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "Velora — Shop Smarter. Live Better.",
    description:
      "Discover quality products and enjoy a modern shopping experience with Velora.",
    siteName: "Velora",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Velora — Shop Smarter. Live Better.",
    description:
      "Discover quality products and enjoy a modern shopping experience with Velora.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}