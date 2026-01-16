import Image from "next/image";
import { redirect } from "next/navigation";
import { profiles } from "@/lib/repos/profiles.repo";
import { createClient } from "@/lib/supabase/server";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await profiles.getById(supabase, user.id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <div className="text-center">
          {profile?.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt={profile.name || "User"}
              width={64}
              height={64}
              className="mx-auto mb-4 rounded-full"
            />
          )}
          <h1 className="mb-2 text-2xl font-bold">
            {profile?.name || "Welcome"}
          </h1>
          <p className="mb-8 text-neutral-400">You are signed in.</p>

          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg bg-neutral-800 px-6 py-2 font-medium transition-colors hover:bg-neutral-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
