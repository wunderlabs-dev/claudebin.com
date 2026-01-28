-- ABOUTME: Revert to camelCase column names
-- ABOUTME: The type generator doesn't auto-convert, so DB must use camelCase

-- ============================================
-- cli_auth_sessions
-- ============================================
ALTER TABLE cli_auth_sessions RENAME COLUMN access_token TO "accessToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN completed_at TO "completedAt";
ALTER TABLE cli_auth_sessions RENAME COLUMN created_at TO "createdAt";
ALTER TABLE cli_auth_sessions RENAME COLUMN expires_at TO "expiresAt";
ALTER TABLE cli_auth_sessions RENAME COLUMN refresh_token TO "refreshToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN session_token TO "sessionToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN user_id TO "userId";

DROP INDEX IF EXISTS idx_cli_auth_created_at;
CREATE INDEX idx_cli_auth_createdAt ON cli_auth_sessions("createdAt");

-- ============================================
-- messages
-- ============================================
ALTER TABLE messages RENAME COLUMN created_at TO "createdAt";
ALTER TABLE messages RENAME COLUMN has_tool_calls TO "hasToolCalls";
ALTER TABLE messages RENAME COLUMN is_meta TO "isMeta";
ALTER TABLE messages RENAME COLUMN is_sidechain TO "isSidechain";
ALTER TABLE messages RENAME COLUMN parent_uuid TO "parentUuid";
ALTER TABLE messages RENAME COLUMN raw_message TO "rawMessage";
ALTER TABLE messages RENAME COLUMN session_id TO "sessionId";
ALTER TABLE messages RENAME COLUMN text_preview TO "textPreview";
ALTER TABLE messages RENAME COLUMN tool_names TO "toolNames";

DROP INDEX IF EXISTS idx_messages_session_id;
DROP INDEX IF EXISTS idx_messages_conversation;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_session_id_idx_key;

CREATE INDEX idx_messages_sessionId ON messages("sessionId");
CREATE INDEX idx_messages_conversation ON messages("sessionId", idx) WHERE "isSidechain" = false;
ALTER TABLE messages ADD CONSTRAINT messages_sessionId_idx_key UNIQUE("sessionId", idx);

-- ============================================
-- profiles
-- ============================================
ALTER TABLE profiles RENAME COLUMN avatar_url TO "avatarUrl";
ALTER TABLE profiles RENAME COLUMN created_at TO "createdAt";
ALTER TABLE profiles RENAME COLUMN updated_at TO "updatedAt";
ALTER TABLE profiles RENAME COLUMN deleted_at TO "deletedAt";
ALTER TABLE profiles RENAME COLUMN view_count TO "viewCount";

DROP INDEX IF EXISTS idx_profiles_deleted_at;
CREATE INDEX idx_profiles_deletedAt ON profiles("deletedAt") WHERE "deletedAt" IS NOT NULL;

-- ============================================
-- sessions
-- ============================================
ALTER TABLE sessions RENAME COLUMN created_at TO "createdAt";
ALTER TABLE sessions RENAME COLUMN updated_at TO "updatedAt";
ALTER TABLE sessions RENAME COLUMN error_message TO "errorMessage";
ALTER TABLE sessions RENAME COLUMN is_public TO "isPublic";
ALTER TABLE sessions RENAME COLUMN message_count TO "messageCount";
ALTER TABLE sessions RENAME COLUMN storage_path TO "storagePath";
ALTER TABLE sessions RENAME COLUMN user_id TO "userId";
ALTER TABLE sessions RENAME COLUMN working_dir TO "workingDir";
ALTER TABLE sessions RENAME COLUMN file_count TO "fileCount";
ALTER TABLE sessions RENAME COLUMN view_count TO "viewCount";
ALTER TABLE sessions RENAME COLUMN like_count TO "likeCount";

DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_working_dir;
CREATE INDEX idx_sessions_userId ON sessions("userId");
CREATE INDEX idx_sessions_workingDir ON sessions("workingDir") WHERE "workingDir" IS NOT NULL;

-- ============================================
-- session_likes
-- ============================================
ALTER TABLE session_likes RENAME COLUMN session_id TO "sessionId";
ALTER TABLE session_likes RENAME COLUMN user_id TO "userId";
ALTER TABLE session_likes RENAME COLUMN created_at TO "createdAt";

DROP INDEX IF EXISTS idx_session_likes_session_id;
DROP INDEX IF EXISTS idx_session_likes_user_id;
CREATE INDEX idx_session_likes_sessionId ON session_likes("sessionId");
CREATE INDEX idx_session_likes_userId ON session_likes("userId");

ALTER TABLE session_likes DROP CONSTRAINT IF EXISTS session_likes_session_id_user_id_key;
ALTER TABLE session_likes ADD CONSTRAINT session_likes_sessionId_userId_key UNIQUE("sessionId", "userId");

-- ============================================
-- Update trigger function for session likes
-- ============================================
CREATE OR REPLACE FUNCTION update_session_like_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sessions SET "likeCount" = "likeCount" + 1 WHERE id = NEW."sessionId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sessions SET "likeCount" = "likeCount" - 1 WHERE id = OLD."sessionId";
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Update RLS policies for session_likes
-- ============================================
DROP POLICY IF EXISTS "session_likes_insert_own" ON session_likes;
DROP POLICY IF EXISTS "session_likes_delete_own" ON session_likes;

CREATE POLICY "session_likes_insert_own"
  ON session_likes FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "session_likes_delete_own"
  ON session_likes FOR DELETE
  USING (auth.uid() = "userId");

-- ============================================
-- Update RLS policies for sessions
-- ============================================
DROP POLICY IF EXISTS "sessions_select_public_or_own" ON sessions;
DROP POLICY IF EXISTS "sessions_insert_own" ON sessions;
DROP POLICY IF EXISTS "sessions_update_own" ON sessions;
DROP POLICY IF EXISTS "sessions_delete_own" ON sessions;

CREATE POLICY "sessions_select_public_or_own"
  ON sessions FOR SELECT
  USING ("isPublic" = true OR auth.uid() = "userId");

CREATE POLICY "sessions_insert_own"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "sessions_update_own"
  ON sessions FOR UPDATE
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "sessions_delete_own"
  ON sessions FOR DELETE
  USING (auth.uid() = "userId");

-- ============================================
-- Update increment functions
-- ============================================
CREATE OR REPLACE FUNCTION increment_session_view_count(session_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE sessions SET "viewCount" = "viewCount" + 1 WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_profile_view_count(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET "viewCount" = "viewCount" + 1 WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
