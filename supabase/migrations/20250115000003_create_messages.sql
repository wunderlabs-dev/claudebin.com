-- ABOUTME: Creates messages table for parsed session content
-- ABOUTME: Normalized schema for efficient querying and display

-- Create messages table
CREATE TABLE messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  idx INTEGER NOT NULL,

  -- Message identity
  uuid TEXT NOT NULL,
  parent_uuid TEXT,

  -- Core fields
  type TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  model TEXT,
  timestamp TIMESTAMPTZ NOT NULL,

  -- Flags
  is_meta BOOLEAN NOT NULL DEFAULT false,
  is_sidechain BOOLEAN NOT NULL DEFAULT false,

  -- Content
  content JSONB NOT NULL,

  -- Denormalized for queries
  has_tool_calls BOOLEAN NOT NULL DEFAULT false,
  tool_names TEXT[] NOT NULL DEFAULT '{}',
  text_preview TEXT NOT NULL DEFAULT '',

  -- Raw data for debugging
  raw_message JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, idx)
);

-- Indexes
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_conversation ON messages(session_id, idx)
  WHERE is_meta = false AND is_sidechain = false;
CREATE INDEX idx_messages_tools ON messages USING GIN(tool_names)
  WHERE has_tool_calls = true;
CREATE INDEX idx_messages_text_preview ON messages
  USING GIN(to_tsvector('english', text_preview));

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages readable if parent session is readable
CREATE POLICY "messages_select_via_session"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = messages.session_id
      AND (s.is_public = true OR auth.uid() = s.user_id)
    )
  );

-- Only service role can insert/update/delete (background processing)
CREATE POLICY "messages_insert_service_only"
  ON messages FOR INSERT WITH CHECK (false);

CREATE POLICY "messages_update_service_only"
  ON messages FOR UPDATE
  USING (false) WITH CHECK (false);

CREATE POLICY "messages_delete_service_only"
  ON messages FOR DELETE USING (false);

-- Comments
COMMENT ON TABLE messages IS 'Parsed messages from session JSONL';
COMMENT ON COLUMN messages.idx IS 'Zero-based index preserving order';
COMMENT ON COLUMN messages.uuid IS 'Message UUID from Claude Code';
COMMENT ON COLUMN messages.parent_uuid IS 'Parent message UUID for threading';
COMMENT ON COLUMN messages.role IS 'user or assistant';
COMMENT ON COLUMN messages.model IS 'Model used for assistant responses';
COMMENT ON COLUMN messages.is_meta IS 'System message flag (hidden)';
COMMENT ON COLUMN messages.is_sidechain IS 'Internal branching flag (hidden)';
COMMENT ON COLUMN messages.content IS 'Normalized ContentBlock[] array';
COMMENT ON COLUMN messages.has_tool_calls IS 'Contains tool_use blocks';
COMMENT ON COLUMN messages.tool_names IS 'Tool names for searching';
COMMENT ON COLUMN messages.text_preview IS 'First 500 chars for search';
COMMENT ON COLUMN messages.raw_message IS 'Original raw JSON';
