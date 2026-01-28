-- Rename deleted_at to "deletedAt" to match camelCase convention
ALTER TABLE profiles RENAME COLUMN deleted_at TO "deletedAt";

DROP INDEX IF EXISTS idx_profiles_deleted_at;
CREATE INDEX idx_profiles_deleted_at ON profiles("deletedAt") WHERE "deletedAt" IS NOT NULL;
