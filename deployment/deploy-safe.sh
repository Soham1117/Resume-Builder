#!/bin/bash

# Resume Builder - Safe Deployment Script
# This script safely deploys the Resume Builder application without affecting existing apps
# Assumes: PostgreSQL is running, other applications are using the same database server

set -e

echo "🛡️  Starting SAFE Resume Builder deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as ubuntu
CURRENT_USER=$(whoami)
if [ "$CURRENT_USER" != "ubuntu" ]; then
    print_error "This script should be run as ubuntu user. Current user: $CURRENT_USER"
    exit 1
fi

# Configuration
APP_DIR="/opt/resume-builder"
APP_USER="ubuntu"
JAR_NAME="resume-updater.jar"
DB_NAME="resumedb"
DB_USER="resumeuser"

print_status "Running as user: $CURRENT_USER"
print_warning "⚠️  SAFETY CHECKS: This script will NOT affect existing applications or their data"

# =====================================================
# SAFETY CHECKS
# =====================================================

print_status "Performing safety checks..."

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL is not running. Please start it first:"
    print_error "sudo systemctl start postgresql"
    exit 1
fi

# Check existing databases (SAFE - read-only operation)
print_status "Checking existing databases..."
EXISTING_DBS=$(sudo -u postgres psql -t -c "SELECT datname FROM pg_database WHERE datname NOT IN ('template0', 'template1', 'postgres');" | tr -d ' ' | grep -v '^$')

if [ ! -z "$EXISTING_DBS" ]; then
    print_warning "Found existing databases:"
    echo "$EXISTING_DBS" | while read db; do
        echo "  - $db"
    done
    print_warning "These databases will NOT be affected"
fi

