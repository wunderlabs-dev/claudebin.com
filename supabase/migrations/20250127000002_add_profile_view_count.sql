-- ABOUTME: Adds viewCount column to profiles for tracking profile page views

-- Add viewCount column
ALTER TABLE profiles ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN profiles."viewCount" IS 'Number of times this profile has been viewed';

-- Create RPC function to increment view count atomically
CREATE OR REPLACE FUNCTION increment_profile_view_count(profile_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET "viewCount" = "viewCount" + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_profile_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_profile_view_count(UUID) TO anon;
