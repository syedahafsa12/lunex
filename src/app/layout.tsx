import type { Metadata } from "next";
import "./globals.css";
// import "./lunex.global.css";

export const metadata: Metadata = {
  title: "Lunar Landing Site Navigator | NASA Space Apps",
  description:
    "Explore lunar landing locations using NASA terrain data and JPL astronomical observations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        {children}
      </body>
    </html>
  );
}