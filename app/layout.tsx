import type { Metadata } from "next";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

export const metadata: Metadata = {
  title: "Farcaster Otaku",
  description: "Transform your Farcaster PFP into cute anime NFTs on Base",
  metadataBase: new URL("https://pushpabeautytips.store"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const miniAppConfig = {
    version: 1,
    name: "Farcaster Otaku",
    iconUrl: "https://pushpabeautytips.store/icon.png",
    homeUrl: "https://pushpabeautytips.store",
    subtitle: "Remix your Farcaster PFP",
    description: "Transform your Farcaster PFP into cute-but-scary anime creatures and mint as NFTs on Base.",
    primaryCategory: "art-creativity",
    splashImageUrl: "https://pushpabeautytips.store/splash.png",
    splashBackgroundColor: "#1a0736",
    tags: ["anime", "avatar", "farcaster", "nft", "otaku"],
    heroImageUrl: "https://pushpabeautytips.store/hero.png",
    tagline: "Mint your Farcaster Otaku now!",
    ogTitle: "Otaku Remix",
    ogDescription: "Transform your PFP into anime and mint instantly!",
    ogImageUrl: "https://pushpabeautytips.store/hero.png",
  };

  return (
    <html lang="en">
      <head>
        {/* Farcaster Mini-App Manifest */}
        <meta name="fc:miniapp" content={JSON.stringify(miniAppConfig)} />
        
        {/* Standard OG Tags */}
        <meta property="og:title" content="Farcaster Otaku" />
        <meta property="og:description" content="Transform your Farcaster PFP into anime NFTs" />
        <meta property="og:image" content="https://pushpabeautytips.store/hero.png" />
      </head>
      <body className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
