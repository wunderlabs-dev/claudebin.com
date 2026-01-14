-- ABOUTME: Creates trigger to auto-create profile when user signs up via OAuth
-- ABOUTME: Extracts provider info and user metadata from auth.users

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  provider_name TEXT;
  provider_user_id TEXT;
  user_name TEXT;
  user_avatar TEXT;
BEGIN
  -- Extract provider info from raw_app_meta_data
  provider_name := NEW.raw_app_meta_data->>'provider';
  provider_user_id := NEW.raw_app_meta_data->>'provider_id';

  -- Extract user info from raw_user_meta_data
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );
  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  -- Insert profile
  INSERT INTO public.profiles (id, username, provider, provider_id, avatar_url, github_id)
  VALUES (
    NEW.id,
    user_name,
    provider_name,
    provider_user_id,
    user_avatar,
    CASE WHEN provider_name = 'github' THEN (provider_user_id)::INTEGER ELSE NULL END
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Creates profile when user signs up via OAuth';
