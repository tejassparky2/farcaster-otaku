"use client";

import { useEffect, useState } from "react";
import MintingFlow from "../components/MintingFlow"; // Adjust to "./components/MintingFlow" if components folder is inside app/
import sdk from "farcasterminiapp-sdk"; // Or import context provider if used

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
    async function fetchUser() {
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
        setError("Failed to load mini-app context");
        setReady(true);
      }
    }
    fetchUser();
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-semibold">{error}</div>
      </div>
    );
  }
  return <MintingFlow user={user} />;
}
