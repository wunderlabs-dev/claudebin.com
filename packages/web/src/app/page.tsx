const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Claudebin</h1>
        <p className="mb-8 text-lg text-neutral-400">
          A pastebin for vibes. Share your Claude Code sessions with the world.
        </p>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
          <code className="text-sm text-neutral-300">
            npx claudebin publish
          </code>
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Run this command after a coding session to get a shareable link.
        </p>
      </div>
    </main>
  );
};

export default HomePage;
