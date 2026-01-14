import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <div className="text-center">
          {profile?.avatar_url && (
            <Image
              src={profile.avatar_url}
              alt={profile.username || "User"}
              width={64}
              height={64}
              className="mx-auto mb-4 rounded-full"
            />
          )}
          <h1 className="mb-2 text-2xl font-bold">
            {profile?.username || "Welcome"}
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
