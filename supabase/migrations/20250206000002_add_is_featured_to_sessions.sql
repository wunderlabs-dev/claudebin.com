-- ABOUTME: Adds isFeatured column to sessions for homepage curation

ALTER TABLE sessions
ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- Index for efficient featured queries
CREATE INDEX idx_sessions_featured ON sessions("isFeatured") WHERE "isFeatured" = true;

COMMENT ON COLUMN sessions."isFeatured" IS 'Whether this session appears in the featured carousel on homepage';
