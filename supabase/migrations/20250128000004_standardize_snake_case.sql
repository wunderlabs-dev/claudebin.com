-- ABOUTME: Standardize all column names to snake_case
-- ABOUTME: supabase gen types will auto-convert to camelCase in TypeScript

-- ============================================
-- cli_auth_sessions
-- ============================================
ALTER TABLE cli_auth_sessions RENAME COLUMN "accessToken" TO access_token;
ALTER TABLE cli_auth_sessions RENAME COLUMN "completedAt" TO completed_at;
ALTER TABLE cli_auth_sessions RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE cli_auth_sessions RENAME COLUMN "expiresAt" TO expires_at;
ALTER TABLE cli_auth_sessions RENAME COLUMN "refreshToken" TO refresh_token;
ALTER TABLE cli_auth_sessions RENAME COLUMN "sessionToken" TO session_token;
ALTER TABLE cli_auth_sessions RENAME COLUMN "userId" TO user_id;

DROP INDEX IF EXISTS idx_cli_auth_createdAt;
CREATE INDEX idx_cli_auth_created_at ON cli_auth_sessions(created_at);

-- ============================================
-- messages
-- ============================================
ALTER TABLE messages RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE messages RENAME COLUMN "hasToolCalls" TO has_tool_calls;
ALTER TABLE messages RENAME COLUMN "isMeta" TO is_meta;
ALTER TABLE messages RENAME COLUMN "isSidechain" TO is_sidechain;
ALTER TABLE messages RENAME COLUMN "parentUuid" TO parent_uuid;
ALTER TABLE messages RENAME COLUMN "rawMessage" TO raw_message;
ALTER TABLE messages RENAME COLUMN "sessionId" TO session_id;
ALTER TABLE messages RENAME COLUMN "textPreview" TO text_preview;
ALTER TABLE messages RENAME COLUMN "toolNames" TO tool_names;

DROP INDEX IF EXISTS idx_messages_sessionId;
DROP INDEX IF EXISTS idx_messages_conversation;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sessionId_idx_key;

CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_conversation ON messages(session_id, idx) WHERE is_sidechain = false;
ALTER TABLE messages ADD CONSTRAINT messages_session_id_idx_key UNIQUE(session_id, idx);

-- ============================================
-- profiles
-- ============================================
ALTER TABLE profiles RENAME COLUMN "avatarUrl" TO avatar_url;
ALTER TABLE profiles RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE profiles RENAME COLUMN "updatedAt" TO updated_at;
ALTER TABLE profiles RENAME COLUMN "deletedAt" TO deleted_at;
ALTER TABLE profiles RENAME COLUMN "viewCount" TO view_count;

DROP INDEX IF EXISTS idx_profiles_deleted_at;
CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================
-- sessions
-- ============================================
ALTER TABLE sessions RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE sessions RENAME COLUMN "updatedAt" TO updated_at;
ALTER TABLE sessions RENAME COLUMN "errorMessage" TO error_message;
ALTER TABLE sessions RENAME COLUMN "isPublic" TO is_public;
ALTER TABLE sessions RENAME COLUMN "messageCount" TO message_count;
ALTER TABLE sessions RENAME COLUMN "storagePath" TO storage_path;
ALTER TABLE sessions RENAME COLUMN "userId" TO user_id;
ALTER TABLE sessions RENAME COLUMN "workingDir" TO working_dir;
ALTER TABLE sessions RENAME COLUMN "fileCount" TO file_count;
ALTER TABLE sessions RENAME COLUMN "viewCount" TO view_count;
ALTER TABLE sessions RENAME COLUMN "likeCount" TO like_count;

DROP INDEX IF EXISTS idx_sessions_userId;
DROP INDEX IF EXISTS idx_sessions_workingDir;
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_working_dir ON sessions(working_dir) WHERE working_dir IS NOT NULL;

-- ============================================
-- session_likes
-- ============================================
ALTER TABLE session_likes RENAME COLUMN "sessionId" TO session_id;
ALTER TABLE session_likes RENAME COLUMN "userId" TO user_id;
ALTER TABLE session_likes RENAME COLUMN "createdAt" TO created_at;

DROP INDEX IF EXISTS idx_session_likes_sessionId;
DROP INDEX IF EXISTS idx_session_likes_userId;
CREATE INDEX idx_session_likes_session_id ON session_likes(session_id);
CREATE INDEX idx_session_likes_user_id ON session_likes(user_id);

-- Update unique constraint
ALTER TABLE session_likes DROP CONSTRAINT IF EXISTS session_likes_sessionId_userId_key;
ALTER TABLE session_likes ADD CONSTRAINT session_likes_session_id_user_id_key UNIQUE(session_id, user_id);

-- ============================================
-- Update trigger function for session likes
-- ============================================
CREATE OR REPLACE FUNCTION update_session_like_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sessions SET like_count = like_count + 1 WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sessions SET like_count = like_count - 1 WHERE id = OLD.session_id;
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
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_likes_delete_own"
  ON session_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Update RLS policies for sessions
-- ============================================
DROP POLICY IF EXISTS "sessions_select_public_or_own" ON sessions;
DROP POLICY IF EXISTS "sessions_insert_own" ON sessions;
DROP POLICY IF EXISTS "sessions_update_own" ON sessions;
DROP POLICY IF EXISTS "sessions_delete_own" ON sessions;

CREATE POLICY "sessions_select_public_or_own"
  ON sessions FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "sessions_insert_own"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_own"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_delete_own"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Update increment functions
-- ============================================
CREATE OR REPLACE FUNCTION increment_session_view_count(session_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE sessions SET view_count = view_count + 1 WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_profile_view_count(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET view_count = view_count + 1 WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
