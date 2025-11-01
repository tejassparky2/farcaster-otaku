import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farcaster Otaku - NFT Mini-App",
  description: "Transform your Farcaster PFP into cute-but-scary anime creatures and mint as NFTs on Base",
  metadataBase: new URL("https://farcaster-otaku.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
