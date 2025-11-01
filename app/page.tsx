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
        // Console log for debugging
        console.log("User Context:", context.user);
        setUser({
          fid: context.user.fid ?? 0,
          username: context.user.username ?? "",
          // Change this line according to your actual context structure!
          pfp: { url: context.user.pfp_url ?? "" }
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

  // ...rest of your rendering code
}
