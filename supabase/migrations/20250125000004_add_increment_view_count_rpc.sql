-- ABOUTME: Creates RPC function for atomically incrementing session view count
-- ABOUTME: Used to track page views without race conditions

CREATE OR REPLACE FUNCTION increment_session_view_count(session_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE sessions
  SET "viewCount" = "viewCount" + 1
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION increment_session_view_count(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_session_view_count(TEXT) TO anon;
