-- Fix database constraints for Supabase Auth compatibility
-- This script removes foreign key constraints and unnecessary tables

-- Drop foreign key constraint on Curriculum.userId
ALTER TABLE "Curriculum" DROP CONSTRAINT IF EXISTS "Curriculum_userId_fkey";

-- Drop unnecessary tables (NextAuth related)
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Ensure Curriculum table has correct structure
-- (No changes needed if table already exists with correct columns)

-- Add index on userId for better performance
CREATE INDEX IF NOT EXISTS "Curriculum_userId_idx" ON "Curriculum" ("userId");

-- Verify the final structure
\d "Curriculum";
\d "Year";
\d "Subject";
\d "Prerequisite";
