'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import MintingFlow from '@/components/MintingFlow'

interface User {
  fid: number
  username: string
  pfp: {
    url: string
  }
}

export default function Home() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        const context = await sdk.context
        setUser({
          fid: context.user.fid,
          username: context.user.username,
          pfp: {
            url: context.user.pfp.url,
          },
        })
        await sdk.actions.ready()
        setReady(true)
      } catch (err) {
        console.error('Failed to initialize mini app:', err)
        setError('Failed to load mini-app. Please try again.')
        setReady(true)
      }
    }

    initializeMiniApp()
  }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">✨</div>
          <h1 className="text-3xl font-bold">Loading Farcaster Otaku...</h1>
          <p className="text-gray-400">Getting your creativity ready</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <h1 className="text-3xl font-bold">{error}</h1>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <MintingFlow user={user} />
    </main>
  )
}

// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { pfpUrl, fid } = await request.json()

    if (!pfpUrl || !fid) {
      return NextResponse.json(
        { error: 'Missing pfpUrl or fid' },
        { status: 400 }
      )
    }

    const prompt = `Ultra-detailed anime character, kawaii but slightly spooky and mysterious, adorable creature with big expressive eyes, wearing a magical glowing necklace with "${fid}" engraved on it in silver text, vibrant anime colors, mystical aura, high quality illustration, detailed art, perfect composition, inspired by the user's original profile picture`

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: 'c221b2b3ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
        input: {
          prompt,
          guidance: 7.5,
          num_inference_steps: 20,
          height: 1024,
          width: 1024,
        },
      }),
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    // Poll for completion if using webhook
    let output = data.output
    let attempts = 0
    while (!output && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${data.id}`,
        {
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`,
          },
        }
      )
      const statusData = await statusResponse.json()
      output = statusData.output
      attempts++
    }

    return NextResponse.json({ imageUrl: output?.[0] || data.output })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

// app/api/upload-ipfs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import fetch from 'node-fetch'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, metadata } = await request.json()

    if (!imageUrl || !metadata) {
      return NextResponse.json(
        { error: 'Missing imageUrl or metadata' },
        { status: 400 }
      )
    }

    const metadataContent = {
      name: `Farcaster Otaku #${metadata.fid}`,
      description: `A unique anime creature transformation of FID ${metadata.fid}'s profile picture`,
      image: imageUrl,
      attributes: [
        {
          trait_type: 'FID',
          value: metadata.fid.toString(),
        },
        {
          trait_type: 'Original PFP',
          value: metadata.pfpUrl,
        },
        {
          trait_type: 'Generation Date',
          value: new Date().toISOString().split('T')[0],
        },
      ],
    }

    const formData = new FormData()
    formData.append('file', JSON.stringify(metadataContent), 'metadata.json')

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData as any,
    })

    const data = await response.json()

    if (!data.IpfsHash) {
      throw new Error('Failed to pin to IPFS')
    }

    return NextResponse.json({ ipfsHash: data.IpfsHash })
  } catch (error) {
    console.error('IPFS upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload to IPFS' },
      { status: 500 }
    )
  }
}

// components/MintingFlow.tsx
'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import ImagePreview from './ImagePreview'
import WalletConnect from './WalletConnect'
import GenerationStep from './GenerationStep'

interface User {
  fid: number
  username: string
  pfp: {
    url: string
  }
}

type Step = 'connect' | 'generate' | 'preview' | 'complete'

interface MintingFlowProps {
  user: User | null
}

export default function MintingFlow({ user }: MintingFlowProps) {
  const [step, setStep] = useState<Step>('connect')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [ipfsHash, setIpfsHash] = useState<string | null>(null)
  const { isConnected } = useAccount()

  const handleGenerateSuccess = (imageUrl: string, hash: string) => {
    setGeneratedImage(imageUrl)
    setIpfsHash(hash)
    setStep('preview')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {step === 'connect' && !isConnected && (
        <WalletConnect onConnected={() => setStep('generate')} />
      )}

      {step === 'generate' && user && (
        <GenerationStep user={user} onSuccess={handleGenerateSuccess} />
      )}

      {step === 'preview' && generatedImage && user && (
        <ImagePreview
          imageUrl={generatedImage}
          ipfsHash={ipfsHash}
          fid={user.fid}
          pfpUrl={user.pfp.url}
          onComplete={() => setStep('complete')}
        />
      )}

      {step === 'complete' && (
        <div className="text-center space-y-8 py-16">
          <div className="text-8xl animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold">NFT Minted Successfully!</h1>
          <p className="text-xl text-gray-300">
            Your Farcaster Otaku has been immortalized on Base
          </p>
          <button
            onClick={() => {
              setStep('generate')
              setGeneratedImage(null)
              setIpfsHash(null)
            }}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg"
          >
            Create Another Otaku
          </button>
        </div>
      )}
    </div>
  )
}