-- ABOUTME: Backfills bio from auth.users metadata for existing profiles
-- ABOUTME: Uses SECURITY DEFINER function to access auth.users table

-- Create a function to backfill bio (needs elevated privileges)
CREATE OR REPLACE FUNCTION backfill_profile_bio() RETURNS void AS $$
BEGIN
  UPDATE profiles p
  SET bio = (
    SELECT raw_user_meta_data->>'bio'
    FROM auth.users u
    WHERE u.id = p.id
  )
  WHERE p.bio IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the backfill
SELECT backfill_profile_bio();

-- Drop the function after use (one-time migration)
DROP FUNCTION backfill_profile_bio();
