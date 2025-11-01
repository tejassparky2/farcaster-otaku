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

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context();
        setUser({
          fid: context.user.fid,
          username: context.user.username,
          pfp: { url: context.user.pfp.url },
        });
        await sdk.actions.ready();
        setReady(true);
      } catch (err) {
        setReady(true);
      }
    };
    init();
  }, []);

  if (!ready) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return <MintingFlow user={user} />;
}
