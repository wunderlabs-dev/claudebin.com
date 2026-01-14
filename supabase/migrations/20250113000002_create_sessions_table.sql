-- ABOUTME: Creates the sessions table for storing published Claude coding sessions
-- ABOUTME: Uses JSONB for conversation data storage and includes public/private visibility flag

-- Create sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  conversation_data JSONB NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast user session lookups
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Create partial index for public sessions (used when filtering public sessions)
CREATE INDEX idx_sessions_public ON sessions(is_public) WHERE is_public = true;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE sessions IS 'Published Claude coding sessions with conversation data';
COMMENT ON COLUMN sessions.id IS 'Short URL-friendly ID (8-12 chars, e.g., abc123xy)';
COMMENT ON COLUMN sessions.conversation_data IS 'Raw Claude history JSON stored as JSONB';
COMMENT ON COLUMN sessions.is_public IS 'Whether session is publicly visible or private';
