-- Security and batch publishing fields
-- Migration: 002_security_fields

ALTER TABLE items ADD COLUMN IF NOT EXISTS trust_level TEXT
  DEFAULT 'community' CHECK (trust_level IN ('official', 'community', 'user'));
ALTER TABLE items ADD COLUMN IF NOT EXISTS security_status TEXT
  DEFAULT 'pending' CHECK (security_status IN ('trusted', 'reviewed', 'flagged', 'pending'));
ALTER TABLE items ADD COLUMN IF NOT EXISTS security_notes TEXT;
ALTER TABLE items ADD COLUMN IF NOT EXISTS security_score INTEGER DEFAULT 100;
ALTER TABLE items ADD COLUMN IF NOT EXISTS publish_batch INTEGER;
