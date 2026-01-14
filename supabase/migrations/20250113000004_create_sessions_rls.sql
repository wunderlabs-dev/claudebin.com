-- ABOUTME: Row Level Security policies for sessions table
-- ABOUTME: Public sessions readable by all, private sessions only by owner, full CRUD for owners

-- Enable Row Level Security on sessions table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public sessions, authenticated users can read their own sessions
CREATE POLICY "sessions_select_public_or_own"
  ON sessions
  FOR SELECT
  USING (
    is_public = true
    OR auth.uid() = user_id
  );

-- Policy: Authenticated users can insert their own sessions
CREATE POLICY "sessions_insert_own"
  ON sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own sessions
CREATE POLICY "sessions_update_own"
  ON sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own sessions
CREATE POLICY "sessions_delete_own"
  ON sessions
  FOR DELETE
  USING (auth.uid() = user_id);
