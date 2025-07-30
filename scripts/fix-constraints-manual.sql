-- =====================================================
-- FIX DATABASE CONSTRAINTS FOR SUPABASE AUTH
-- =====================================================
-- Run this script in your Supabase SQL Editor to fix the constraint issues

-- 1. Drop the foreign key constraint on Curriculum.userId
ALTER TABLE "Curriculum" DROP CONSTRAINT IF EXISTS "Curriculum_userId_fkey";

-- 2. Drop unnecessary NextAuth tables if they exist
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE; 
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 3. Add index on userId for better performance  
CREATE INDEX IF NOT EXISTS "Curriculum_userId_idx" ON "Curriculum" ("userId");

-- 4. Verify the structure - check these tables exist with correct columns
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('Curriculum', 'Year', 'Subject', 'Prerequisite')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 5. Test with a dummy insert (this should work now)
-- INSERT INTO "Curriculum" (id, name, description, "userId", "createdAt", "updatedAt")
-- VALUES ('test_constraint_fix', 'Test Curriculum', 'Testing constraints', 'any-user-id', NOW(), NOW());

-- 6. Clean up test data (uncomment if you ran the test)
-- DELETE FROM "Curriculum" WHERE id = 'test_constraint_fix';
