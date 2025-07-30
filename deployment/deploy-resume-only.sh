#!/bin/bash

# Resume Builder Deployment Script (Application Only)
# This script deploys only the Spring Boot application
# Assumes: PostgreSQL is running, user exists, database exists

set -e

echo "🚀 Starting Resume Builder application deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Configuration
APP_DIR="/opt/resume-builder"
APP_USER="ubuntu"  # Using ubuntu user
CURRENT_USER=$(whoami)  # Get current username
JAR_NAME="resume-updater.jar"

# Check if running as ubuntu
print_status "Checking if running as ubuntu user..."
if [ "$CURRENT_USER" != "ubuntu" ]; then
    print_error "This script should be run as ubuntu user. Current user: $CURRENT_USER"
    exit 1
fi

# Check if PostgreSQL is running
print_status "Checking PostgreSQL status..."
if ! sudo systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL is not running. Please start it first:"
    print_error "sudo systemctl start postgresql"
    exit 1
fi

# Install Java 21 if not already installed
print_status "Checking Java installation..."
if ! java -version 2>&1 | grep -q "version \"21"; then
    print_status "Installing Java 21..."
    sudo apt update
    sudo apt install -y openjdk-21-jdk
else
    print_status "Java 21 is already installed"
fi

# Create application directory structure
print_status "Setting up application directory..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/generated-pdfs
mkdir -p $APP_DIR/logs
chown -R $APP_USER:$APP_USER $APP_DIR

# Build the application
print_status "Building the Spring Boot application..."
if [ ! -f "pom.xml" ]; then
    print_error "pom.xml not found. Please run this script from the project root directory."
    exit 1
fi

mvn clean package -DskipTests

# Check if build was successful
if [ ! -f "target/resume-updater-1.0.0.jar" ]; then
    print_error "Build failed! JAR file not found."
    exit 1
fi

# Install the application
print_status "Installing the application..."
cp target/resume-updater-1.0.0.jar $APP_DIR/$JAR_NAME
chown $APP_USER:$APP_USER $APP_DIR/$JAR_NAME

# Create environment file
print_status "Creating environment configuration..."


# chown $APP_USER:$APP_USER $APP_DIR/.env
# chmod 600 $APP_DIR/.env

# Copy systemd service file
print_status "Setting up systemd service..."
sudo cp deployment/systemd-service.conf /etc/systemd/system/resume-builder.service

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable resume-builder

# Start the application
print_status "Starting the application..."
sudo systemctl start resume-builder

# Wait for application to start
print_status "Waiting for application to start..."
sleep 15

# Check if application is running
print_status "Checking application status..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Check logs with: sudo journalctl -u resume-builder -f"
    print_status "Checking recent logs..."
    sudo journalctl -u resume-builder --no-pager -n 20
    exit 1
fi

# Create health check script
print_status "Creating health check script..."
sudo tee $APP_DIR/health-check.sh > /dev/null <<'EOF'
#!/bin/bash
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is not responding"
    exit 1
fi
EOF

chmod +x $APP_DIR/health-check.sh
chown $APP_USER:$APP_USER $APP_DIR/health-check.sh

# Create update script
print_status "Creating update script..."
sudo tee $APP_DIR/update.sh > /dev/null <<'EOF'
#!/bin/bash
# Quick update script for Resume Builder
set -e

echo "🔄 Updating Resume Builder..."

# Stop application
sudo systemctl stop resume-builder

# Build new version
cd /tmp
rm -rf resume-builder
git clone https://github.com/your-username/resume-builder.git
cd resume-builder
mvn clean package -DskipTests

# Backup current version
sudo cp /opt/resume-builder/resume-updater.jar /opt/resume-builder/resume-updater.jar.backup

# Install new version
sudo cp target/resume-updater-1.0.0.jar /opt/resume-builder/resume-updater.jar
sudo chown resume-app:resume-app /opt/resume-builder/resume-updater.jar

# Start application
sudo systemctl start resume-builder

# Wait and check
sleep 10
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Update successful!"
    sudo rm /opt/resume-builder/resume-updater.jar.backup
else
    echo "❌ Update failed, rolling back..."
    sudo systemctl stop resume-builder
    sudo cp /opt/resume-builder/resume-updater.jar.backup /opt/resume-builder/resume-updater.jar
    sudo systemctl start resume-builder
    exit 1
fi
EOF

chmod +x $APP_DIR/update.sh
chown $APP_USER:$APP_USER $APP_DIR/update.sh

print_status "🎉 Resume Builder deployment completed successfully!"
print_status ""
print_status "Application is running at: http://localhost:8080/api"
print_status "Health check: http://localhost:8080/api/health"
print_status ""
print_status "Useful commands:"
print_status "  Check status: sudo systemctl status resume-builder"
print_status "  View logs: sudo journalctl -u resume-builder -f"
print_status "  Restart: sudo systemctl restart resume-builder"
print_status "  Quick update: sudo /opt/resume-builder/update.sh"
print_status ""
print_warning "⚠️  Don't forget to:"
print_warning "1. Update the .env file with your actual API keys and passwords"
print_warning "2. Configure nginx to proxy requests to this application"
print_warning "3. Test the API endpoints"
print_warning "4. Set up monitoring and alerting" 