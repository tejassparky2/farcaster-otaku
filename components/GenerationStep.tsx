'use client'

import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface User {
  fid: number
  username: string
  pfp: {
    url: string
  }
}

interface GenerationStepProps {
  user: User
  onSuccess: (imageUrl: string, ipfsHash: string) => void
}

export default function GenerationStep({ user, onSuccess }: GenerationStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Generate image
      console.log('Generating image for FID:', user.fid)
      const genRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pfpUrl: user.pfp.url,
          fid: user.fid,
        }),
      })

      if (!genRes.ok) {
        throw new Error('Failed to generate image')
      }

      const genData = await genRes.json()
      if (!genData.imageUrl) {
        throw new Error('No image URL returned')
      }

      console.log('Image generated:', genData.imageUrl)

      // Step 2: Upload to IPFS
      console.log('Uploading to IPFS...')
      const uploadRes = await fetch('/api/upload-ipfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: genData.imageUrl,
          metadata: {
            fid: user.fid,
            pfpUrl: user.pfp.url,
          },
        }),
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const uploadData = await uploadRes.json()
      if (!uploadData.ipfsHash) {
        throw new Error('No IPFS hash returned')
      }

      console.log('IPFS hash:', uploadData.ipfsHash)
      onSuccess(genData.imageUrl, uploadData.ipfsHash)
    } catch (err) {
      console.error('Generation error:', err)
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center space-y-8 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Ready to create your Otaku?</h1>
        <p className="text-lg text-gray-300">
          We'll transform your profile picture into a magical anime creature
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-lg p-8 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Your Profile</p>
          <div className="flex items-center justify-center space-x-4">
            <img
              src={user.pfp.url}
              alt="Your PFP"
              className="w-16 h-16 rounded-full border-2 border-pink-500"
            />
            <div className="text-4xl">→</div>
            <div className="w-16 h-16 rounded-full border-2 border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              ✨
            </div>
          </div>
          <p className="text-sm text-gray-400">Your Otaku</p>
        </div>

        <div className="text-sm text-gray-300 space-y-2 text-left max-w-sm mx-auto">
          <p>✓ Includes your FID ({user.fid}) on a magical necklace</p>
          <p>✓ 1024x1024 high-quality anime art</p>
          <p>✓ Pinned to IPFS via Pinata</p>
          <p>✓ Ready to mint on Base</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200">Error: {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-300 hover:text-red-200 mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-3 mx-auto"
      >
        {loading && <LoadingSpinner />}
        {loading ? 'Generating Your Otaku...' : '🎨 Generate My Otaku'}
      </button>

      {loading && (
        <div className="text-gray-400 space-y-2">
          <p className="text-sm">This may take 10-30 seconds...</p>
          <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}