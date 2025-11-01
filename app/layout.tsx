import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Farcaster Otaku - NFT Mini-App',
  description: 'Transform your Farcaster PFP into cute-but-scary anime creatures and mint as NFTs on Base',
  metadataBase: new URL('https://farcaster-otaku.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:miniapp" content='{"version":"next","imageUrl":"https://farcaster-otaku.vercel.app/hero.png","button":{"title":"Launch Otaku","action":{"type":"launch_miniapp","name":"Farcaster Otaku","url":"https://farcaster-otaku.vercel.app"}}}' />
      </head>
      <body className="bg-gradient-to-br from-purple-900 via-black to-pink-900 min-h-screen text-white">
        {children}
      </body>
    </html>
  )
}