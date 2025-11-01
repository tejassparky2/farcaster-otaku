'use client'

import { useState } from 'react'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import LoadingSpinner from './LoadingSpinner'

const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'ipfsHash', type: 'string' },
      { name: 'fid', type: 'uint256' },
      { name: 'pfpUrl', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'payable',
  },
]

interface ImagePreviewProps {
  imageUrl: string
  ipfsHash: string | null
  fid: number
  pfpUrl: string
  onComplete: () => void
}

export default function ImagePreview({
  imageUrl,
  ipfsHash,
  fid,
  pfpUrl,
  onComplete,
}: ImagePreviewProps) {
  const { address } = useAccount()
  const [minting, setMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'mint',
    args: [
      address as `0x${string}`,
      ipfsHash || '',
      BigInt(fid),
      pfpUrl,
    ],
    value: parseEther('0.0007'),
    enabled: !!ipfsHash && !!address,
  })

  const { write, isLoading } = useContractWrite({
    ...config,
    async onSuccess(data) {
      setMinting(true)
      try {
        await data.wait()
        onComplete()
      } catch (err) {
        console.error('Transaction error:', err)
        setError('Transaction failed')
        setMinting(false)
      }
    },
    onError(error) {
      console.error('Mint error:', error)
      setError(error.message || 'Failed to mint NFT')
      setMinting(false)
    },
  })

  const handleMint = async () => {
    if (!write) {
      setError('Contract configuration failed')
      return
    }
    setMinting(true)
    write()
  }

  return (
    <div className="text-center space-y-8 py-8">
      <h1 className="text-4xl font-bold">Your Otaku is Ready!</h1>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur-xl opacity-50"></div>
        <img
          src={imageUrl}
          alt="Your generated Otaku"
          className="relative w-full max-w-sm mx-auto rounded-lg border-2 border-white/20"
        />
      </div>

      <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-lg p-6 space-y-3 max-w-md mx-auto">
        <div className="text-left space-y-2">
          <p className="text-sm text-gray-400">Details:</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-400">Name:</span> Farcaster Otaku #{fid}
            </p>
            <p>
              <span className="text-gray-400">FID:</span> {fid}
            </p>
            <p className="break-all">
              <span className="text-gray-400">IPFS:</span> ipfs://{ipfsHash}
            </p>
            <p>
              <span className="text-gray-400">Chain:</span> Base (eip155:8453)
            </p>
            <p>
              <span className="text-gray-400">Price:</span> 0.0007 ETH + gas
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-300 hover:text-red-200 mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <button
        onClick={handleMint}
        disabled={!write || minting || isLoading}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-3 mx-auto"
      >
        {(minting || isLoading) && <LoadingSpinner />}
        {minting || isLoading ? 'Minting to Base...' : '🚀 Mint NFT (0.0007 ETH + gas)'}
      </button>

      <p className="text-sm text-gray-400">
        Confirm the transaction in your wallet
      </p>
    </div>
  )
}
