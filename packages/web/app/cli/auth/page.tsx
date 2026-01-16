import {
  completeCliAuthSession,
  getCliAuthSessionByToken,
} from "@/lib/repos/cli-auth.repo";
import { createClient } from "@/lib/supabase/server";

interface Props {
  searchParams: Promise<{ code?: string }>;
}

const CliAuthPage = async ({ searchParams }: Props) => {
  const { code } = await searchParams;

  if (!code) {
    return (
      <Layout>
        <ErrorState title="Invalid Link">
          This authentication link is missing the required code parameter.
        </ErrorState>
      </Layout>
    );
  }

  const cliSession = await getCliAuthSessionByToken(code);

  if (!cliSession) {
    return (
      <Layout>
        <ErrorState title="Invalid Code">
          This authentication code was not found. It may have expired.
        </ErrorState>
      </Layout>
    );
  }

  if (cliSession.completedAt) {
    return (
      <Layout>
        <SuccessState />
      </Layout>
    );
  }

  if (cliSession.expiresAt && cliSession.expiresAt < new Date()) {
    return (
      <Layout>
        <ErrorState title="Code Expired">
          This authentication code has expired. Please run the auth command
          again.
        </ErrorState>
      </Layout>
    );
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <Layout>
        <ErrorState title="Not Authenticated">
          Something went wrong. Please try again.
        </ErrorState>
      </Layout>
    );
  }

  try {
    await completeCliAuthSession(
      code,
      session.user.id,
      session.access_token,
      session.refresh_token,
    );
  } catch {
    return (
      <Layout>
        <ErrorState title="Authentication Failed">
          Failed to complete authentication. Please try again.
        </ErrorState>
      </Layout>
    );
  }

  return (
    <Layout>
      <SuccessState />
    </Layout>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <main className="flex min-h-screen flex-col items-center justify-center p-8">
    <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8">
      {children}
    </div>
  </main>
);

const SuccessState = () => (
  <div className="text-center">
    <div className="mb-4 text-4xl">✓</div>
    <h1 className="mb-2 text-2xl font-bold text-green-400">Authenticated!</h1>
    <p className="text-neutral-400">
      You can close this window and return to your terminal.
    </p>
  </div>
);

const ErrorState = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="text-center">
    <h1 className="mb-4 text-2xl font-bold text-red-400">{title}</h1>
    <p className="text-neutral-400">{children}</p>
  </div>
);

export default CliAuthPage;
