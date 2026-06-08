"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignInPage() {
  useEffect(() => {
    signIn("discord", { callbackUrl: "/dashboard" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Discord...</h1>
        <p className="text-zinc-400">Please wait while we connect you to Discord.</p>
      </div>
    </div>
  );
}
