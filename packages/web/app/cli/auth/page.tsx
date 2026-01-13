"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AuthContent = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (!code) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-400">Invalid Link</h1>
        <p className="text-neutral-400">
          This authentication link is missing the required code parameter.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold">Sign in to Claudebin</h1>
      <p className="mb-8 text-neutral-400">
        Sign in to link your account with the CLI.
      </p>

      {/* TODO: Replace with actual Supabase Auth UI */}
      <button
        type="button"
        className="w-full rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-neutral-200"
      >
        Sign in to continue
      </button>

      <p className="mt-6 text-sm text-neutral-500">
        Code: <code className="text-neutral-400">{code.slice(0, 8)}...</code>
      </p>
    </div>
  );
};

const AuthPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <Suspense
          fallback={
            <div className="text-center text-neutral-400">Loading...</div>
          }
        >
          <AuthContent />
        </Suspense>
      </div>
    </main>
  );
};

export default AuthPage;
