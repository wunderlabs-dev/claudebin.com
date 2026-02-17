-- ABOUTME: Reverts USING (true) RLS policies to prevent anonymous enumeration
-- ABOUTME: Fixes security vulnerability where anon key could SELECT * all sessions/messages
-- ABOUTME: Restores original policies from 20250115000002 and 20250115000003
-- ABOUTME: See https://github.com/wunderlabs-dev/claudebin.com/issues/51

-- ============================================================
-- SESSIONS: Revert to public-or-owner SELECT policy
-- ============================================================

-- Drop the permissive "select all" policy from 20250206000001
DROP POLICY IF EXISTS "sessions_select_all" ON sessions;

-- Restore the original policy: public sessions readable by anyone, private only by owner
CREATE POLICY "sessions_select_public_or_own"
  ON sessions FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- ============================================================
-- MESSAGES: Revert to session-visibility-based SELECT policy
-- ============================================================

-- Drop the permissive "select all" policy from 20250211000001
DROP POLICY IF EXISTS "messages_select_all" ON messages;

-- Restore the original policy: messages readable if parent session is readable
CREATE POLICY "messages_select_via_session"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = messages.session_id
      AND (s.is_public = true OR auth.uid() = s.user_id)
    )
  );
