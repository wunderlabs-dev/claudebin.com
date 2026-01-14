-- ABOUTME: Creates the profiles table that extends Supabase auth.users with public profile data
-- ABOUTME: Includes username for URLs, GitHub ID for uniqueness, and avatar URL

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  github_id INTEGER UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast username lookups (used in @username URLs)
CREATE INDEX idx_profiles_username ON profiles(username);

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'User profiles that extend auth.users with public information';
COMMENT ON COLUMN profiles.username IS 'Username used in URLs (@username), unique';
COMMENT ON COLUMN profiles.github_id IS 'GitHub user ID for uniqueness and deduplication';
