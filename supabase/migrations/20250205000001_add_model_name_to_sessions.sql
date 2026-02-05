-- ABOUTME: Adds modelName column to sessions for displaying the Claude model used
-- ABOUTME: Extracted from first message with a model during processing

ALTER TABLE sessions ADD COLUMN "modelName" TEXT;

COMMENT ON COLUMN sessions."modelName" IS 'The Claude model name used in this session (e.g., claude-opus-4-5-20251101)';
