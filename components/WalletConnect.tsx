'use client'

import { useConnect, useAccount } from 'wagmi'
import { useEffect } from 'react'

interface WalletConnectProps {
  onConnected: () => void
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      onConnected()
    }
  }, [isConnected, onConnected])

  return (
    <div className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold mb-2">🎨 Farcaster Otaku</h1>
        <p className="text-xl text-gray-300">
          Transform your PFP into a cute-but-scary anime creature
        </p>
        <p className="text-lg text-gray-400">
          And mint it as an NFT on Base
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold">How it works:</h2>
        <ul className="text-left space-y-3 max-w-md mx-auto">
          <li className="flex items-center space-x-3">
            <span className="text-2xl">1️⃣</span>
            <span>Connect your wallet</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-2xl">2️⃣</span>
            <span>Generate anime version with your FID on necklace</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-2xl">3️⃣</span>
            <span>Mint NFT for 0.0007 ETH + gas fees on Base</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-2xl">4️⃣</span>
            <span>Own your Otaku forever on chain</span>
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          const connector = connectors[0]
          if (connector) {
            connect({ connector })
          }
        }}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all text-lg"
      >
        🔗 Connect Wallet
      </button>

      <p className="text-sm text-gray-400">
        Using Farcaster's secure wallet integration
      </p>
    </div>
  )
}
