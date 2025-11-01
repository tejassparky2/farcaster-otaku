import { NextRequest, NextResponse } from 'next/server';
import { uploadToPinata } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, metadata } = await request.json();

    const ipfsHash = await uploadToPinata(imageUrl, metadata);

    return NextResponse.json({ ipfsHash });
  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload to IPFS' },
      { status: 500 }
    );
  }
}