# Check if our database already exists
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_warning "Database '$DB_NAME' already exists. Checking if it's safe to use..."
    
    # Check if database has tables (indicating it's in use)
    TABLE_COUNT=$(sudo -u postgres psql -d $DB_NAME -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    if [ "$TABLE_COUNT" -gt 0 ]; then
        print_warning "Database '$DB_NAME' has $TABLE_COUNT tables. This might be in use by another application."
        read -p "Do you want to continue? This will use the existing database. (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled."
            exit 1
        fi
    fi
fi

# =====================================================
# INSTALL DEPENDENCIES
# =====================================================

print_status "Checking and installing dependencies..."

# Install Java 21 if not already installed
if ! java -version 2>&1 | grep -q "version \"21"; then
    print_status "Installing Java 21..."
    sudo apt update
    sudo apt install -y openjdk-21-jdk
else
    print_status "Java 21 is already installed"
fi

# =====================================================
# DATABASE SETUP (SAFE)
# =====================================================

print_status "Setting up database (SAFE mode)..."

# Create database only if it doesn't exist
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_status "Creating database '$DB_NAME'..."
    sudo -u postgres createdb $DB_NAME
else
    print_status "Database '$DB_NAME' already exists"
fi

# Create user only if it doesn't exist
if ! sudo -u postgres psql -t -c "SELECT 1 FROM pg_user WHERE usename = '$DB_USER';" | grep -q 1; then
    print_status "Creating user '$DB_USER'..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD 'your_secure_password_here';"
else
    print_status "User '$DB_USER' already exists"
fi

# Grant privileges (safe - won't affect existing data)
print_status "Granting database privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || true

# Grant schema permissions (safe - only affects our database)
print_status "Granting schema permissions..."
sudo -u postgres psql -d $DB_NAME -c "GRANT USAGE ON SCHEMA public TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;" 2>/dev/null || true

# =====================================================
# APPLICATION SETUP
# =====================================================

print_status "Setting up application..."

# Create application directory structure
sudo mkdir -p $APP_DIR
sudo mkdir -p $APP_DIR/generated-pdfs
sudo mkdir -p $APP_DIR/logs
sudo chown -R $APP_USER:$APP_USER $APP_DIR

# Build the application
print_status "Building the Spring Boot application..."
if [ ! -f "pom.xml" ]; then
    print_error "pom.xml not found. Please run this script from the project root directory."
    exit 1
fi

# Set Maven options for better performance (reduced for smaller instances)
export MAVEN_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"

print_status "Running Maven build (this may take a few minutes)..."
print_status "Maven options: $MAVEN_OPTS"

# Run Maven with timeout
timeout 300 mvn clean package -DskipTests

if [ $? -eq 124 ]; then
    print_error "Maven build timed out after 5 minutes"
    print_error "This might be due to network issues or large dependencies"
    print_status "Trying with offline mode..."
    mvn clean package -DskipTests -o
fi

# Check if build was successful
if [ ! -f "target/resume-updater-1.0.0.jar" ]; then
    print_error "Build failed! JAR file not found."
    exit 1
fi

# Install the application
print_status "Installing the application..."
sudo cp target/resume-updater-1.0.0.jar $APP_DIR/$JAR_NAME
sudo chown $APP_USER:$APP_USER $APP_DIR/$JAR_NAME

# Create environment file placeholder
print_status "Creating environment file placeholder..."
print_warning "⚠️  You need to copy your .env file to the server manually"
print_status "Expected location: $APP_DIR/.env"
print_status ""
print_status "Example scp command:"
print_status "  scp .env ubuntu@your-ec2-ip:/opt/resume-builder/.env"
print_status ""
print_status "Or copy from your local machine:"
print_status "  scp /path/to/your/.env ubuntu@your-ec2-ip:/opt/resume-builder/.env"
print_status ""



# =====================================================
# SYSTEMD SERVICE SETUP
# =====================================================

print_status "Setting up systemd service..."

# Create systemd service file
sudo tee /etc/systemd/system/resume-builder.service > /dev/null <<EOF
[Unit]
Description=Resume Builder Spring Boot Application
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/java -jar $APP_DIR/$JAR_NAME
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=10

# Environment variables
Environment="JAVA_OPTS=-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseStringDeduplication"
Environment="SERVER_PORT=8080"
Environment="SERVER_CONTEXT_PATH=/api"
Environment="DB_HOST=localhost"
Environment="DB_PORT=5432"
Environment="DB_NAME=$DB_NAME"
Environment="DB_USERNAME=$DB_USER"
Environment="DB_PASSWORD=your_secure_password_here"
Environment="JWT_SECRET=your_super_secure_jwt_secret_here"
Environment="LLM_API_KEY=your_llm_api_key_here"
Environment="OPENAI_API_KEY=your_openai_api_key_here"

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=false
ReadWritePaths=$APP_DIR/generated-pdfs $APP_DIR/logs /home/ubuntu

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=resume-builder

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable resume-builder

# =====================================================
# START APPLICATION
# =====================================================

print_status "Starting the application..."
sudo systemctl start resume-builder

# Wait for application to start
print_status "Waiting for application to start..."
sleep 15

# Check if .env file exists
print_status "Checking for .env file..."
if [ ! -f "$APP_DIR/.env" ]; then
    print_warning "⚠️  .env file not found. Application may not start properly."
    print_status "Please copy your .env file to $APP_DIR/.env"
    print_status "Example: scp .env ubuntu@your-ec2-ip:/opt/resume-builder/.env"
    print_status ""
    read -p "Do you want to continue without .env file? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment paused. Please copy .env file and restart the service manually."
        print_status "After copying .env file, run: sudo systemctl restart resume-builder"
        exit 0
    fi
else
    print_status "✅ .env file found"
    chmod 600 $APP_DIR/.env
fi

# Check if application is running
print_status "Checking application status..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Checking logs..."
    sudo journalctl -u resume-builder --no-pager -n 20
    print_warning "This might be due to missing .env file or configuration issues."
    print_status "Check the logs above and ensure .env file is properly configured."
    exit 1
fi

# =====================================================
# UTILITY SCRIPTS
# =====================================================

print_status "Creating utility scripts..."

# Health check script
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

sudo chmod +x $APP_DIR/health-check.sh

# Quick update script
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
cp /opt/resume-builder/resume-updater.jar /opt/resume-builder/resume-updater.jar.backup

# Install new version
cp target/resume-updater-1.0.0.jar /opt/resume-builder/resume-updater.jar

# Start application
sudo systemctl start resume-builder

# Wait and check
sleep 10
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "✅ Update successful!"
    rm /opt/resume-builder/resume-updater.jar.backup
else
    echo "❌ Update failed, rolling back..."
    sudo systemctl stop resume-builder
    cp /opt/resume-builder/resume-updater.jar.backup /opt/resume-builder/resume-updater.jar
    sudo systemctl start resume-builder
    exit 1
fi
EOF

sudo chmod +x $APP_DIR/update.sh



# =====================================================
# DEPLOYMENT COMPLETE
# =====================================================

print_status "🎉 SAFE deployment completed successfully!"
print_status ""
print_status "Application is running at: http://localhost:8080/api"
print_status "Health check: http://localhost:8080/api/health"
if [ -f "/etc/nginx/sites-available/aetherdash" ]; then
    print_status "Nginx endpoint: https://aetherdash.xyz/resume/api/"
    print_status "Nginx health: https://aetherdash.xyz/resume/health"
fi
print_status ""
print_status "Useful commands:"
print_status "  Check status: sudo systemctl status resume-builder"
print_status "  View logs: sudo journalctl -u resume-builder -f"
print_status "  Restart: sudo systemctl restart resume-builder"
print_status "  Quick update: $APP_DIR/update.sh"
print_status "  Health check: $APP_DIR/health-check.sh"
print_status ""
print_warning "⚠️  IMPORTANT: Copy your .env file to the server:"
print_warning "  scp .env ubuntu@your-ec2-ip:/opt/resume-builder/.env"
print_warning ""
print_warning "⚠️  Database information:"
print_warning "  Database: $DB_NAME"
print_warning "  User: $DB_USER"
print_warning "  Password: your_secure_password_here (CHANGE THIS!)"
print_warning ""
print_status "✅ All existing applications and data are safe!" 