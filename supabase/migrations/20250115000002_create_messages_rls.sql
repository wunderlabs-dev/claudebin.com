-- ABOUTME: Row Level Security policies for messages table
-- ABOUTME: Messages inherit visibility from parent session

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages are readable if the parent session is readable (public or owned by user)
CREATE POLICY "messages_select_via_session"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = messages.session_id
      AND (s.is_public = true OR auth.uid() = s.user_id)
    )
  );

-- Only service role can insert messages (background processing bypasses RLS)
CREATE POLICY "messages_insert_service_only"
  ON messages
  FOR INSERT
  WITH CHECK (false);

-- Only service role can delete messages
CREATE POLICY "messages_delete_service_only"
  ON messages
  FOR DELETE
  USING (false);

-- Only service role can update messages
CREATE POLICY "messages_update_service_only"
  ON messages
  FOR UPDATE
  USING (false)
  WITH CHECK (false);
