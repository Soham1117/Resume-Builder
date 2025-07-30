-- Resume Builder Database Setup Script
-- This script creates the database, user, and grants necessary permissions
-- Run this script as the postgres superuser

-- =====================================================
-- DATABASE AND USER CREATION
-- =====================================================

-- Create the database (if it doesn't exist)
-- Note: PostgreSQL doesn't have CREATE DATABASE IF NOT EXISTS
-- We'll handle this with a DO block
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'resumedb') THEN
        CREATE DATABASE resumedb;
    END IF;
END
$$;

-- Create the user (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'resumeuser') THEN
        CREATE USER resumeuser WITH PASSWORD 'your_secure_password_here';
    END IF;
END
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE resumedb TO resumeuser;

-- Grant CREATE privilege (needed for Flyway migrations)
ALTER USER resumeuser CREATEDB;

-- Connect to the resumedb database to grant schema permissions
\c resumedb;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO resumeuser;

-- Grant all privileges on all tables (current and future)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resumeuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resumeuser;

-- Grant privileges on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resumeuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resumeuser;

-- =====================================================
-- SECURITY SETTINGS
-- =====================================================

-- Set password encryption method (recommended for production)
ALTER USER resumeuser PASSWORD 'your_secure_password_here';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the user was created
SELECT usename, usesuper, usecreatedb 
FROM pg_user 
WHERE usename = 'resumeuser';

-- Verify database exists
SELECT datname, datacl 
FROM pg_database 
WHERE datname = 'resumedb';

-- Test connection (this will show if the user can connect)
\c resumedb resumeuser;

-- Show current user and database
SELECT current_user, current_database();

-- =====================================================
-- ADDITIONAL CONFIGURATION (Optional)
-- =====================================================

-- Set timezone (optional - adjust as needed)
-- ALTER DATABASE resumedb SET timezone TO 'UTC';

-- Set encoding (optional - should already be UTF8)
-- ALTER DATABASE resumedb SET client_encoding TO 'UTF8';

-- =====================================================
-- CONNECTION STRING FOR REFERENCE
-- =====================================================

/*
Connection string for your application:
jdbc:postgresql://localhost:5432/resumedb

Environment variables to set:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resumedb
DB_USERNAME=resumeuser
DB_PASSWORD=your_secure_password_here
*/

-- =====================================================
-- CLEANUP (if needed)
-- =====================================================

/*
-- To drop everything (use with caution):
-- DROP DATABASE IF EXISTS resumedb;
-- DROP USER IF EXISTS resumeuser;
*/ 