-- ABOUTME: Adds metadata columns to sessions for working directory, file count, and engagement metrics
-- ABOUTME: These columns support displaying richer session info in the UI

-- Add metadata columns (using camelCase to match existing schema)
ALTER TABLE sessions ADD COLUMN "workingDir" TEXT;
ALTER TABLE sessions ADD COLUMN "fileCount" INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN "viewCount" INTEGER DEFAULT 0;
ALTER TABLE sessions ADD COLUMN "likeCount" INTEGER DEFAULT 0;

-- Index for filtering/sorting by workingDir (sparse index for non-null values only)
CREATE INDEX idx_sessions_workingDir ON sessions("workingDir") WHERE "workingDir" IS NOT NULL;

-- Comments
COMMENT ON COLUMN sessions."workingDir" IS 'Working directory path where the session was run';
COMMENT ON COLUMN sessions."fileCount" IS 'Number of unique files touched during the session';
COMMENT ON COLUMN sessions."viewCount" IS 'Number of times this session has been viewed';
COMMENT ON COLUMN sessions."likeCount" IS 'Denormalized count of likes for this session';
