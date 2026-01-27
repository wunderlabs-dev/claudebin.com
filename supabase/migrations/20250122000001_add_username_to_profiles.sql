-- ABOUTME: Adds username column to profiles table for URL-friendly profile access
-- Triggered: 2026-01-24

-- Add username column
ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;

-- Create index for username lookups
CREATE INDEX idx_profiles_username ON profiles(username);

-- Allow public read access to profiles by username
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

-- Update the handle_new_user function to extract username from GitHub metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, "avatarUrl", username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
