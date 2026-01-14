-- ABOUTME: Adds background processing support for large sessions
-- ABOUTME: Introduces status tracking, messages table, and storage reference

-- Add columns to sessions table for processing status and storage
ALTER TABLE sessions
  ADD COLUMN status TEXT NOT NULL DEFAULT 'ready'
    CHECK (status IN ('processing', 'ready', 'failed')),
  ADD COLUMN storage_path TEXT,
  ADD COLUMN error_message TEXT,
  ADD COLUMN message_count INTEGER;

-- Create index for finding sessions that are still processing
CREATE INDEX idx_sessions_status ON sessions(status) WHERE status = 'processing';

-- Create messages table for parsed conversation data
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  idx INTEGER NOT NULL,
  type TEXT NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, idx)
);

-- Create index for efficient session message retrieval
CREATE INDEX idx_messages_session_id ON messages(session_id);

-- Add documentation comments
COMMENT ON COLUMN sessions.status IS 'Processing status: processing, ready, failed';
COMMENT ON COLUMN sessions.storage_path IS 'Path to raw JSONL in Supabase Storage (bucket: sessions)';
COMMENT ON COLUMN sessions.error_message IS 'Error message if processing failed';
COMMENT ON COLUMN sessions.message_count IS 'Total number of messages after processing';

COMMENT ON TABLE messages IS 'Individual messages extracted from session JSONL';
COMMENT ON COLUMN messages.idx IS 'Zero-based index preserving message order';
COMMENT ON COLUMN messages.type IS 'Message type from JSONL (e.g., user, assistant, system)';
COMMENT ON COLUMN messages.message IS 'Full message JSON including content, tool calls, etc.';
