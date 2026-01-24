-- ABOUTME: Creates session_likes table for tracking user likes on sessions
-- ABOUTME: Includes trigger to maintain denormalized likeCount on sessions table

-- Create likes table (using camelCase to match existing schema)
CREATE TABLE session_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionId" TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("sessionId", "userId")
);

-- Indexes
CREATE INDEX idx_session_likes_sessionId ON session_likes("sessionId");
CREATE INDEX idx_session_likes_userId ON session_likes("userId");

-- Enable RLS
ALTER TABLE session_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies: anyone can read, users can insert/delete their own
CREATE POLICY "session_likes_select_public"
  ON session_likes FOR SELECT
  USING (true);

CREATE POLICY "session_likes_insert_own"
  ON session_likes FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "session_likes_delete_own"
  ON session_likes FOR DELETE
  USING (auth.uid() = "userId");

-- Trigger function to update denormalized likeCount
CREATE FUNCTION update_session_like_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sessions SET "likeCount" = "likeCount" + 1 WHERE id = NEW."sessionId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sessions SET "likeCount" = "likeCount" - 1 WHERE id = OLD."sessionId";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER session_likes_trigger
  AFTER INSERT OR DELETE ON session_likes
  FOR EACH ROW EXECUTE FUNCTION update_session_like_count();

-- Comments
COMMENT ON TABLE session_likes IS 'Tracks which users have liked which sessions';
COMMENT ON COLUMN session_likes."sessionId" IS 'Reference to the liked session';
COMMENT ON COLUMN session_likes."userId" IS 'Reference to the user who liked';
