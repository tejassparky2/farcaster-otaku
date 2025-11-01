"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import ImagePreview from "./ImagePreview";
import WalletConnect from "./WalletConnect";
import LoadingSpinner from "./LoadingSpinner";

interface MintingFlowProps {
  user: {
    fid: number;
    username: string;
    pfp: { url: string };
  } | null;
}

export default function MintingFlow({ user }: MintingFlowProps) {
  const [step, setStep] = useState<"connect" | "generate" | "preview" | "complete">("connect");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  // Gating: if wallet is not connected, show WalletConnect
  if (!isConnected || !address) {
    return <WalletConnect onConnected={() => setStep("generate")} />;
  }

  // Step logic
  const handleGenerateImage = async () => {
    if (!user?.pfp?.url) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pfpUrl: user.pfp.url,
          fid: user.fid,
        }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);

      // Upload to IPFS
      const uploadRes = await fetch("/api/upload-ipfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: data.imageUrl,
          metadata: {
            fid: user.fid,
            pfpUrl: user.pfp.url,
          },
        }),
      });
      const uploadData = await uploadRes.json();
      setIpfsHash(uploadData.ipfsHash);

      setStep("preview");
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  if (step === "generate") {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🎨 Farcaster Otaku</h1>
        <p className="text-gray-300 mb-6">Transform your PFP into a cute-but-scary anime creature!</p>
        <button
          onClick={handleGenerateImage}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : "Generate My Otaku"}
        </button>
      </div>
    );
  }

  if (step === "preview" && generatedImage && ipfsHash && user) {
    return (
      <ImagePreview
        imageUrl={generatedImage}
        ipfsHash={ipfsHash}
        fid={user.fid}
        pfpUrl={user.pfp.url}
        onComplete={() => setStep("complete")}
      />
    );
  }

  if (step === "complete") {
    return (
      <div className="flex items-center justify-center min-h-60vh text-center">
        <h2 className="text-2xl font-bold mb-3">🎉 Success!</h2>
        <p className="mb-2">Your Otaku NFT was minted to your wallet.</p>
        <button
          onClick={() => setStep("generate")}
          className="mt-4 bg-purple-700 px-4 py-2 text-white font-bold rounded hover:bg-purple-800 transition"
        >
          Mint Another
        </button>
      </div>
    );
  }

  // Fallback/default
  return null;
}
