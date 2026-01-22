-- ABOUTME: Renames all snake_case columns to camelCase for TypeScript consistency
-- ABOUTME: Eliminates need for manual mapping in repository layer

-- ============================================================================
-- PROFILES
-- ============================================================================

ALTER TABLE profiles RENAME COLUMN avatar_url TO "avatarUrl";
ALTER TABLE profiles RENAME COLUMN created_at TO "createdAt";
ALTER TABLE profiles RENAME COLUMN updated_at TO "updatedAt";

-- Update trigger to use new column name
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update handle_new_user to use new column name
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, "avatarUrl")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SESSIONS
-- ============================================================================

ALTER TABLE sessions RENAME COLUMN user_id TO "userId";
ALTER TABLE sessions RENAME COLUMN is_public TO "isPublic";
ALTER TABLE sessions RENAME COLUMN storage_path TO "storagePath";
ALTER TABLE sessions RENAME COLUMN error_message TO "errorMessage";
ALTER TABLE sessions RENAME COLUMN message_count TO "messageCount";
ALTER TABLE sessions RENAME COLUMN created_at TO "createdAt";
ALTER TABLE sessions RENAME COLUMN updated_at TO "updatedAt";

-- Recreate indexes with new column names
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_public;

CREATE INDEX idx_sessions_userId ON sessions("userId");
CREATE INDEX idx_sessions_isPublic ON sessions("isPublic") WHERE "isPublic" = true;

-- Update RLS policies
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

-- ============================================================================
-- MESSAGES
-- ============================================================================

ALTER TABLE messages RENAME COLUMN session_id TO "sessionId";
ALTER TABLE messages RENAME COLUMN parent_uuid TO "parentUuid";
ALTER TABLE messages RENAME COLUMN is_meta TO "isMeta";
ALTER TABLE messages RENAME COLUMN is_sidechain TO "isSidechain";
ALTER TABLE messages RENAME COLUMN has_tool_calls TO "hasToolCalls";
ALTER TABLE messages RENAME COLUMN tool_names TO "toolNames";
ALTER TABLE messages RENAME COLUMN text_preview TO "textPreview";
ALTER TABLE messages RENAME COLUMN raw_message TO "rawMessage";
ALTER TABLE messages RENAME COLUMN created_at TO "createdAt";

-- Recreate unique constraint
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_session_id_idx_key;
ALTER TABLE messages ADD CONSTRAINT messages_sessionId_idx_key UNIQUE("sessionId", idx);

-- Recreate indexes with new column names
DROP INDEX IF EXISTS idx_messages_session_id;
DROP INDEX IF EXISTS idx_messages_conversation;
DROP INDEX IF EXISTS idx_messages_tools;
DROP INDEX IF EXISTS idx_messages_text_preview;

CREATE INDEX idx_messages_sessionId ON messages("sessionId");
CREATE INDEX idx_messages_conversation ON messages("sessionId", idx)
  WHERE "isMeta" = false AND "isSidechain" = false;
CREATE INDEX idx_messages_tools ON messages USING GIN("toolNames")
  WHERE "hasToolCalls" = true;
CREATE INDEX idx_messages_textPreview ON messages
  USING GIN(to_tsvector('english', "textPreview"));

-- Update RLS policy
DROP POLICY IF EXISTS "messages_select_via_session" ON messages;

CREATE POLICY "messages_select_via_session"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = messages."sessionId"
      AND (s."isPublic" = true OR auth.uid() = s."userId")
    )
  );

-- ============================================================================
-- CLI_AUTH_SESSIONS
-- ============================================================================

ALTER TABLE cli_auth_sessions RENAME COLUMN session_token TO "sessionToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN user_id TO "userId";
ALTER TABLE cli_auth_sessions RENAME COLUMN access_token TO "accessToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN refresh_token TO "refreshToken";
ALTER TABLE cli_auth_sessions RENAME COLUMN expires_at TO "expiresAt";
ALTER TABLE cli_auth_sessions RENAME COLUMN created_at TO "createdAt";
ALTER TABLE cli_auth_sessions RENAME COLUMN completed_at TO "completedAt";

-- Recreate indexes with new column names
DROP INDEX IF EXISTS idx_cli_auth_session_token;
DROP INDEX IF EXISTS idx_cli_auth_created_at;

CREATE INDEX idx_cli_auth_sessionToken ON cli_auth_sessions("sessionToken");
CREATE INDEX idx_cli_auth_createdAt ON cli_auth_sessions("createdAt");
