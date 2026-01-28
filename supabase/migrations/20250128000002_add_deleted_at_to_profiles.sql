ALTER TABLE profiles ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;
