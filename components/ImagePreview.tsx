"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import LoadingSpinner from "./LoadingSpinner";

interface ImagePreviewProps {
  imageUrl: string;
  ipfsHash: string | null;
  fid: number;
  pfpUrl: string;
  onComplete: () => void;
}

const CONTRACT_ABI = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address" },
      { name: "ipfsHash", type: "string" },
      { name: "fid", type: "uint256" },
      { name: "pfpUrl", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "payable",
  },
];

export default function ImagePreview({
  imageUrl,
  ipfsHash,
  fid,
  pfpUrl,
  onComplete,
}: ImagePreviewProps) {
  const { address } = useAccount();
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { writeContract, isPending } = useWriteContract();

  const handleMint = async () => {
    if (!writeContract || !address || !ipfsHash) {
      setError("Contract configuration failed");
      return;
    }
    setMinting(true);
    setError(null);
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "mint",
        args: [
          address as `0x${string}`,
          ipfsHash,
          BigInt(fid),
          pfpUrl,
        ],
        value: parseEther("0.0007"),
      });
      setMinting(false);
      onComplete();
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setMinting(false);
    }
  };

  return (
    <div className="bg-black rounded-2xl p-6 shadow-lg w-full max-w-xl mx-auto text-white text-center border border-purple-900">
      <h3 className="text-xl mb-2 font-bold">Your Otaku is Ready!</h3>
      <img src={imageUrl} alt="Otaku Preview" className="mx-auto rounded-lg mb-5 max-h-64 border border-purple-700"/>
      <div className="mb-4">
        <p><strong>Name:</strong> Farcaster Otaku #{fid}</p>
        <p><strong>FID:</strong> {fid}</p>
        <p><strong>IPFS:</strong> {ipfsHash ? `ipfs://${ipfsHash}` : "Pending"}</p>
        <p><strong>Chain:</strong> Base (eip155:8453)</p>
        <p><strong>Price:</strong> 0.0007 ETH + gas</p>
      </div>

      {error && (
        <div className="my-3">
          <span className="text-red-400">{error}</span>
          <button
            className="text-sm text-red-300 hover:text-red-200 mt-2 underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {(minting || isPending) && <LoadingSpinner />}
      <button
        onClick={handleMint}
        disabled={minting || isPending || !ipfsHash}
        className="mt-4 bg-purple-800 text-white px-6 py-2 rounded shadow font-bold hover:bg-purple-700 disabled:bg-gray-700 transition-all"
      >
        {minting || isPending ? "Minting to Base..." : "🚀 Mint NFT (0.0007 ETH + gas)"}
      </button>
      <div className="mt-2 text-xs text-gray-300">
        Confirm the transaction in your wallet.
      </div>
    </div>
  );
}
