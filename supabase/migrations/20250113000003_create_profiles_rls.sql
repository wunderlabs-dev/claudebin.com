-- ABOUTME: Row Level Security policies for profiles table
-- ABOUTME: Public read access, authenticated users can update only their own profile

-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all profiles (needed for public session views)
CREATE POLICY "profiles_select_all"
  ON profiles
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own profile during signup
CREATE POLICY "profiles_insert_own"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update only their own profile
CREATE POLICY "profiles_update_own"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can delete only their own profile
CREATE POLICY "profiles_delete_own"
  ON profiles
  FOR DELETE
  USING (auth.uid() = id);
