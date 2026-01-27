-- ABOUTME: Re-run bio backfill after users updated their GitHub profiles

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

SELECT backfill_profile_bio();

DROP FUNCTION backfill_profile_bio();
