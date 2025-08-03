-- Migration script to add link field to experience_bullets table
-- This allows storing project links within experience bullet points

ALTER TABLE experience_bullets 
ADD COLUMN IF NOT EXISTS link VARCHAR(500);

-- Add index for better performance when querying by link
CREATE INDEX IF NOT EXISTS idx_experience_bullets_link ON experience_bullets(link) WHERE link IS NOT NULL; 