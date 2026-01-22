-- ABOUTME: Creates cli_auth_sessions table for CLI authentication flow
-- ABOUTME: Stores temporary tokens exchanged during OAuth flow

-- Create CLI auth sessions table
CREATE TABLE cli_auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Index for token lookups
CREATE INDEX idx_cli_auth_session_token ON cli_auth_sessions(session_token);

-- Auto-cleanup old sessions (older than 1 hour)
CREATE INDEX idx_cli_auth_created_at ON cli_auth_sessions(created_at);

-- Enable RLS
ALTER TABLE cli_auth_sessions ENABLE ROW LEVEL SECURITY;

-- Only service role can access (all operations via API)
CREATE POLICY "cli_auth_service_only"
  ON cli_auth_sessions FOR ALL
  USING (false) WITH CHECK (false);

-- Comments
COMMENT ON TABLE cli_auth_sessions IS 'Temporary CLI auth sessions for OAuth flow';
COMMENT ON COLUMN cli_auth_sessions.session_token IS 'Token shown to user during auth';
COMMENT ON COLUMN cli_auth_sessions.completed_at IS 'When auth was completed';
