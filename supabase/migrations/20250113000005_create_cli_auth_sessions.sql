-- ABOUTME: Creates CLI auth sessions table for device code flow authentication
-- ABOUTME: Temporary storage for OAuth tokens during CLI authentication polling

CREATE TABLE cli_auth_sessions (
  code TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_cli_auth_sessions_created
  ON cli_auth_sessions(created_at)
  WHERE completed_at IS NULL;

CREATE POLICY "cli_auth_insert" ON cli_auth_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "cli_auth_select" ON cli_auth_sessions
  FOR SELECT USING (true);

CREATE POLICY "cli_auth_update" ON cli_auth_sessions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "cli_auth_delete" ON cli_auth_sessions
  FOR DELETE USING (true);

ALTER TABLE cli_auth_sessions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE cli_auth_sessions IS 'Temporary storage for CLI authentication device code flow';
COMMENT ON COLUMN cli_auth_sessions.code IS 'One-time code shown to CLI user (e.g., a7x9k2m)';
COMMENT ON COLUMN cli_auth_sessions.completed_at IS 'Timestamp when user completed auth in browser (NULL until done)';
