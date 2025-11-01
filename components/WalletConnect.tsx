"use client";

import { useConnect, useAccount } from "wagmi";
import { useEffect } from "react";

interface WalletConnectProps {
  onConnected: () => void;
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      onConnected();
    }
  }, [isConnected, onConnected]);

  return (
    <div className="text-center space-y-8 py-16">
      <h1 className="text-5xl font-bold mb-2">Farcaster Otaku</h1>
      <p className="text-xl text-gray-300">Transform your PFP into a cute-but-scary anime creature</p>
      <p className="text-lg text-gray-400">And mint it as an NFT on Base</p>
      <p className="text-md text-purple-400">Using Farcaster's secure wallet integration</p>
      <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ul className="text-left space-y-3 max-w-md mx-auto">
          <li className="flex items-center space-x-3">
            <span className="text-2xl">1</span>
            <span>Connect your wallet</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-2xl">2</span>
            <span>Generate anime version with your FID on next step</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="text-2xl">3</span>
            <span>Mint as NFT on Base chain</span>
          </li>
        </ul>
        <button
          className="mt-8 px-6 py-3 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 transition"
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
