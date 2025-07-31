#!/bin/bash

# Quick Update Script for Resume Builder
# This script updates the application with local changes

set -e

echo "🔄 Starting quick update..."

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

# Configuration
APP_DIR="/opt/resume-builder"
BACKUP_DIR="/opt/backups/resume-builder"

# Create backup
print_status "Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup current JAR
if [ -f "$APP_DIR/resume-updater.jar" ]; then
    sudo cp $APP_DIR/resume-updater.jar $BACKUP_DIR/resume-updater_$DATE.jar
    print_status "Backed up current JAR to $BACKUP_DIR/resume-updater_$DATE.jar"
fi

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

# Update application
print_status "Updating application..."
sudo cp target/resume-updater-1.0.0.jar $APP_DIR/resume-updater.jar
sudo chown resume-app:resume-app $APP_DIR/resume-updater.jar

# Update nginx configuration
print_status "Updating nginx configuration..."
sudo cp deployment/nginx-aetherdash.conf /etc/nginx/sites-available/aetherdash.xyz
sudo nginx -t
sudo systemctl reload nginx

# Start application
print_status "Starting application..."
sudo systemctl start resume-builder

# Wait for application to start
print_status "Waiting for application to start..."
sleep 15

# Health check
print_status "Performing health check..."
if curl -f http://localhost:8080/api/auth/health > /dev/null 2>&1; then
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

print_status "🎉 Quick update completed successfully!"
print_status "Application is running at: http://localhost:8080/api"
print_status "Nginx endpoint: https://aetherdash.xyz/resume/api/"
print_status ""
print_status "Useful commands:"
print_status "  Check status: sudo systemctl status resume-builder"
print_status "  View logs: sudo journalctl -u resume-builder -f"
print_status "  Restart: sudo systemctl restart resume-builder" 