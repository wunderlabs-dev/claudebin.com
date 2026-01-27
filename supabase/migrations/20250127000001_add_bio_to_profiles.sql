-- ABOUTME: Adds bio column to profiles and updates trigger to pull from GitHub

-- Add bio column
ALTER TABLE profiles ADD COLUMN bio TEXT;

COMMENT ON COLUMN profiles.bio IS 'User bio, pulled from GitHub on signup';

-- Update trigger to include bio from GitHub metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, bio)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    NEW.raw_user_meta_data->>'bio'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
