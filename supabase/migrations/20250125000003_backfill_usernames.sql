-- ABOUTME: Backfills username from auth.users metadata for existing profiles
-- ABOUTME: Uses SECURITY DEFINER function to access auth.users table

-- Create a function to backfill usernames (needs elevated privileges)
CREATE OR REPLACE FUNCTION backfill_profile_usernames() RETURNS void AS $$
BEGIN
  UPDATE profiles p
  SET username = (
    SELECT raw_user_meta_data->>'user_name'
    FROM auth.users u
    WHERE u.id = p.id
  )
  WHERE p.username IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the backfill
SELECT backfill_profile_usernames();

-- Drop the function after use (one-time migration)
DROP FUNCTION backfill_profile_usernames();
