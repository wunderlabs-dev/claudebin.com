declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_SENTRY_ENV: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    OPENROUTER_API_KEY: string;
  }
}
