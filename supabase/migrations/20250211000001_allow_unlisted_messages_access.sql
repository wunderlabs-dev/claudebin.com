-- ABOUTME: Updates messages RLS to allow anyone to view messages via direct session link
-- ABOUTME: Aligns with sessions table policy from 20250206000001_allow_unlisted_access.sql

-- Drop the restrictive select policy
DROP POLICY IF EXISTS "messages_select_via_session" ON messages;

-- Allow SELECT on all messages (session ID acts as capability token)
-- If you have the session ID, you can read its messages
CREATE POLICY "messages_select_all"
  ON messages FOR SELECT
  USING (true);
