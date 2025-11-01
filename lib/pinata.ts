export async function uploadToPinata(
  imageUrl: string,
  metadata: {
    fid: number;
    pfpUrl: string;
  }
): Promise<string> {
  const metadataContent = {
    name: `Farcaster Otaku #${metadata.fid}`,
    description: `A unique anime creature transformation of FID ${metadata.fid}'s profile picture`,
    image: imageUrl,
    attributes: [
      {
        trait_type: 'FID',
        value: metadata.fid,
      },
      {
        trait_type: 'Original PFP',
        value: metadata.pfpUrl,
      },
      {
        trait_type: 'Generation',
        value: new Date().toISOString(),
      },
    ],
  };

  const formData = new FormData();
  const metadataBlob = new Blob([JSON.stringify(metadataContent)], {
    type: 'application/json',
  });
  formData.append('file', metadataBlob, 'metadata.json');

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.IpfsHash as string;
}
