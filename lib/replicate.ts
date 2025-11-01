export async function generateAnimeOtaku(
  pfpUrl: string,
  fid: number
): Promise<string> {
  const prompt = `Ultra-detailed anime character, kawaii but slightly spooky and mysterious, adorable creature with big expressive eyes, wearing a magical glowing necklace with "${fid}" engraved on it, vibrant anime colors, mystical aura, high quality illustration, detailed art, perfect composition`;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_KEY}`,
    },
    body: JSON.stringify({
      version: 'c221b2b3ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316',
      input: {
        prompt,
        image: pfpUrl,
        guidance: 7.5,
        num_inference_steps: 20,
        height: 1024,
        width: 1024,
      },
    }),
  });

  const data = await response.json();
  return data.output?.[0] || '';
}
