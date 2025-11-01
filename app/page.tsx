"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import MintingFlow from "../components/MintingFlow";

interface User {
  fid: number;
  username: string;
  pfp: { url: string };
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get user context from Farcaster
        const context = await sdk.context();
        setUser({
          fid: context.user.fid,
          username: context.user.username,
          pfp: { url: context.user.pfp.url },
        });

        // Signal app is ready (hides splash screen)
        await sdk.actions.ready();
        setReady(true);
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to initialize mini-app");
        setReady(true);
      }
    };

    initApp();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Loading Farcaster Otaku...</h2>
          <p className="text-gray-300 mt-2">Getting your creativity ready</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-br from-purple-900 via-black to-pink-900 min-h-screen">
      <MintingFlow user={user} />
    </main>
  );
}
