-- ABOUTME: Removes email from profiles and restricts public SELECT to published authors
-- ABOUTME: Fixes vulnerability where anon key could enumerate all profiles + emails
-- ABOUTME: See https://github.com/wunderlabs-dev/claudebin.com/issues/50

-- ============================================================
-- STEP 1: Remove email column (PII — belongs in auth.users only)
-- ============================================================

DROP INDEX IF EXISTS idx_profiles_email;
ALTER TABLE profiles DROP COLUMN IF EXISTS email;

-- ============================================================
-- STEP 2: Update handle_new_user trigger (stop inserting email)
-- ============================================================

-- Previous version (from 20250128000001_remove_bio_column.sql) inserted:
--   (id, email, name, "avatarUrl", username)
-- This version removes email from the INSERT.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, "avatarUrl", username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STEP 3: Replace USING(true) with restricted policy
-- ============================================================

-- Drop the permissive "anyone can read any profile" policy
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;

-- Profiles readable only if user has at least one public session.
-- Combined with existing profiles_select_own (OR'd by Postgres):
--   Owner can always see own profile (via profiles_select_own)
--   Anyone can see profiles of users with public sessions (this policy)
--   Full enumeration of ALL profiles is blocked
CREATE POLICY "profiles_select_with_public_sessions"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s."userId" = profiles.id
      AND s."isPublic" = true
    )
  );
