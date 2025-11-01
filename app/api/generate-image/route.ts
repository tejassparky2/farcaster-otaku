import { NextRequest, NextResponse } from 'next/server';
import { generateAnimeImage } from '@/lib/replicate';

export async function POST(request: NextRequest) {
  try {
    const { pfpUrl, fid } = await request.json();

    if (!pfpUrl || !fid) {
      return NextResponse.json(
        { error: 'Missing pfpUrl or fid' },
        { status: 400 }
      );
    }

    const imageUrl = await generateAnimeImage(pfpUrl, fid);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
