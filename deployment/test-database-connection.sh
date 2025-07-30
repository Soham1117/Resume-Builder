#!/bin/bash

# Database Connection Test Script
# This script tests the connection to the PostgreSQL database

set -e

echo "🔍 Testing PostgreSQL database connection..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration (should match your application.properties)
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="resumedb"
DB_USER="resumeuser"
DB_PASSWORD="your_secure_password_here"

# Test 1: Check if PostgreSQL is running
print_status "1. Checking if PostgreSQL is running..."
if sudo systemctl is-active --quiet postgresql; then
    print_status "✅ PostgreSQL is running"
else
    print_error "❌ PostgreSQL is not running"
    print_error "Start it with: sudo systemctl start postgresql"
    exit 1
fi

# Test 2: Check if we can connect as postgres superuser
print_status "2. Testing postgres superuser connection..."
if sudo -u postgres psql -c "SELECT version();" > /dev/null 2>&1; then
    print_status "✅ Postgres superuser connection successful"
else
    print_error "❌ Cannot connect as postgres superuser"
    exit 1
fi

# Test 3: Check if database exists
print_status "3. Checking if database '$DB_NAME' exists..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_status "✅ Database '$DB_NAME' exists"
else
    print_error "❌ Database '$DB_NAME' does not exist"
    print_error "Run: ./deployment/setup-database.sh"
    exit 1
fi

# Test 4: Check if user exists
print_status "4. Checking if user '$DB_USER' exists..."
if sudo -u postgres psql -t -c "SELECT 1 FROM pg_user WHERE usename = '$DB_USER';" | grep -q 1; then
    print_status "✅ User '$DB_USER' exists"
else
    print_error "❌ User '$DB_USER' does not exist"
    print_error "Run: ./deployment/setup-database.sh"
    exit 1
fi

# Test 5: Test connection with application credentials
print_status "5. Testing connection with application credentials..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT current_user, current_database(), version();" > /dev/null 2>&1; then
    print_status "✅ Application connection successful"
else
    print_error "❌ Application connection failed"
    print_error "Check your credentials and permissions"
    exit 1
fi

# Test 6: Test Flyway migration tables (if they exist)
print_status "6. Checking Flyway migration tables..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT table_name FROM information_schema.tables WHERE table_name = 'flyway_schema_history';" | grep -q flyway_schema_history; then
    print_status "✅ Flyway migration table exists"
else
    print_warning "⚠️  Flyway migration table does not exist yet (this is normal for new databases)"
fi

# Test 7: Show connection details
print_status "7. Connection details:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Connection string: jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME"

# Test 8: Show database size and table count
print_status "8. Database information:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    pg_size_pretty(pg_database_size('$DB_NAME')) as database_size,
    (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count;
"

print_status "🎉 All database tests passed!"
print_status "Your database is ready for the Resume Builder application." 