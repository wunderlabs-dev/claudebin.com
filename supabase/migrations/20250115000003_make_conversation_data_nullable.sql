-- ABOUTME: Removes conversation_data column - now using blob storage + messages table
-- ABOUTME: Raw JSONL stored in storage_path, parsed messages in messages table

ALTER TABLE sessions DROP COLUMN conversation_data;
