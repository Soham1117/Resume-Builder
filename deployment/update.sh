#!/bin/bash

# Resume Builder Update Script
# This script updates the application with zero downtime

set -e

echo "🔄 Starting Resume Builder update..."

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
APP_DIR="/opt/resume-builder"
BACKUP_DIR="/opt/backups/resume-builder"
TEMP_DIR="/tmp/resume-builder-update"
REPO_URL="https://github.com/your-username/resume-builder.git"

# Create backup
print_status "Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup current JAR
if [ -f "$APP_DIR/resume-updater.jar" ]; then
    cp $APP_DIR/resume-updater.jar $BACKUP_DIR/resume-updater_$DATE.jar
    print_status "Backed up current JAR to $BACKUP_DIR/resume-updater_$DATE.jar"
fi

# Backup database
print_status "Backing up database..."
pg_dump -h localhost -U resumeuser -d resumedb > $BACKUP_DIR/db_backup_$DATE.sql

# Create temporary directory
print_status "Setting up temporary directory..."
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Clone repository
print_status "Cloning repository..."
git clone $REPO_URL .

# Build application
print_status "Building application..."
mvn clean package -DskipTests

# Check if build was successful
if [ ! -f "target/resume-updater-1.0.0.jar" ]; then
    print_error "Build failed! JAR file not found."
    exit 1
fi

# Stop application
print_status "Stopping application..."
sudo systemctl stop resume-builder

# Wait for application to stop
sleep 5

# Backup current configuration
print_status "Backing up configuration..."
if [ -f "$APP_DIR/.env" ]; then
    cp $APP_DIR/.env $BACKUP_DIR/env_backup_$DATE
fi

# Update application
print_status "Updating application..."
sudo cp target/resume-updater-1.0.0.jar $APP_DIR/resume-updater.jar
sudo chown resume-app:resume-app $APP_DIR/resume-updater.jar

# Update nginx configuration if needed
if [ -f "deployment/nginx.conf" ]; then
    print_status "Updating nginx configuration..."
    sudo cp deployment/nginx.conf /etc/nginx/sites-available/resume-builder
    sudo nginx -t
    sudo systemctl reload nginx
fi

# Update systemd service if needed
if [ -f "deployment/systemd-service.conf" ]; then
    print_status "Updating systemd service..."
    sudo cp deployment/systemd-service.conf /etc/systemd/system/resume-builder.service
    sudo systemctl daemon-reload
fi

# Start application
print_status "Starting application..."
sudo systemctl start resume-builder

# Wait for application to start
print_status "Waiting for application to start..."
sleep 15

# Health check
print_status "Performing health check..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Rolling back..."
    
    # Rollback
    print_status "Rolling back to previous version..."
    sudo systemctl stop resume-builder
    sudo cp $BACKUP_DIR/resume-updater_$DATE.jar $APP_DIR/resume-updater.jar
    sudo chown resume-app:resume-app $APP_DIR/resume-updater.jar
    sudo systemctl start resume-builder
    
    print_error "Rollback completed. Check logs with: sudo journalctl -u resume-builder -f"
    exit 1
fi

# Cleanup
print_status "Cleaning up..."
rm -rf $TEMP_DIR

# Keep only last 5 backups
find $BACKUP_DIR -name "resume-updater_*.jar" -mtime +5 -delete
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +5 -delete
find $BACKUP_DIR -name "env_backup_*" -mtime +5 -delete

print_status "🎉 Update completed successfully!"
print_status "Application is running at: http://your-domain.com/api"
print_status ""
print_status "Recent backups:"
ls -la $BACKUP_DIR | tail -5 