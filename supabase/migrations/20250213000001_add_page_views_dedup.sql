-- ABOUTME: Adds page_views table and track_page_view RPC for bot-proof, deduped view counting
-- ABOUTME: Replaces the old increment_session_view_count and increment_profile_view_count RPCs

CREATE TABLE page_views (
  entity_type TEXT NOT NULL CHECK (entity_type IN ('session', 'profile')),
  entity_id TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (entity_type, entity_id, visitor_hash)
);

COMMENT ON TABLE page_views IS 'Tracks unique page views for deduplication (24h window)';
COMMENT ON COLUMN page_views.visitor_hash IS 'SHA-256 hash of IP + User-Agent for privacy';

-- Lock down direct API access; only SECURITY DEFINER functions touch this table
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Index for cleanup_old_page_views() to avoid seq scan
CREATE INDEX idx_page_views_viewed_at ON page_views (viewed_at);

-- ABOUTME: Single RPC handles both session and profile views with dedup
-- INSERT succeeds for new visitors (ROW_COUNT = 1, increment)
-- ON CONFLICT + WHERE filters returning visitors within 1h (no update = ROW_COUNT 0, skip)
-- ON CONFLICT + WHERE matches returning visitors after 1h (update = ROW_COUNT 1, increment)
CREATE OR REPLACE FUNCTION track_page_view(
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_visitor_hash TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  row_count INTEGER;
BEGIN
  INSERT INTO page_views (entity_type, entity_id, visitor_hash)
  VALUES (p_entity_type, p_entity_id, p_visitor_hash)
  ON CONFLICT (entity_type, entity_id, visitor_hash)
  DO UPDATE SET viewed_at = NOW()
  WHERE page_views.viewed_at < NOW() - INTERVAL '1 hour';

  GET DIAGNOSTICS row_count = ROW_COUNT;

  IF row_count > 0 THEN
    IF p_entity_type = 'session' THEN
      UPDATE sessions SET "viewCount" = "viewCount" + 1 WHERE id = p_entity_id;
    ELSIF p_entity_type = 'profile' THEN
      UPDATE profiles SET "viewCount" = "viewCount" + 1 WHERE id = p_entity_id::UUID;
    END IF;
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only service role can call this (API routes only, not client code)
REVOKE EXECUTE ON FUNCTION track_page_view(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION track_page_view(TEXT, TEXT, TEXT) TO service_role;

-- Cleanup function for periodic maintenance (call via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS void AS $$
BEGIN
  DELETE FROM page_views WHERE viewed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION cleanup_old_page_views() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION cleanup_old_page_views() TO service_role;

-- Drop old RPCs that allowed unauthenticated view count inflation
DROP FUNCTION IF EXISTS increment_session_view_count(TEXT);
DROP FUNCTION IF EXISTS increment_profile_view_count(UUID);
