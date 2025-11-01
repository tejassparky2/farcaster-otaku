"use client";
import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import MintingFlow from "@/components/MintingFlow";

interface User {
  fid: number;
  username: string;
  pfp: { url: string };
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMiniApp = async () => {
      try {
        const context = await sdk.context;
        setUser({
          fid: context.user.fid,
          username: context.user.username,
          pfp: { url: context.user.pfp.url },
        });
        await sdk.actions.ready();
        setReady(true);
      } catch (err) {
        console.error("Failed to initialize mini app:", err);
        setError("Failed to load mini-app. Please try again.");
        setReady(true);
      }
    };

    initializeMiniApp();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Farcaster Otaku...</h1>
          <p>Getting your creativity ready</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Mini-App</h1>
          <p className="text-red-500">{error}</p>
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