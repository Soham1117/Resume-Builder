#!/bin/bash

# Update nginx configuration for aetherdash.xyz to include Resume Builder
# This script safely updates your existing nginx configuration

set -e

echo "🔧 Updating nginx configuration for aetherdash.xyz..."

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
NGINX_SITE="aetherdash"
NGINX_CONFIG="/etc/nginx/sites-available/$NGINX_SITE"
BACKUP_FILE="/etc/nginx/sites-available/${NGINX_SITE}.backup.$(date +%Y%m%d_%H%M%S)"

# Check if nginx configuration exists
if [ ! -f "$NGINX_CONFIG" ]; then
    print_error "Nginx configuration file not found: $NGINX_CONFIG"
    print_error "Please make sure your aetherdash site is properly configured."
    exit 1
fi

# Create backup
print_status "Creating backup of current configuration..."
sudo cp "$NGINX_CONFIG" "$BACKUP_FILE"
print_status "Backup created: $BACKUP_FILE"

# Check if Resume Builder is already configured
if grep -q "location /resume/api/" "$NGINX_CONFIG"; then
    print_warning "Resume Builder configuration already exists in nginx config."
    read -p "Do you want to replace it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Skipping nginx configuration update."
        exit 0
    fi
fi

# Get the frontend domain for CORS
read -p "Enter your Resume Builder frontend domain (e.g., https://resume-builder.netlify.app): " FRONTEND_DOMAIN

if [ -z "$FRONTEND_DOMAIN" ]; then
    FRONTEND_DOMAIN="https://your-resume-frontend-domain.com"
    print_warning "Using default frontend domain: $FRONTEND_DOMAIN"
fi

# Create temporary configuration
print_status "Creating updated configuration..."
TEMP_CONFIG="/tmp/nginx_${NGINX_SITE}_temp"

# Copy the new configuration
cp "deployment/nginx-aetherdash.conf" "$TEMP_CONFIG"

# Replace the placeholder frontend domain
sed -i "s|https://your-resume-frontend-domain.com|$FRONTEND_DOMAIN|g" "$TEMP_CONFIG"

# Update the configuration file
print_status "Updating nginx configuration..."
sudo cp "$TEMP_CONFIG" "$NGINX_CONFIG"

# Test nginx configuration
print_status "Testing nginx configuration..."
if sudo nginx -t; then
    print_status "✅ Nginx configuration is valid"
else
    print_error "❌ Nginx configuration is invalid. Restoring backup..."
    sudo cp "$BACKUP_FILE" "$NGINX_CONFIG"
    sudo nginx -t
    print_error "Backup restored. Please check the configuration manually."
    exit 1
fi

# Reload nginx
print_status "Reloading nginx..."
sudo systemctl reload nginx

# Clean up
rm -f "$TEMP_CONFIG"

print_status "🎉 Nginx configuration updated successfully!"
print_status ""
print_status "Your Resume Builder API will be available at:"
print_status "  https://aetherdash.xyz/resume/api/"
print_status ""
print_status "Health check endpoint:"
print_status "  https://aetherdash.xyz/resume/health"
print_status ""
print_status "CORS configured for frontend: $FRONTEND_DOMAIN"
print_status ""
print_warning "⚠️  Don't forget to:"
print_warning "1. Update your frontend to use the new API endpoint"
print_warning "2. Test the API endpoints"
print_warning "3. Update your deployment scripts if needed" 