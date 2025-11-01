'use client';

import { useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import ImagePreview from './ImagePreview';
import WalletConnect from './WalletConnect';
import LoadingSpinner from './LoadingSpinner';

interface MintingFlowProps {
  user: any;
}

export default function MintingFlow({ user }: MintingFlowProps) {
  const [step, setStep] = useState<'connect' | 'generate' | 'preview' | 'mint' | 'complete'>('connect');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const handleGenerateImage = async () => {
    if (!user?.pfp?.url) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pfpUrl: user.pfp.url,
          fid: user.fid,
        }),
      });

      const data = await res.json();
      setGeneratedImage(data.imageUrl);

      // Upload to IPFS
      const uploadRes = await fetch('/api/upload-ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setStep('preview');
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 'connect' && !isConnected && (
        <WalletConnect onConnected={() => setStep('generate')} />
      )}

      {step === 'generate' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🎨 Farcaster Otaku</h1>
          <p className="text-gray-300 mb-8">Transform your PFP into a cute-but-scary anime creature!</p>
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Generate My Otaku'}
          </button>
        </div>
      )}

      {step === 'preview' && generatedImage && (
        <ImagePreview
          imageUrl={generatedImage}
          fid={user.fid}
          onMint={() => setStep('mint')}
        />
      )}
    </div>
  );
}
