#!/bin/bash

# Resume Builder Database Setup Script
# This script runs the PostgreSQL setup commands

set -e

echo "🗄️  Setting up PostgreSQL database for Resume Builder..."

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root."
   exit 1
fi

# Configuration
DB_NAME="resumedb"
DB_USER="resumeuser"
DB_PASSWORD="your_secure_password_here"

# Check if PostgreSQL is running
print_status "Checking PostgreSQL status..."
if ! sudo systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL is not running. Please start it first:"
    print_error "sudo systemctl start postgresql"
    exit 1
fi

print_status "PostgreSQL is running."

# Check if we can connect as postgres user
print_status "Testing PostgreSQL connection..."
if ! sudo -u postgres psql -c "SELECT version();" > /dev/null 2>&1; then
    print_error "Cannot connect to PostgreSQL as postgres user."
    print_error "Make sure PostgreSQL is properly installed and configured."
    exit 1
fi

# Create database and user using individual commands
print_status "Creating database and user..."

# Create database (if it doesn't exist)
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_status "Creating database '$DB_NAME'..."
    sudo -u postgres createdb $DB_NAME
else
    print_warning "Database '$DB_NAME' already exists."
fi

# Create user (if it doesn't exist)
if ! sudo -u postgres psql -t -c "SELECT 1 FROM pg_user WHERE usename = '$DB_USER';" | grep -q 1; then
    print_status "Creating user '$DB_USER'..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
else
    print_warning "User '$DB_USER' already exists."
fi

# Grant privileges
print_status "Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Grant schema permissions
print_status "Granting schema permissions..."
sudo -u postgres psql -d $DB_NAME -c "GRANT USAGE ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

# Test connection
print_status "Testing database connection..."
if sudo -u postgres psql -d $DB_NAME -U $DB_USER -c "SELECT current_user, current_database();" > /dev/null 2>&1; then
    print_status "✅ Database connection test successful!"
else
    print_warning "⚠️  Connection test failed. This might be normal if the user doesn't have login privileges yet."
fi

# Show verification information
print_status "Verification information:"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Connection string: jdbc:postgresql://localhost:5432/$DB_NAME"
echo ""

# Show environment variables to set
print_status "Set these environment variables in your application:"
echo "DB_HOST=localhost"
echo "DB_PORT=5432"
echo "DB_NAME=$DB_NAME"
echo "DB_USERNAME=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo ""

print_status "🎉 Database setup completed!"
print_status ""
print_warning "⚠️  Important security notes:"
print_warning "1. Change the default password in production"
print_warning "2. Consider using environment variables for the password"
print_warning "3. Restrict database access to localhost only"
print_warning "4. Regularly backup your database" 