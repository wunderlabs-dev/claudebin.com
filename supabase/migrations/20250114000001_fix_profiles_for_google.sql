-- ABOUTME: Makes github_id optional and adds provider fields to support Google OAuth
-- ABOUTME: Existing GitHub users are backfilled with provider='github'

-- Allow github_id to be NULL for non-GitHub auth providers
ALTER TABLE profiles ALTER COLUMN github_id DROP NOT NULL;

-- Add provider column to track auth source
ALTER TABLE profiles ADD COLUMN provider TEXT;

-- Add provider_id for generic provider user ID (works for GitHub, Google, etc.)
ALTER TABLE profiles ADD COLUMN provider_id TEXT;

-- Create unique constraint on provider + provider_id combo
ALTER TABLE profiles ADD CONSTRAINT unique_provider_id UNIQUE (provider, provider_id);

-- Backfill existing rows (all GitHub)
UPDATE profiles SET provider = 'github', provider_id = github_id::TEXT WHERE github_id IS NOT NULL;

COMMENT ON COLUMN profiles.provider IS 'Auth provider: github, google, etc.';
COMMENT ON COLUMN profiles.provider_id IS 'User ID from the auth provider';
