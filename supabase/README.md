# Claudebin Database Setup

This directory contains SQL migrations for setting up the Claudebin database on Supabase.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Either:
   - Supabase CLI installed (`npm install -g supabase`), OR
   - Access to your Supabase dashboard

## Database Schema

The database consists of two main tables:

- **profiles**: User profiles extending `auth.users`
- **sessions**: Published Claude coding sessions

See `docs/12-12-2025-database-schema.md` for detailed schema documentation.

## Setup Options

### Option 1: Using Supabase CLI (Recommended)

1. Install the Supabase CLI:
```bash
npm install -g supabase
```

2. Link your local project to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

3. Run the migrations:
```bash
supabase db push
```

The migrations will be applied in order:
- `20251212000001_create_profiles_table.sql`
- `20251212000002_create_sessions_table.sql`
- `20251212000003_create_profiles_rls.sql`
- `20251212000004_create_sessions_rls.sql`

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order:
   1. `20251212000001_create_profiles_table.sql`
   2. `20251212000002_create_sessions_table.sql`
   3. `20251212000003_create_profiles_rls.sql`
   4. `20251212000004_create_sessions_rls.sql`

Copy and paste the contents of each file into the SQL Editor and click "Run".

## Verify Setup

After running the migrations, verify the setup:

1. Check that tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'sessions');
```

2. Check that RLS is enabled:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'sessions');
```

Both tables should show `rowsecurity = true`.

3. Check that policies exist:
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'sessions');
```

You should see 4 policies for profiles and 4 policies for sessions.

## Environment Variables

After setting up the database, you'll need to configure environment variables for the web and CLI packages.

### For Web App (`app/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in your Supabase dashboard under Settings > API.

## Next Steps

1. Set up GitHub OAuth in Supabase (see `docs/12-12-2025-authentication.md`)
2. Configure environment variables
3. Test the authentication flow

## Troubleshooting

### "relation already exists" error
This means the table or index already exists. You can either:
- Drop the existing tables and re-run migrations, OR
- Skip that specific migration file

### RLS policies not working
Make sure:
1. RLS is enabled on both tables
2. All policies are created successfully
3. You're using the correct authentication token

### Migration order issues
Always run migrations in the numbered order. The sessions table depends on the profiles table, so profiles must be created first.
