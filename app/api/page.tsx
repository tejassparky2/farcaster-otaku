'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import MintingFlow from '@/components/MintingFlow';

export default function Home() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        setUser(context.user);
        setReady(true);
      } catch (error) {
        console.error('Failed to initialize mini app:', error);
      }
    };

    initializeMiniApp();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Farcaster Otaku...</h1>
          <div className="animate-spin">✨</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <MintingFlow user={user} />
    </main>
  );
}
