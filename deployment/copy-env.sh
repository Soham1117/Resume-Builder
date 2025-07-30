#!/bin/bash

# Helper script to copy .env file to the server
# Usage: ./deployment/copy-env.sh [server-ip]

set -e

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

# Check if .env file exists locally
if [ ! -f ".env" ]; then
    print_error ".env file not found in current directory"
    print_status "Please create a .env file with your configuration first"
    exit 1
fi

# Get server IP
SERVER_IP=${1:-""}
if [ -z "$SERVER_IP" ]; then
    read -p "Enter your EC2 server IP: " SERVER_IP
fi

if [ -z "$SERVER_IP" ]; then
    print_error "Server IP is required"
    exit 1
fi

print_status "Copying .env file to server..."
print_status "Server: ubuntu@$SERVER_IP"
print_status "Destination: /opt/resume-builder/.env"

# Copy the file
scp .env ubuntu@$SERVER_IP:/opt/resume-builder/.env

if [ $? -eq 0 ]; then
    print_status "✅ .env file copied successfully!"
    print_status ""
    print_status "You can now restart the application:"
    print_status "  ssh ubuntu@$SERVER_IP 'sudo systemctl restart resume-builder'"
    print_status ""
    print_status "Or check the status:"
    print_status "  ssh ubuntu@$SERVER_IP 'sudo systemctl status resume-builder'"
else
    print_error "❌ Failed to copy .env file"
    print_error "Make sure:"
    print_error "1. Your .env file exists in the current directory"
    print_error "2. The server IP is correct"
    print_error "3. SSH key is configured for the server"
    exit 1
fi 