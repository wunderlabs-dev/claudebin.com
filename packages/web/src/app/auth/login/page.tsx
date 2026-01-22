"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/supabase/client";

const LoginContent = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-2 font-bold text-2xl">Sign in to Claudebin</h1>
      <p className="mb-8 text-neutral-400">Sign in to publish and manage your sessions.</p>

      {error && (
        <div className="mb-6 rounded-lg bg-red-900/50 p-4 text-left text-red-200">
          <p className="font-medium">Authentication failed</p>
          <p className="text-red-300 text-sm">{errorDescription || error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-neutral-800 px-6 py-3 font-medium transition-colors hover:bg-neutral-700 disabled:opacity-50"
      >
        <GitHubIcon />
        Continue with GitHub
      </button>
    </div>
  );
};

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <Suspense fallback={<div className="text-center text-neutral-400">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </main>
  );
};

export default LoginPage;
