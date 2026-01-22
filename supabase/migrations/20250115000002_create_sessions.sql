-- ABOUTME: Creates sessions table for published Claude Code sessions
-- ABOUTME: Includes background processing status and RLS policies

-- Create sessions table
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,

  -- Processing status
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'ready', 'failed')),
  storage_path TEXT,
  error_message TEXT,
  message_count INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_public ON sessions(is_public) WHERE is_public = true;
CREATE INDEX idx_sessions_status ON sessions(status) WHERE status = 'processing';

-- Auto-update updated_at
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public sessions readable by anyone, private only by owner
CREATE POLICY "sessions_select_public_or_own"
  ON sessions FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "sessions_insert_own"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "sessions_update_own"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "sessions_delete_own"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE sessions IS 'Published Claude Code sessions';
COMMENT ON COLUMN sessions.id IS 'Short URL-friendly ID (e.g., abc123xy)';
COMMENT ON COLUMN sessions.status IS 'Processing status: processing, ready, failed';
COMMENT ON COLUMN sessions.storage_path IS 'Path to raw JSONL in Supabase Storage';
COMMENT ON COLUMN sessions.error_message IS 'Error message if processing failed';
COMMENT ON COLUMN sessions.message_count IS 'Total messages after processing';
