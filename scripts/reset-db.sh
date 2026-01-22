#!/bin/bash
# ABOUTME: Resets the Supabase database (local or remote)
# ABOUTME: Drops all tables and re-applies migrations

set -e

TARGET="${1:-local}"

if [[ "$TARGET" != "local" && "$TARGET" != "remote" ]]; then
  echo "Usage: ./scripts/reset-db.sh [local|remote]"
  echo "  local  - Reset local Supabase (default)"
  echo "  remote - Reset linked remote project"
  exit 1
fi

if [[ "$TARGET" == "local" ]]; then
  echo "Resetting local database..."
  supabase db reset
  echo "Local database reset complete."
else
  echo "Resetting remote database..."

  # Create temporary "nuke" migration with timestamp after all existing
  NUKE_FILE="supabase/migrations/99999999999999_nuke_all.sql"
  cat > "$NUKE_FILE" << 'EOF'
-- Temporary migration to drop all tables
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS cli_auth_sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
EOF

  echo "Step 1: Pushing nuke migration..."
  echo "y" | supabase db push || true

  # Remove the nuke file
  rm -f "$NUKE_FILE"

  echo "Step 2: Repairing migration history..."
  # Mark nuke as reverted so it won't be tracked
  supabase migration repair --status reverted 99999999999999 2>/dev/null || true

  # Mark all real migrations as reverted (extract just the version number)
  MIGRATIONS=$(ls supabase/migrations/*.sql 2>/dev/null | xargs -I {} basename {} | sed 's/_.*//' | tr '\n' ' ')
  if [[ -n "$MIGRATIONS" ]]; then
    supabase migration repair --status reverted $MIGRATIONS
  fi

  echo "Step 3: Pushing migrations..."
  echo "y" | supabase db push

  echo "Remote database reset complete."
fi
