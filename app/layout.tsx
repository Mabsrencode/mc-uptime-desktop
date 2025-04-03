import type { Metadata } from "next";
// import { nanoid } from "nanoid";
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
  title: "MC Uptime Monitoring",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const nonce = nanoid();
  // const isDev = process.env.NODE_ENV === "development";
  //  script-src 'self' ${
  //             isDev ? "'unsafe-inline' 'unsafe-eval'" : `'nonce-${nonce}'`
  //           };
  return (
    <html lang="en">
      <head>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content={`
            style-src 'self' 'unsafe-inline';
            font-src 'self';
            connect-src 'self' ${isDev ? "ws://localhost:*" : ""};
            frame-src 'none';
          `}
        /> */}
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
