-- ABOUTME: Changes RLS to allow anyone to view any session via direct link
-- ABOUTME: Sessions with isPublic=false are "unlisted" (not listed, but accessible)

-- Drop the restrictive select policy
DROP POLICY IF EXISTS "sessions_select_public_or_own" ON sessions;

-- Allow SELECT on all sessions (session ID acts as capability token)
-- Listing queries still filter by isPublic, but direct access works for all
CREATE POLICY "sessions_select_all"
  ON sessions FOR SELECT
  USING (true);

-- Update comment to reflect new behavior
COMMENT ON COLUMN sessions."isPublic" IS 'When false, session is unlisted (accessible via link, not shown in listings)';
