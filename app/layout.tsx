import type { Metadata } from "next";
import "./globals.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "../lib/wagmi";

export const metadata: Metadata = {
  title: "Farcaster Otaku",
  description: "Transform your Farcaster PFP into anime NFTs",
  metadataBase: new URL("https://pushpabeautytips.store"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "1",
            name: "Farcaster Otaku",
            homeUrl: "https://pushpabeautytips.store",
            iconUrl: "https://pushpabeautytips.store/icon.png",
            splashImageUrl: "https://pushpabeautytips.store/splash.png",
            splashBackgroundColor: "#1a0736",
            subtitle: "Remix your PFP",
            description: "Transform Farcaster PFP into anime NFTs",
            primaryCategory: "art-creativity",
            tags: ["anime", "avatar", "nft"],
            ogTitle: "Otaku Remix",
            ogDescription: "Transform PFP to anime",
            ogImageUrl: "https://pushpabeautytips.store/hero.png",
          })}
        />
      </head>
      <body className="bg-gradient-to-br from-purple-900 via-black to-pink-900 text-white">
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
